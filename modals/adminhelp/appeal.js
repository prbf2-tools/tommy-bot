import { EmbedBuilder } from "discord.js";

import config from "../../config.js";

export default {
    data: {
        name: "appeal",
    },
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#7faf5d")
            .setTitle(`🟢 ${interaction.user.username} Ban Appeal`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(`
                **Hash ID: **
                \`${interaction.fields.getTextInputValue("hashId")}\`\n
                **In-game name: **
                \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                **What did he do: **
                ${interaction.fields.getTextInputValue("why")}\n
            `);
        await interaction.member.guild.channels.cache.get(config.contactadmin.appeal.public.channelID).threads.create({
            name: `🟢 ${interaction.user.username}'s Appeal`,
            message: {
                content: `<@&${config.contactadmin.adminRoleID}>`,
                embeds: [embed]
            },
            appliedTags: config.contactadmin.appeal.public.tags
        })
            .then(threadChannel => {
                threadChannel.members.add(interaction.user.id);
                interaction.reply({
                    content: `Success! Please check <#${threadChannel.id}>!`,
                    ephemeral: true
                });
                const embed = new EmbedBuilder()
                    .setColor("#7faf5d")
                    .setTitle(`🔒🟢 ${interaction.user.username} Ban Appeal`)
                    .setThumbnail(interaction.user.avatarURL())
                    .setDescription(`
                    **Public Thread:**
                    <#${threadChannel.id}>\n
                    **Hash ID: **
                    \`${interaction.fields.getTextInputValue("hashId")}\`\n
                    **In-game name: **
                    \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                    **The bannable offence: **
                    ${interaction.fields.getTextInputValue("why")}\n
                `);
                interaction.member.guild.channels.cache.get(config.contactadmin.appeal.private.channelID).threads.create({
                    name: `🔒🟢 ${interaction.user.username}'s Appeal`,
                    message: {
                        content: `<@&${config.contactadmin.adminRoleID}>`,
                        embeds: [embed]
                    },
                    appliedTags: config.contactadmin.appeal.private.tags
                });
            });
    }
};
