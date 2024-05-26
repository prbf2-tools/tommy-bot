import { EmbedBuilder } from "discord.js";

import config from "../../config.js";

export default {
    data: {
        name: "report",
    },
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#d03147")
            .setTitle(`🔴 ${interaction.user.username} Report Incident`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(`
                **In-game name of the player: **
                \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                **Map name: **
                \`${interaction.fields.getTextInputValue("map")}\`\n
                **Date and aproximative time: **
                ${interaction.fields.getTextInputValue("dateTime")}\n
                **What happened: **
                ${interaction.fields.getTextInputValue("what")}\n
            `);
        await interaction.member.guild.channels.cache.get(config.contactadmin.report.public.channelID).threads.create({
            name: `🔴 ${interaction.user.username}'s Report`,
            message: {
                content: `<@&${config.contactadmin.adminRoleID}>`,
                embeds: [embed]
            },
            appliedTags: config.contactadmin.report.public.tags
        })
            .then(threadChannel => {
                threadChannel.members.add(interaction.user.id);
                interaction.reply({
                    content: `Success! Please check <#${threadChannel.id}>!`,
                    ephemeral: true
                });
                const embed = new EmbedBuilder()
                    .setColor("#d03147")
                    .setTitle(`🔒🔴 ${interaction.user.username} Report Incident`)
                    .setThumbnail(interaction.user.avatarURL())
                    .setDescription(`
                        **Public Thread:**
                        <#${threadChannel.id}>\n
                        **In-game name of the player: **
                        \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                        **Map name: **
                        \`${interaction.fields.getTextInputValue("map")}\`\n
                        **Date and aproximative time: **
                        ${interaction.fields.getTextInputValue("dateTime")}\n
                        **What happened: **
                        ${interaction.fields.getTextInputValue("what")}\n
                    `);
                interaction.member.guild.channels.cache.get(config.contactadmin.report.private.channelID).threads.create({
                    name: `🔒🔴 ${interaction.user.username}'s Report`,
                    message: {
                        content: `<@&${config.contactadmin.adminRoleID}>`,
                        embeds: [embed]
                    },
                    appliedTags: config.contactadmin.report.private.tags
                });
            });
    }
};
