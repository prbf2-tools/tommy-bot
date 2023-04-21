import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ForumChannel, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";

export enum ID {
    Button = "button:apply",
    Modal = "modal:apply",
}

export const button = {
    data: {
        name: ID.Button
    },
    builder: (): ButtonBuilder => {
        return new ButtonBuilder()
            .setCustomId(ID.Button)
            .setLabel("Admin Application")
            .setStyle(ButtonStyle.Primary);
    },
    execute: (interaction: ButtonInteraction) => {
        interaction.showModal(modal.builder());
    }
};

export const modal = {
    data: {
        name: ID.Modal
    },
    builder: (): ModalBuilder => {
        const modal = new ModalBuilder()
            .setCustomId(ID.Modal)
            .setTitle("🔵 Admin Application");

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
        const timeZone = new TextInputBuilder()
            .setCustomId("timeZone")
            .setLabel("What is your time zome? (In GMT)")
            .setPlaceholder("GMT +/-")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const seed = new TextInputBuilder()
            .setCustomId("seed")
            .setLabel("Are you willing to seed?")
            .setPlaceholder("Yes/No")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const active = new TextInputBuilder()
            .setCustomId("active")
            .setLabel("How often do you play, how long usually?")
            .setPlaceholder("Wall of text expected")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hashId);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ingameName);
        const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(timeZone);
        const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(seed);
        const fifthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(active);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

        return modal;
    },
    async execute(interaction: ModalSubmitInteraction) {
        const embed = new EmbedBuilder()
            .setColor("#0074ba")
            .setTitle(`🔵 ${interaction.user.username} Admin Application`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(`
                **Hash ID: **
                \`${interaction.fields.getTextInputValue("hashId")}\`\n
                **In-game name: **
                \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                **Time Zone: **
                ${interaction.fields.getTextInputValue("timeZone")}\n
                **Willing to seed: **
                ${interaction.fields.getTextInputValue("seed")}\n
                **How active: **
                ${interaction.fields.getTextInputValue("active")}\n
            `);
        await (interaction.guild?.channels.cache.get("1021942980950634597") as ForumChannel).threads.create({
            name: `🔵 ${interaction.user.username}'s Application`,
            message: {
                content: `<@&${process.env.ADMIN_ID}>`,
                embeds: [embed]
            },
            appliedTags: ["1021973497645387816"]
        })
            .then(threadChannel => {
                threadChannel.members.add(interaction.user.id);
                interaction.reply({
                    content: `Success! Please check <#${threadChannel.id}>!`,
                    ephemeral: true
                });
                const embed = new EmbedBuilder()
                    .setColor("#0074ba")
                    .setTitle(`🔒🔵 ${interaction.user.username} Admin Application`)
                    .setThumbnail(interaction.user.avatarURL())
                    .setDescription(`
                    **Public Thread:**
                    <#${threadChannel.id}>\n
                    **Hash ID: **
                    \`${interaction.fields.getTextInputValue("hashId")}\`\n
                    **In-game name: **
                    \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                    **Time Zone: **
                    ${interaction.fields.getTextInputValue("timeZone")}\n
                    **Willing to seed: **
                    ${interaction.fields.getTextInputValue("seed")}\n
                    **How active: **
                    ${interaction.fields.getTextInputValue("active")}\n
                `);
                (interaction.guild?.channels.cache.get("1022285742799589416") as ForumChannel).threads.create({
                    name: `🔒🔵 ${interaction.user.username}'s Application`,
                    message: {
                        content: `<@&${process.env.ADMIN_ID}>`,
                        embeds: [embed]
                    },
                    appliedTags: ["1022300221981593662"]
                });
            });
    }

};

export default {
    button, modal,
};
