import { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import PRISM from '../../functions/handlePRISM.js';



function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export default {
    data: new SlashCommandBuilder()
        .setName("prban")
        .setDescription("Ban a player from the PR server")
        .addStringOption(subcommand => subcommand
            .setName("hashid")
            .setDescription('Hash-ID of the player')
            .setRequired(true)
            .setMinLength(32)
            .setMaxLength(32))
        .addStringOption(subcommand => subcommand
            .setName("prname")
            .setDescription('Name of the player')
            .setRequired(true))
        .addNumberOption(subcommand => subcommand
            .setName("durationvalue")
            .setDescription('Time Value (Enter a NUMBER to join with next field (Enter 0 for either Perm or Round ban))')
            .setRequired(true))
        .addStringOption(subcommand => subcommand
            .setName("durationformat")
            .setDescription('Time format (The number you entered will join this duration format)')
            .addChoices(
                { name: 'Permanent', value: 'perm' },
                { name: 'Round', value: 'round' },
                { name: 'Hour(s)', value: 'h' },
                { name: 'Day(s)', value: 'd' },
                { name: 'Week(s)', value: 'w' },
                { name: 'Month(s)', value: 'm' },
                { name: 'Year(s)', value: 'y' })
            .setRequired(true))
        .addStringOption(subcommand => subcommand
            .setName("reason")
            .setDescription('Reason for the ban')
            .setRequired(true))
        .addAttachmentOption(option => option
            .setName('attachment')
            .setDescription('Proof? (Optional)')),
    async execute(interaction) {
        const hashId = interaction.options.getString('hashid')
        const prName = interaction.options.getString('prname')
        const durValue = interaction.options.getNumber('durationvalue')
        const durFormat = interaction.options.getString('durationformat')
        const reason = interaction.options.getString('reason')
        const attachment = interaction.options.getAttachment('attachment')
        const perfUsr = interaction.user.username

        PRISM.writePrism2('say', `!unbanid ${hashId}`)
        await sleep(1000)
        if (durFormat === 'perm') {
            PRISM.writePrism2('say', `!banid ${hashId} ${durFormat} ${reason} | On: ${prName} - By Discord: ${perfUsr}`)
            Duration = 'Permanent'
        } else if (durFormat === 'round') {
            PRISM.writePrism2('say', `!timebanid ${hashId} ${durFormat} ${reason} | On: ${prName} - By Discord: ${perfUsr}`)
            Duration = 'Remaining of the round'
        } else {
            PRISM.writePrism2('say', `!timebanid ${hashId} ${durValue}${durFormat} ${reason} | On: ${prName} - By Discord: ${perfUsr}`)
            Duration = durValue + durFormat
        }
        await sleep(500)

        if (attachment == null) {
            const embedReply = new EmbedBuilder()
                .setColor(0x991b0d)
                .setTitle('Added/Modified Ban')
                .setDescription(`**Performed by: **\`${perfUsr}\`\n**Player: **\`${prName}\`\n**Hash-ID: **\`${hashId}\`\n**Duration: **${Duration}\n**Reason: **${reason}`)
                .setTimestamp(new Date())
                .setFooter({ text: 'DISCORD' })
            await interaction.reply({ embeds: [embedReply] });
            await interaction.member.guild.channels.cache.get('995387208947204257').send({ embeds: [embedReply] });
            await interaction.member.guild.channels.cache.get('995520998554218557').send({ embeds: [embedReply] });
        } else {
            const file = new AttachmentBuilder(attachment.attachment);
            console.log(file.attachment.split('/')[-1])
            const embedReply = new EmbedBuilder()
                .setColor(0x991b0d)
                .setTitle('Added/Modified Ban')
                .setDescription(`**Performed by: **\`${perfUsr}\`\n**Player: **\`${prName}\`\n**Hash-ID: **\`${hashId}\`\n**Duration: **${Duration}\n**Reason: **${reason}`)
                .setImage('attachment://' + file.attachment.split('/')[-1])
                .setTimestamp(new Date())
                .setFooter({ text: 'DISCORD' })
            await interaction.reply({ embeds: [embedReply], files: [file] });
            await interaction.member.guild.channels.cache.get('995387208947204257').send({ embeds: [embedReply], files: [file] });
            await interaction.member.guild.channels.cache.get('995520998554218557').send({ embeds: [embedReply], files: [file] });
        }
    },
};
