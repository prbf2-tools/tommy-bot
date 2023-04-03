import * as dotenv from "dotenv";
dotenv.config();

import { EmbedBuilder } from "discord.js";

export default {
    data: {
        name: "report",
    },
    async execute(interaction, client) {
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
        await interaction.member.guild.channels.cache.get("1021942980950634597").threads.create({
            name: `🔴 ${interaction.user.username}'s Report`,
            message: {
                content: `<@&${process.env.ADMIN_ID}>`,
                embeds: [embed]
            },
            appliedTags: ["1021973747546210305"]
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
                interaction.member.guild.channels.cache.get("1022285742799589416").threads.create({
                    name: `🔒🔴 ${interaction.user.username}'s Report`,
                    message: {
                        content: `<@&${process.env.ADMIN_ID}>`,
                        embeds: [embed]
                    },
                    appliedTags: ["1022300442023186462"]
                });
            });
    }
};
