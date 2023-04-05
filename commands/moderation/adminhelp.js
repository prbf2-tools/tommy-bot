import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    ButtonStyle,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("adminhelp")
        .setDescription("Prompt buttons for Ban Appeals, Admin Application and Reports"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0074ba')
            .setTitle('🔷 Admin Remote Commands')
            .setDescription(`
                **\`WIP\`**`);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('searchPlayer')
                    .setLabel('Search Player')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('banPlayer')
                    .setLabel('Ban Player')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('unbanPlayer')
                    .setLabel('Unban Player')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('remoteCommands')
                    .setLabel('Remote Commands')
                    .setStyle(ButtonStyle.Secondary)
            );
        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    },
};