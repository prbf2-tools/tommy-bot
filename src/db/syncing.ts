import { GuildMember, PartialGuildMember, Role as DiscordRole } from "discord.js";

import { Client } from "../client.js";
import { Role } from "./entities/role.js";
import { User } from "./entities/user.js";

export function registerDBSyncing(client: Client) {
    client.on("guildMemberUpdate", async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) => {
        // Role removed or added
        if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
            const em = client.em.fork()
            const roles = await em.find(Role, {
                discordID: {
                    $in: newMember.roles.cache.map(r => r.id),
                }
            })

            const user = await em.findOne(User, { discordID: newMember.id });

            if (user) {
                user.roles.set(roles);
            }
        }
    })

    client.on("roleDelete", async (role: DiscordRole) => {
        const em = client.em.fork()
        const dbRole = await em.findOne(Role, { discordID: role.id })
        if (dbRole !== null) {
            em.removeAndFlush(dbRole)
        }
    })
}
