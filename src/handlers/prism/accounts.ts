
import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { GuildMember, PartialGuildMember } from "discord.js";

import { Client } from "../../client.js";
import { User } from "../../entities/user.js";
import { Role } from "../../entities/role.js";


class RoleSubscriber implements EventSubscriber<Role> {
    client: Client;

    constructor(client: Client) {
        this.client = client;
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

                await this.client.prism.commands.addUser(user.ign, password, level)

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

class UserSubscriber implements EventSubscriber<User> {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    async createAccounts(user: User) {
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

                await this.client.prism.commands.addUser(user.ign, password, level)

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

    getSubscribedEntities(): EntityName<User>[] {
        return [User];
    }

    async afterUpdate(args: EventArgs<User>) {
        await this.createAccounts(args.entity)
    }

    async afterCreate(args: EventArgs<User>) {
        await this.createAccounts(args.entity)
    }

    async afterDelete() {
    }
}

export const registerPRISMAccounts = (client: Client) => {
    const em = client.em.getEventManager();

    em.registerSubscriber(new RoleSubscriber(client));
    em.registerSubscriber(new UserSubscriber(client));

    // client.on("guildMemberUpdate", (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) => {
    //     // Role removed or added
    //     if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    //         creator.updateMemberAcc(newMember as GuildMember)
    //     }
    // })
}
