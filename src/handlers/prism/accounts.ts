
import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { GuildMember, PartialGuildMember } from "discord.js";

import { Client } from "../../client.js";
import { User } from "../../entities/user.js";
import { Role } from "../../entities/role.js";


interface PRISMUser {
    oldName?: string
    name: string
    password: string
    level: number
}

const ADD_USER = "adduser";
const CHANGE_USER = "changeuser";
const DELETE_USER = "deleteuser"

class PRISMAccounts {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    listAccounts() {
        // TODO: reading responses
    }

    createAccount(user: PRISMUser) {
        this.client.prism.send(ADD_USER, user.name, user.password, user.level.toString())
    }

    updateAccount(user: PRISMUser) {
        const oldName = user.oldName || user.name
        this.client.prism.send(CHANGE_USER, oldName, user.name, user.password, user.level.toString())
    }

    deleteAccount(name: string) {
        this.client.prism.send(DELETE_USER, name)
    }
}


class RoleSubscriber implements EventSubscriber<Role> {
    client: Client;
    accounts: PRISMAccounts;

    constructor(client: Client, accounts: PRISMAccounts) {
        this.client = client;
        this.accounts = accounts;
    }

    async createAccounts(role: Role) {
        if (role.prism !== true) {
            return
        }

        const em = this.client.em.fork();

        const guild = await this.client.guild();

        await guild.members.fetch()

        const discordRole = guild.roles.cache.get(role.discordID);

        console.log(discordRole?.members)

        discordRole?.members.forEach(async (member: GuildMember) => {
            const user = await em.findOne(User, { discordID: member.id });

            if (!user) {
                return
            }

            if (!user.prismCreated) {
                const level = role.level || 0;

                const password = Math.random().toString(36).slice(-8);

                this.accounts.createAccount({
                    name: user.ign,
                    password: password,
                    level: level,
                });

                user.prismCreated = true;

                const dm = await member.createDM();

                dm.send(`
Client: https://files.realitymod.com/PRISM/PRISM.zip
Data: https://files.realitymod.com/PRISM/Data.zip

Host: 185.132.132.54:4712
Username: ${user.ign}
Password: ${password}`).catch(console.error)
            }
        })

        em.flush();
    }

    getSubscribedEntities(): EntityName<Role>[] {
        return [Role];
    }

    async afterUpdate(args: EventArgs<Role>) {
        await this.createAccounts(args.entity)
    }

    async afterCreate(args: EventArgs<Role>) {
        await this.createAccounts(args.entity)
    }

    async afterDelete() {
    }
}

export const registerPRISMAccounts = (client: Client) => {
    const accounts = new PRISMAccounts(client)

    const em = client.em.getEventManager();

    em.registerSubscriber(new RoleSubscriber(client, accounts));

    // client.on("guildMemberUpdate", (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) => {
    //     // Role removed or added
    //     if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    //         creator.updateMemberAcc(newMember as GuildMember)
    //     }
    // })
}
