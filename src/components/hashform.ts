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

const ID = "adminhashid";

export const command = {
    data: new SlashCommandBuilder()
        .setName(ID)
        .setDescription(
            "Prompt buttons for admins to enter their hash corectly...."
        ),
    async execute(interaction: CommandInteraction) {
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
    async execute(interaction: ButtonInteraction) {
        interaction.showModal(modal.builder());
    }
};

export const modal = {
    data: {
        name: ID,
    },
    builder: (): ModalBuilder => {
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
        const ingameName = new TextInputBuilder()
            .setCustomId("ingameName")
            .setLabel("What is your Project Reality in-game name?")
            .setPlaceholder("In-game name")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const clanTag = new TextInputBuilder()
            .setCustomId("clanTag")
            .setLabel("What is you clan tag?")
            .setPlaceholder("Clan tag")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const timeZone = new TextInputBuilder()
            .setCustomId("timeZone")
            .setLabel("What is your time zone? (In GMT please!)")
            .setPlaceholder("Time Zone")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hashId);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ingameName);
        const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(clanTag);
        const forthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(timeZone);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, forthActionRow);

        return modal;
    },
    async execute(interaction: ModalSubmitInteraction) {
        try {
            const hashDb = db.get("hashDb");
            const user = interaction.user;
            const userId = user.id;
            const hashId = interaction.fields.getTextInputValue("hashId");
            const ingameName = interaction.fields.getTextInputValue("ingameName");
            const clanTag = interaction.fields.getTextInputValue("clanTag");
            // const timeZone = interaction.fields.getTextInputValue("timeZone");
            const hashIdExists = hashDb.find({ hashId: hashId }).value();
            const userExists = hashDb.find({ id: userId }).value();
            if (hashIdExists) {
                interaction.reply({
                    content: `Hash-ID \`${hashId}\` already exists.`,
                    ephemeral: true,
                });
            } else if (userExists) {
                hashDb.remove({ id: user.id }).write();
                hashDb
                    .push({
                        id: userId,
                        hashId,
                        ingameName,
                        clanTag,
                    })
                    .write();
                interaction.reply({
                    content: `Your Hash-ID has been updated to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
                    ephemeral: true,
                });
            } else {
                hashDb
                    .push({
                        id: userId,
                        hashId,
                        ingameName,
                        clanTag,
                    })
                    .write();
                interaction.reply({
                    content: `Success! Your Hash-ID has been set to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
                    ephemeral: true,
                });
            }
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
