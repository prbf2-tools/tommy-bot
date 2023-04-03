import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    ButtonStyle,
    AttachmentBuilder,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("adminhashid")
        .setDescription("Prompt buttons for admins to enter their hash corectly...."),
    async execute(interaction) {
        const file = new AttachmentBuilder('logs/images/flags/hash-id.gif');
        const embed = new EmbedBuilder()
            .setColor('#0074ba')
            .setTitle('🔷 Admin Hash-ID')
            .setDescription(`
                **Click** the **buttons** below to **start**:\n\n
                If you are having issues finding your Hash-ID check the .GIF image bellow to learn how to find it.`)
            .setImage('attachment://hash-id.gif');
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('adminhashid')
                    .setLabel('Admin Hash-ID form')
                    .setStyle(ButtonStyle.Primary),
            );
        await interaction.reply({
            embeds: [embed],
            components: [row],
            files: [file]
        });
    },
};
