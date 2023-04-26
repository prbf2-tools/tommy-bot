import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    AttachmentBuilder,
    ChatInputCommandInteraction,
} from "discord.js";

import * as appeal from "./appeal.js";
import * as apply from "./apply.js";
import * as report from "./report.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("contactadmin")
        .setDescription("Prompt buttons for Ban Appeals, Admin Application and Reports"),

    async execute(interaction: ChatInputCommandInteraction) {
        const file = new AttachmentBuilder("assets/images/hash-id.gif");
        const embed = new EmbedBuilder()
            .setColor("#e98f27")
            .setTitle("🔶 Contact Admins")
            .setDescription(`
                **Click** one of the **buttons** below to **either**:\n
                > 🔵 **Apply** for an admin role on our Project Reality server.\n>
                > 🟢 **Appeal** a ban from our Project Reality server.\n>
                > 🔴 **Report** an incident that happened on our Discord or Project Reality servers\n\n
                If you are having issues finding your Hash-ID check the .GIF image bellow to learn how to find it.`)
            .setImage("attachment://hash-id.gif");

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                apply.button.builder(),
                appeal.button.builder(),
                report.button.builder(),
            );

        await interaction.deferReply();
        await interaction.editReply({
            embeds: [embed],
            components: [row],
            files: [file]
        });
    },
};

export default {
    command
};
