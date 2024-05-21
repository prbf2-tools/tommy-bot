import { SlashCommandBuilder } from "@discordjs/builders";
import { writeSayToPrism } from "../../functions/handlePRISM.js";

export default {
    data: new SlashCommandBuilder()
        .setName("prprism")
        .setDescription("Execute a command from PRISM")
        .addStringOption(option => option
            .setName("command")
            .setDescription("Command as if you typing it in PRISM or in-game")
            .setRequired(true)),
    async execute(interaction) {
        writeSayToPrism(`${interaction.options.getString("command")} - Discord User ${interaction.user.username}`);
        await interaction.reply({
            content: `Ran command \`${interaction.options.getString("command")}\` using PRISM.`,
            ephemeral: true
        });
    },
};
