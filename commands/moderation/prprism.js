import { SlashCommandBuilder } from '@discordjs/builders';
import PRISM from '../../functions/handlePRISM.js';

export default {
    data: new SlashCommandBuilder()
        .setName("prprism")
        .setDescription("Execute a command from PRISM")
        .addStringOption(subcommand => subcommand
            .setName("hashid")
            .setDescription('Command as if you typing it in PRISM or in-game')
            .setRequired(true)),
    async execute(interaction) {
        PRISM.writePrism('say', `${interaction.options.getString('hashid')} - Discord User ${interaction.user.username}`)
        await interaction.reply({
            content: `addKeyToBanList ${interaction.options.getString('hashid')} ${interaction.options.getString('duration')} ${interaction.options.getString('reason')}`,
            ephemeral: true
        });
    },
};
