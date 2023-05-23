import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    ButtonStyle,
    AttachmentBuilder,
    CommandInteraction,
    ButtonInteraction,
    ModalSubmitInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalActionRowComponentBuilder,
} from "discord.js";

import { Client } from "../client.js";
import { User } from "../entities/user.js";

const ID = "adminhashid";

export const command = {
    data: new SlashCommandBuilder()
        .setName(ID)
        .setDescription(
            "Prompt buttons for admins to enter their hash corectly...."
        ),
    async execute(client: Client, interaction: CommandInteraction) {
        const file = new AttachmentBuilder("assets/images/hash-id.gif");
        const embed = new EmbedBuilder()
            .setColor("#0074ba")
            .setTitle("🔷 Admin Hash-ID")
            .setDescription(
                `
                **Click** the **buttons** below to **start**:\n\n
                If you are having issues finding your Hash-ID check the .GIF image bellow to learn how to find it.`
            )
            .setImage("attachment://hash-id.gif");
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            button.builder(),
        );
        await interaction.deferReply();
        await interaction.editReply({
            embeds: [embed],
            components: [row],
            files: [file],
        });
    },
};

export const button = {
    data: {
        name: ID,
    },
    builder: (): ButtonBuilder => {
        return new ButtonBuilder()
            .setCustomId(ID)
            .setLabel("Admin Hash-ID form")
            .setStyle(ButtonStyle.Primary);
    },
    async execute(client: Client, interaction: ButtonInteraction) {
        const m = await modal.builder(client, interaction.user.id)
        interaction.showModal(m);
    }
};

export const modal = {
    data: {
        name: ID,
    },
    builder: async (c: Client, discordID: string): Promise<ModalBuilder> => {
        const modal = new ModalBuilder()
            .setCustomId("adminhashid")
            .setTitle("🔷 Admin Hash-ID form");

        const hashId = new TextInputBuilder()
            .setCustomId("hashId")
            .setLabel("What is your Project Reality Hash-ID?")
            .setPlaceholder("Hash-ID | PR:Launcher > Support > Account > ID")
            .setRequired(true)
            .setMaxLength(32)
            .setMinLength(32)
            .setStyle(TextInputStyle.Short);

        const em = c.em.fork();

        const user = await em.findOne(User, { discordID });

        if (user && user.hash) {
            hashId.setValue(user.hash);
        }

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hashId);

        modal.addComponents(firstActionRow);

        return modal;
    },
    async execute(c: Client, interaction: ModalSubmitInteraction) {
        try {
            const user = interaction.user;
            const hashId = interaction.fields.getTextInputValue("hashId");

            const em = c.em.fork();

            const dbUser = await em.findOne(User, { discordID: user.id });

            if (dbUser) {
                dbUser.hash = hashId;
            } else {
                em.create(User, {
                    discordID: user.id,
                    hash: hashId,
                });
            }

            await em.flush()

            interaction.reply({
                content: `Your Hash-ID has been updated to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
                ephemeral: true,
            });
        } catch (e) {
            console.log("Error setting hash id", e);
        }
        // const embed = new EmbedBuilder()
        //   .setColor("#008be0")
        //   .setTitle(`🔹 ${interaction.user.username} Hash-ID`)
        //   .setThumbnail(interaction.user.avatarURL()).setDescription(`
        //             **Discord User:** <@${interaction.user.id}>
        //             **Hash ID: **\`${interaction.fields.getTextInputValue(
        //               "hashId"
        //             )}\`
        //             **In-game name: **\`${interaction.fields.getTextInputValue(
        //               "ingameName"
        //             )}\`
        //             **Clan Tag: **\`${interaction.fields.getTextInputValue(
        //               "clanTag"
        //             )}\`
        //             **Time Zone: **\`${interaction.fields.getTextInputValue(
        //               "timeZone"
        //             )}\`
        //         `);
        // await interaction.reply({
        //   content: `Success! Your Hash-ID has been set to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
        //   ephemeral: true,
        // });
    },
};

export default {
    command, button, modal,
};
