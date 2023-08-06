
import { EntityName, EventArgs, EventSubscriber, QueryOrder } from "@mikro-orm/core";
import { EmbedBuilder, GuildMember } from "discord.js";

import logger from "../../logger.js";
import { Client } from "../../client.js";
import { User } from "../../db/entities/user.js";
import { Role } from "../../db/entities/role.js";
import { prism } from "../../config.js";
import { Commands } from "./client/commands.js";
import { Error, errorToEmbed } from "./client/responses.js";


const log = logger("PRISM::Accounts");


function generatePassword(): string {
    return Math.random().toString(6).slice(-8);
}

function prepareDM(name: string, password: string): EmbedBuilder {
    const embed = new EmbedBuilder()

    embed.setTitle("PRISM Details")
    embed.setDescription(`Client: https://files.realitymod.com/PRISM/PRISM.zip
Data: https://files.realitymod.com/PRISM/Data.zip`)

    embed.addFields([
        {
            name: "Host", value: `${prism.ip}: ${prism.port}`,
        }, {
            name: "Username", value: name,
        }, {
            name: "Password", value: password,
        }
    ])

    return embed
}

class Accounts {
    client: Client
    commands: Commands

    constructor(client: Client) {
        this.client = client;
        this.commands = client.prism.commands;
    }

    async create(user: User) {
        const guild = await this.client.guild();
        const member = guild.members.cache.get(user.discordID);

        if (!member) {
            log(`Attemped to create account of user no longer in Discord Guild: ${user.discordID}`)
            // TODO: remove DB object
            return
        }

        const password = generatePassword()

        const roles = await user.roles.matching({ orderBy: { level: QueryOrder.ASC_NULLS_LAST, prism: QueryOrder.DESC } })

        if (roles.length > 0 && roles[0].prism) {
            this.commands.addUser(user.ign, password, roles[0].level || 0)
                .then(this.sendDM(member, user.ign, password))
                .catch(this.sendError(member))
        }
    }

    async changeName(user: User, oldName: string) {
        const accounts = await this.commands.getUsers();

        const acc = accounts.find(u => u.name === oldName);
        if (!acc) {
            log(`Attemped to change name of non-existing account: ${oldName}`)
            await this.create(user)
            return
        }

        const guild = await this.client.guild();
        const member = guild.members.cache.get(user.discordID);

        if (!member) {
            return
        }

        const password = generatePassword()

        this.commands.changeUser(oldName, user.ign, password, acc.level)
            .then(this.sendDM(member, user.ign, password))
            .catch(this.sendError(member))
    }

    async updateLevel(user: User) {
        const accounts = await this.commands.getUsers();

        const acc = accounts.find(u => u.name === user.ign);
        if (!acc) {
            log(`Attemped to change level of non-existing account: ${user.ign}`)
            await this.create(user)
            return
        }

        const guild = await this.client.guild();
        const member = guild.members.cache.get(user.discordID);

        if (!member) {
            return
        }

        const roles = await user.roles.matching({ orderBy: { level: QueryOrder.ASC_NULLS_LAST, prism: QueryOrder.DESC } })

        if (roles.length > 0 && roles[0].prism) {
            this.commands.changeUser(user.ign, user.ign, "", roles[0].level || acc.level).catch(log)
        }
    }

    async delete(user: User) {
        this.commands.deleteUser(user.ign)
            .then(() => log(`Removed user ${user.ign}`))
            .catch(log)
    }

    sendDM(member: GuildMember, name: string, password: string) {
        return async function() {
            const dm = await member.createDM();
            dm.send({
                embeds: [prepareDM(name, password)]
            }).catch(() => {
                // TODO: tag user in common channel, tell him to reset password (unable to send DM)
            });
        }
    }

    sendError(member: GuildMember) {
        return async function(error: Error) {
            const dm = await member.createDM();
            dm.send({
                embeds: [errorToEmbed(error)]
            }).catch(() => {
                // TODO: tag user in common channel, tell him his account wasn't created/updated
            });
        }
    }
}

class RoleSubscriber implements EventSubscriber<Role> {
    client: Client;
    accounts: Accounts;

    constructor(client: Client, accounts: Accounts) {
        this.client = client;
        this.accounts = accounts
    }

    async syncAccounts(role: Role) {
        const em = this.client.em.fork()

        role.users.toArray().forEach(async u => {
            const user = await em.findOne(User, { discordID: u.discordID })

            if (user) {
                this.accounts.updateLevel(user);
            }
        })
    }

    async removeAccounts(role: Role) {
        const em = this.client.em.fork()

        role.users.toArray().forEach(async u => {
            const user = await em.findOne(User, { discordID: u.discordID });
            if (user) {
                const roles = await user.roles.matching({ where: { prism: true }, orderBy: { level: QueryOrder.ASC_NULLS_LAST } })
                if (roles.length === 0) {
                    this.accounts.delete(user);
                }
            }
        })
    }

    getSubscribedEntities(): EntityName<Role>[] {
        return [Role];
    }

    async afterUpdate(args: EventArgs<Role>) {
        if (!args.entity.prism && args.changeSet && args.changeSet.originalEntity?.prism === true) {
            await this.removeAccounts(args.entity);
            return
        }

        if (args.changeSet && args.changeSet.originalEntity?.level !== args.entity.level) {
            this.syncAccounts(args.entity)
        }
    }

    async afterCreate(args: EventArgs<Role>) {
        if (args.entity.prism) {
            await this.syncAccounts(args.entity);
        }
    }

    async afterDelete(args: EventArgs<Role>) {
        await this.removeAccounts(args.entity);
    }
}

class UserSubscriber implements EventSubscriber<User> {
    accounts: Accounts;

    constructor(accounts: Accounts) {
        this.accounts = accounts;
    }

    getSubscribedEntities(): EntityName<User>[] {
        return [User];
    }

    async afterUpdate(args: EventArgs<User>) {
        if (args.changeSet && args.changeSet.entity.ign !== args.entity.ign) {
            await this.accounts.changeName(args.entity, args.changeSet.entity.ign)
        }
    }

    async afterCreate(args: EventArgs<User>) {
        await this.accounts.create(args.entity)
    }

    async afterDelete(args: EventArgs<User>) {
        await this.accounts.delete(args.entity)
    }
}

export const registerPRISMAccounts = (client: Client) => {
    const evm = client.em.getEventManager();

    const accounts = new Accounts(client);

    evm.registerSubscriber(new RoleSubscriber(client, accounts));
    evm.registerSubscriber(new UserSubscriber(accounts));
}
