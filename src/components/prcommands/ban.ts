import { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { banid, timebanid, unbanid } from "../../handlers/prism/commands";
import { TextChannel } from "discord.js";



function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const command = {
    data: new SlashCommandBuilder()
        .setName("prban")
        .setDescription("Ban a player from the PR server")
        .addStringOption(subcommand => subcommand
            .setName("hashid")
            .setDescription("Hash-ID of the player")
            .setRequired(true)
            .setMinLength(32)
            .setMaxLength(32))
        .addStringOption(subcommand => subcommand
            .setName("prname")
            .setDescription("Name of the player")
            .setRequired(true))
        .addNumberOption(subcommand => subcommand
            .setName("durationvalue")
            .setDescription("Time Value (Enter a NUMBER to join with next field (Enter 0 for either Perm or Round ban))")
            .setRequired(true))
        .addStringOption(subcommand => subcommand
            .setName("durationformat")
            .setDescription("Time format (The number you entered will join this duration format)")
            .addChoices(
                { name: "Permanent", value: "perm" },
                { name: "Round", value: "round" },
                { name: "Hour(s)", value: "h" },
                { name: "Day(s)", value: "d" },
                { name: "Week(s)", value: "w" },
                { name: "Month(s)", value: "m" },
                { name: "Year(s)", value: "y" })
            .setRequired(true))
        .addStringOption(subcommand => subcommand
            .setName("reason")
            .setDescription("Reason for the ban")
            .setRequired(true))
        .addAttachmentOption(option => option
            .setName("attachment")
            .setDescription("Proof? (Optional)")),
    async execute(interaction: ChatInputCommandInteraction) {
        const hashId = interaction.options.getString("hashid", true);
        const prName = interaction.options.getString("prname", true);
        const durValue = interaction.options.getNumber("durationvalue", true);
        const durFormat = interaction.options.getString("durationformat", true);
        const reason = interaction.options.getString("reason", true);
        const attachment = interaction.options.getAttachment("attachment");
        const perfUsr = interaction.user.username;

        unbanid(hashId);
        await sleep(1000);
        let duration = "";
        const longReason = `${reason} | On: ${prName} - By Discord: ${perfUsr}`;
        if (durFormat === "perm") {
            duration = "Permanent";
            banid(hashId, longReason);
        } else if (durFormat === "round") {
            duration = "Remaining of the round";
            timebanid(hashId, durFormat, longReason);
        } else {
            duration = durValue + durFormat;
            timebanid(hashId, duration, longReason);
        }
        await sleep(500);

        const embedReply = new EmbedBuilder()
            .setColor(0x991b0d)
            .setTitle("Added/Modified Ban")
            .setDescription(`**Performed by: **\`${perfUsr}\`\n**Player: **\`${prName}\`\n**Hash-ID: **\`${hashId}\`\n**Duration: **${duration}\n**Reason: **${reason}`)
            .setTimestamp(new Date())
            .setFooter({ text: "DISCORD" });

        let files: AttachmentBuilder[] | undefined = undefined;
        if (attachment) {
            const file = new AttachmentBuilder(attachment.url);
            files = [file];
            embedReply.setImage("attachment://" + attachment.url.split("/")[-1]);
        }

        await interaction.reply({ embeds: [embedReply], files: files });
        await (interaction.guild?.channels.cache.get("995387208947204257") as TextChannel).send({ embeds: [embedReply], files: files });
        await (interaction.guild?.channels.cache.get("995520998554218557") as TextChannel).send({ embeds: [embedReply], files: files });
    },
};

export default {
    command,
}
