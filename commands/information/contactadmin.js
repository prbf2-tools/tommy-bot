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
        .setName("contactadmin")
        .setDescription("Prompt buttons for Ban Appeals, Admin Application and Reports"),
    async execute(interaction) {
        const file = new AttachmentBuilder('logs/images/flags/hash-id.gif');
        const embed = new EmbedBuilder()
            .setColor('#e98f27')
            .setTitle('🔶 Contact Admins')
            .setDescription(`
                **Click** one of the **buttons** below to **either**:\n
                > 🔵 **Apply** for an admin role on our Project Reality server.\n> 
                > 🟢 **Appeal** a ban from our Project Reality server.\n> 
                > 🔴 **Report** an incident that happened on our Discord or Project Reality servers\n\n
                If you are having issues finding your Hash-ID check the .GIF image bellow to learn how to find it.`)
            .setImage('attachment://hash-id.gif');
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('apply')
                    .setLabel('Admin Application')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('appeal')
                    .setLabel('Ban Appeal')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('report')
                    .setLabel('Report Incident')
                    .setStyle(ButtonStyle.Danger)
            );
        await interaction.reply({
            embeds: [embed],
            components: [row], 
            files: [file]
        });
    },
};