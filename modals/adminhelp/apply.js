const { EmbedBuilder } = require('discord.js');
require("dotenv").config();

module.exports = {
    data: {
        name: "apply",
    },
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor("#0074ba")
            .setTitle(`🔵 ${interaction.user.username} Admin Application`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(`
                **Hash ID: **
                \`${interaction.fields.getTextInputValue('hashId')}\`\n
                **In-game name: **
                \`${interaction.fields.getTextInputValue('ingameName')}\`\n
                **Time Zone: **
                ${interaction.fields.getTextInputValue('timeZone')}\n
                **Willing to seed: **
                ${interaction.fields.getTextInputValue('seed')}\n
                **How active: **
                ${interaction.fields.getTextInputValue('active')}\n
            `)
        await interaction.member.guild.channels.cache.get('1021942980950634597').threads.create({
            name: `🔵 ${interaction.user.username}'s Application`,
            message: {
                content: `<@&${process.env.ADMIN_ID}>`, 
                embeds: [embed]
            },
            appliedTags: ['1021973497645387816']
        })
        .then(threadChannel => {
            threadChannel.members.add(interaction.user.id);
            interaction.reply({
                content: `Success! Please check <#${threadChannel.id}>!`,
                ephemeral: true
            })
            const embed = new EmbedBuilder()
                .setColor("#0074ba")
                .setTitle(`🔒🔵 ${interaction.user.username} Admin Application`)
                .setThumbnail(interaction.user.avatarURL())
                .setDescription(`
                    **Public Thread:**
                    <#${threadChannel.id}>\n
                    **Hash ID: **
                    \`${interaction.fields.getTextInputValue('hashId')}\`\n
                    **In-game name: **
                    \`${interaction.fields.getTextInputValue('ingameName')}\`\n
                    **Time Zone: **
                    ${interaction.fields.getTextInputValue('timeZone')}\n
                    **Willing to seed: **
                    ${interaction.fields.getTextInputValue('seed')}\n
                    **How active: **
                    ${interaction.fields.getTextInputValue('active')}\n
                `)
            interaction.member.guild.channels.cache.get('1022285742799589416').threads.create({
                name: `🔒🔵 ${interaction.user.username}'s Application`,
                message: {
                    content: `<@&${process.env.ADMIN_ID}>`, 
                    embeds: [embed]
                },
                appliedTags: ['1022300221981593662']
            })
        });
    }
}