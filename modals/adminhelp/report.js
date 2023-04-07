import dotenv from "dotenv";
dotenv.config();

import { EmbedBuilder } from "discord.js";
import { registerChannel } from "../../helpers/channels.js";

// "1021942980950634597"
const publicReportCh = registerChannel("PUBLIC_REPORT");
// "1022285742799589416"
const privateReportCh = registerChannel("PRIVATE_REPORT");

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
        await interaction.member.guild.channels.cache.get(publicReportCh()).threads.create({
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
                interaction.member.guild.channels.cache.get(privateReportCh()).threads.create({
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
