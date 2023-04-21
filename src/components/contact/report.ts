import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ForumChannel, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";

export enum ID {
    Button = "button:report",
    Modal = "modal:report",
}

export const button = {
    data: {
        name: ID.Button
    },
    builder: (): ButtonBuilder => {
        return new ButtonBuilder()
            .setCustomId(ID.Button)
            .setLabel("Report Incident")
            .setStyle(ButtonStyle.Danger);
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
            .setCustomId("report")
            .setTitle("🔴 Report Incident");

        const ingameName = new TextInputBuilder()
            .setCustomId("ingameName")
            .setLabel("What was his/her/they in-game ame")
            .setPlaceholder("Their in-game name")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const map = new TextInputBuilder()
            .setCustomId("map")
            .setLabel("What was the map when the incident occured?")
            .setPlaceholder("Map name")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const dateTime = new TextInputBuilder()
            .setCustomId("dateTime")
            .setLabel("What was the date and aproximative time?")
            .setPlaceholder("Date and time")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const what = new TextInputBuilder()
            .setCustomId("what")
            .setLabel("What happened to warrant a report?")
            .setPlaceholder("What happened")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ingameName);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(map);
        const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(dateTime);
        const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(what);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

        return modal;
    },
    async execute(interaction: ModalSubmitInteraction) {
        const embed = new EmbedBuilder()
            .setColor("#d03147")
            .setTitle(`🔴 ${interaction.user.username} Report Incident`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(`
                **In-game name of the player: **
                \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                **Map name: **
                \`${interaction.fields.getTextInputValue("map")}\`\n
                **Date and aproximative time: **
                ${interaction.fields.getTextInputValue("dateTime")}\n
                **What happened: **
                ${interaction.fields.getTextInputValue("what")}\n
            `);

        await (interaction.guild?.channels.cache.get("1021942980950634597") as ForumChannel).threads.create({
            name: `🔴 ${interaction.user.username}'s Report`,
            message: {
                content: `<@&${process.env.ADMIN_ID}>`,
                embeds: [embed]
            },
            appliedTags: ["1021973747546210305"]
        })
            .then(threadChannel => {
                threadChannel.members.add(interaction.user.id);
                interaction.reply({
                    content: `Success! Please check <#${threadChannel.id}>!`,
                    ephemeral: true
                });
                const embed = new EmbedBuilder()
                    .setColor("#d03147")
                    .setTitle(`🔒🔴 ${interaction.user.username} Report Incident`)
                    .setThumbnail(interaction.user.avatarURL())
                    .setDescription(`
                        **Public Thread:**
                        <#${threadChannel.id}>\n
                        **In-game name of the player: **
                        \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                        **Map name: **
                        \`${interaction.fields.getTextInputValue("map")}\`\n
                        **Date and aproximative time: **
                        ${interaction.fields.getTextInputValue("dateTime")}\n
                        **What happened: **
                        ${interaction.fields.getTextInputValue("what")}\n
                    `);
                (interaction.guild?.channels.cache.get("1022285742799589416") as ForumChannel).threads.create({
                    name: `🔒🔴 ${interaction.user.username}'s Report`,
                    message: {
                        content: `<@&${process.env.ADMIN_ID}>`,
                        embeds: [embed]
                    },
                    appliedTags: ["1022300442023186462"]
                });
            });
    }
};

export default {
    button, modal,
};
