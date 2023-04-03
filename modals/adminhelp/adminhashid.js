import { EmbedBuilder } from 'discord.js';

export default {
    data: {
        name: "adminhashid",
    },
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#008be0")
            .setTitle(`🔹 ${interaction.user.username} Hash-ID`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(`
                **Discord User:** <@${interaction.user.id}>
                **Hash ID: **\`${interaction.fields.getTextInputValue('hashId')}\`
                **In-game name: **\`${interaction.fields.getTextInputValue('ingameName')}\`
                **Clan Tag: **\`${interaction.fields.getTextInputValue('clanTag')}\`
                **Time Zone: **\`${interaction.fields.getTextInputValue('timeZone')}\`
            `)
        await interaction.member.guild.channels.cache.get('995773577473310771').send({ embeds: [embed] })
        await interaction.reply({
            content: `Success! Max will get you in the following days and will PM you your PRISM information.`,
            ephemeral: true,
        })
    }
};
