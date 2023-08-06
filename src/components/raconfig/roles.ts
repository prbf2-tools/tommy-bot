import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";

import { Client } from "../../client.js";
import { Role } from "../../db/entities/role.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription(
            "Setup Discord role to PR server (omit all options to list existing)"
        )
        .addRoleOption(
            option => option
                .setName("role")
                .setDescription("Discord role")
        )
        .addNumberOption(
            option => option
                .setName("level")
                .setDescription("Reality Admin commands level - leave empty to set as 777 (public)")
        )
        .addBooleanOption(
            option => option
                .setName("reservedslot")
                .setDescription("Whether this role should receive reserved slot")
        )
        .addBooleanOption(
            option => option
                .setName("prism")
                .setDescription("Whether this role should receive PRISM account")
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const role = interaction.options.getRole("role");
        const level = interaction.options.getNumber("level");
        const reservedSlot = interaction.options.getBoolean("reservedslot");
        const prism = interaction.options.getBoolean("prism");

        const em = client.em.fork();

        if (role !== null) {
            let dbRole = await em.findOne(Role, { discordID: role.id });

            if (!dbRole) {
                dbRole = em.create(Role, {
                    discordID: role.id,
                    level,
                    reservedSlot: reservedSlot || false,
                    prism: prism || false,
                });
            } else {
                if (level !== null) {
                    dbRole.level = level;
                }
                if (reservedSlot !== null) {
                    dbRole.reservedSlot = reservedSlot;
                }
                if (prism !== null) {
                    dbRole.prism = prism;
                }
            }

            if (level === null && reservedSlot === null && prism === null) {
                em.remove(dbRole);
            }
        }

        await em.flush()


        const embed = new EmbedBuilder()
            .setColor("#0074ba")
            .setTitle("Discord roles to PR configs");

        const roles = await em.find(Role, {});

        roles.forEach((r) => {
            embed.addFields({
                name: `Role`,
                value: `<@&${r.discordID}> | Lvl: ${r.level} | Slot: ${r.reservedSlot} | PRISM: ${r.prism}`,
                inline: false,
            })
        })

        await interaction.reply({
            embeds: [embed],
        });
    },
};


export default {
    command,
};
