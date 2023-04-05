import dotenv from "dotenv";
dotenv.config();

import { EmbedBuilder } from "discord.js";

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
        await interaction.member.guild.channels.cache.get("1021942980950634597").threads.create({
            name: `🟢 ${interaction.user.username}'s Appeal`,
            message: {
                content: `<@&${process.env.ADMIN_ID}>`,
                embeds: [embed]
            },
            appliedTags: ["1021973561918902333"]
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
                interaction.member.guild.channels.cache.get("1022285742799589416").threads.create({
                    name: `🔒🟢 ${interaction.user.username}'s Appeal`,
                    message: {
                        content: `<@&${process.env.ADMIN_ID}>`,
                        embeds: [embed]
                    },
                    appliedTags: ["1022300302659039272"]
                });
            });
    }
};
