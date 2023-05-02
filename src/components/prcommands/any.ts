import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import { Client } from "../../client.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("prprism")
        .setDescription("Execute a command from PRISM")
        .addStringOption(subcommand => subcommand
            .setName("command")
            .setDescription("Command as if you typing it in PRISM or in-game")
            .setRequired(true)),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        client.prism.sendChat(`${interaction.options.getString("command")} - Discord User ${interaction.user.username}`);
        await interaction.reply({
            content: `"${interaction.options.getString("command")}" sent to the server`,
            ephemeral: true
        });
    },
};

export default {
    command,
};
