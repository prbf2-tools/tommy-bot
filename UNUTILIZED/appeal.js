const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
    data: {
        name: "appeal",
    },
    async execute(interaction) {
        await interaction.channel.threads
            .create({
                name: `🟢 ${interaction.user.username}'s Appeal`,
                autoArchiveDuration: 4320,
                reason: "Created a tomato",
            })
            .then(threadChannel => {
                threadChannel.members.add(interaction.user.id);
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
                threadChannel.send({content: `<@&${process.env.ADMIN_ID}>`, embeds: [embed]});
                interaction.reply({
                    content: `Success! Please check <#${threadChannel.id}>!`,
                    ephemeral: true
                });
                setTimeout(() => interaction.channel.messages.delete(threadChannel.id), 120000);
                interaction.member.guild.channels.cache.get("995395680757624985").threads.create({
                    name: `🔒🟢 ${interaction.user.username}'s Appeal`,
                    autoArchiveDuration: 4320,
                    reason: "Created a private tomato",
                })
                    .then(threadPChannel => {
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
                            **What did he do: **
                            ${interaction.fields.getTextInputValue("why")}\n
                            `);
                        threadPChannel.send({content: `<@&${process.env.ADMIN_ID}>`, embeds: [embed]});
                    });
            });
    }
};