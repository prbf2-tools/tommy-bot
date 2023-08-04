import { writeFile, readdir } from "fs/promises";

import { EntityName, EventSubscriber } from "@mikro-orm/core";
import { Client } from "../../client.js";
import { User } from "../../entities/user.js";
import { Role } from "../../entities/role.js";
import { GuildMember, PartialGuildMember } from "discord.js";


class RAConfigRenderer implements EventSubscriber<User | Role> {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    async render() {
        const em = this.client.em.fork();
        const roles = await em.find(Role, {});

        const rolesMap = new Map<string, Role>();
        roles.forEach(role => {
            rolesMap.set(role.discordID, role);
        })

        const users = await em.find(User, {});

        const guild = await this.client.guild();

        const dRoles = await guild.roles.fetch()
        const usedRoles = dRoles.filter((_, id) => {
            return rolesMap.has(id)
        })

        const admins: { [key: string]: { discordID: string, ign: string, level: number } } = {};

        usedRoles.forEach(dRole => {
            const level = rolesMap.get(dRole.id)?.level;
            if (level === undefined || level === null) return;

            users.forEach(user => {
                if (!dRole.members.has(user.discordID)) return;

                if (admins[user.hash] === undefined) {
                    admins[user.hash] = {
                        ign: user.ign,
                        discordID: user.discordID,
                        level: 777,
                    };
                }

                const currentLevel = admins[user.hash].level;
                if (
                    currentLevel === undefined ||
                    currentLevel > level
                ) {
                    admins[user.hash].level = level;
                }
            })
        })

        await writeFile("./data/admins.json", JSON.stringify(admins))
    }

    getSubscribedEntities(): EntityName<User | Role>[] {
        return [User, Role];
    }

    async afterUpdate() {
        this.render();
    }

    async afterCreate() {
        this.render();
    }

    async afterDelete() {
        this.render();
    }
}

export const registerRARenderer = (client: Client) => {
    const renderer = new RAConfigRenderer(client)

    const em = client.em.getEventManager();

    em.registerSubscriber(renderer);

    client.on("guildMemberUpdate", (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) => {
        // Role removed or added
        if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
            renderer.render();
        }
    })
}
