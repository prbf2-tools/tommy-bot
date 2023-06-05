import { EventSubscriber } from "@mikro-orm/core";
import { Client } from "../../client.js";
import { User } from "../../entities/user.js";
import { Role } from "../../entities/role.js";
import { GuildMember } from "discord.js";

class RAConfigRenderer implements EventSubscriber {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    render = async () => {
        const roles = await this.client.em.find(Role, {});
        const rolesMap = new Map<string, Role>();
        roles.forEach(role => {
            rolesMap.set(role.discordID, role);
        })

        const users = await this.client.em.find(User, {});

        const guild = await this.client.guild();

        const dRoles = await guild.roles.fetch()
        const usedRoles = dRoles.filter((_, id) => {
            return id in rolesMap;
        })

        const levelsMap: { [key: string]: number } = {};

        usedRoles.forEach(dRole => {
            const level = rolesMap.get(dRole.id)?.level;
            if (level === undefined || level === null) return;

            users.forEach(user => {
                if (!dRole.members.has(user.discordID)) return;

                const currentLevel = levelsMap[user.hash];
                if (
                    currentLevel === undefined ||
                    currentLevel > level
                ) {
                    levelsMap[user.hash] = level;
                }
            })
        })
    }

    afterUpdate = () => {
        this.render();
    }

    afterCreate = () => {
        this.render();
    }

    afterDelete = () => {
        this.render();
    }
}

export const registerEvents = (client: Client) => {
    const em = client.em.getEventManager();

    em.registerSubscriber(new RAConfigRenderer(client) as EventSubscriber<Role>);
    em.registerSubscriber(new RAConfigRenderer(client) as EventSubscriber<User>);
}
