import { SlashCommandBuilder } from "@discordjs/builders"

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction) {
        await interaction.reply({
            content: "Pong!",
            ephemeral: true
        })
    },
}