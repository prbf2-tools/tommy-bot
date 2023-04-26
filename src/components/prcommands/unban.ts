import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { unbanid } from "../../handlers/prism/commands";

export const command = {
    data: new SlashCommandBuilder()
        .setName("prunban")
        .setDescription("Unban a player from the PR server")
        .addStringOption(subcommand => subcommand
            .setName("hashid")
            .setDescription("Hash-ID of the player")
            .setRequired(true))
        .addStringOption(subcommand => subcommand
            .setName("reason")
            .setDescription("Reason of the unban")
            .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const hashId = interaction.options.getString("hashid");
        const reason = interaction.options.getString("reason");
        const perfUsr = interaction.user.username;

        unbanid(hashId!);

        const embedReply = new EmbedBuilder()
            .setColor(0x36a040)
            .setTitle("Unbanned")
            .setDescription(`**Performed by: **\`${perfUsr}\`\n**Hash-ID: **\`${hashId}\`\n**Reason: **${reason}`)
            .setTimestamp()
            .setFooter({ text: "DISCORD" });
        await interaction.reply({ embeds: [embedReply] });
        await (interaction.guild?.channels.cache.get("995387208947204257") as TextChannel).send({ embeds: [embedReply] });
        await (interaction.guild?.channels.cache.get("995520998554218557") as TextChannel).send({ embeds: [embedReply] });
    },
};

export default {
    command,
};
