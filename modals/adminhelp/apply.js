import { EmbedBuilder } from "discord.js";

import config from "../../config.js";

export default {
    data: {
        name: "apply",
    },
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#0074ba")
            .setTitle(`🔵 ${interaction.user.username} Admin Application`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(`
                **Hash ID: **
                \`${interaction.fields.getTextInputValue("hashId")}\`\n
                **In-game name: **
                \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                **Time Zone: **
                ${interaction.fields.getTextInputValue("timeZone")}\n
                **Willing to seed: **
                ${interaction.fields.getTextInputValue("seed")}\n
                **How active: **
                ${interaction.fields.getTextInputValue("active")}\n
            `);
        await interaction.member.guild.channels.cache.get(config.contactadmin.application.public.channelID).threads.create({
            name: `🔵 ${interaction.user.username}'s Application`,
            message: {
                content: `<@&${config.contactadmin.adminRoleID}>`,
                embeds: [embed]
            },
            appliedTags: config.contactadmin.application.public.tags
        })
            .then(threadChannel => {
                threadChannel.members.add(interaction.user.id);
                interaction.reply({
                    content: `Success! Please check <#${threadChannel.id}>!`,
                    ephemeral: true
                });
                const embed = new EmbedBuilder()
                    .setColor("#0074ba")
                    .setTitle(`🔒🔵 ${interaction.user.username} Admin Application`)
                    .setThumbnail(interaction.user.avatarURL())
                    .setDescription(`
                    **Public Thread:**
                    <#${threadChannel.id}>\n
                    **Hash ID: **
                    \`${interaction.fields.getTextInputValue("hashId")}\`\n
                    **In-game name: **
                    \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                    **Time Zone: **
                    ${interaction.fields.getTextInputValue("timeZone")}\n
                    **Willing to seed: **
                    ${interaction.fields.getTextInputValue("seed")}\n
                    **How active: **
                    ${interaction.fields.getTextInputValue("active")}\n
                `);
                interaction.member.guild.channels.cache.get(config.contactadmin.application.private.channelID).threads.create({
                    name: `🔒🔵 ${interaction.user.username}'s Application`,
                    message: {
                        content: `<@&${config.contactadmin.adminRoleID}>`,
                        embeds: [embed]
                    },
                    appliedTags: config.contactadmin.application.private.tags
                });
            });
    }
};
