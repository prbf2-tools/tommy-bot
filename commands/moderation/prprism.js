import { SlashCommandBuilder } from "@discordjs/builders";
import { writeSayToPrism } from "../../functions/handlePRISM.js";

export default {
    data: new SlashCommandBuilder()
        .setName("prprism")
        .setDescription("Execute a command from PRISM")
        .addStringOption(subcommand => subcommand
            .setName("hashid")
            .setDescription("Command as if you typing it in PRISM or in-game")
            .setRequired(true)),
    async execute(interaction) {
        writeSayToPrism(`${interaction.options.getString("hashid")} - Discord User ${interaction.user.username}`);
        await interaction.reply({
            content: `addKeyToBanList ${interaction.options.getString("hashid")} ${interaction.options.getString("duration")} ${interaction.options.getString("reason")}`,
            ephemeral: true
        });
    },
};
