import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ForumChannel, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";

export enum ID {
    Button = "button:appeal",
    Modal = "modal:appeal",
}

export const button = {
    data: {
        name: ID.Button
    },
    builder: (): ButtonBuilder => {
        return new ButtonBuilder()
            .setCustomId(ID.Button)
            .setLabel("Ban Appeal")
            .setStyle(ButtonStyle.Success);
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
            .setTitle("🟢 Ban Appeal");

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

        const why = new TextInputBuilder()
            .setCustomId("why")
            .setLabel("What was the bannable offence?")
            .setPlaceholder("Explaination")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hashId);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ingameName);
        const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(why);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        return modal;
    },
    async execute(interaction: ModalSubmitInteraction) {
        const embed = new EmbedBuilder()
            .setColor("#7faf5d")
            .setTitle(`🟢 ${interaction.user.username} Ban Appeal`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(`
                **Hash ID: **
                \`${interaction.fields.getTextInputValue("hashId")}\`\n
                **In-game name: **
                \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                **What did he do: **
                ${interaction.fields.getTextInputValue("why")}\n
            `);
        await (interaction.guild?.channels.cache.get("1021942980950634597") as ForumChannel).threads.create({
            name: `🟢 ${interaction.user.username}'s Appeal`,
            message: {
                content: `<@&${process.env.ADMIN_ID}>`,
                embeds: [embed]
            },
            appliedTags: ["1021973561918902333"]
        })
            .then(threadChannel => {
                threadChannel.members.add(interaction.user.id);
                interaction.reply({
                    content: `Success! Please check <#${threadChannel.id}>!`,
                    ephemeral: true
                });
                const embed = new EmbedBuilder()
                    .setColor("#7faf5d")
                    .setTitle(`🔒🟢 ${interaction.user.username} Ban Appeal`)
                    .setThumbnail(interaction.user.avatarURL())
                    .setDescription(`
                    **Public Thread:**
                    <#${threadChannel.id}>\n
                    **Hash ID: **
                    \`${interaction.fields.getTextInputValue("hashId")}\`\n
                    **In-game name: **
                    \`${interaction.fields.getTextInputValue("ingameName")}\`\n
                    **The bannable offence: **
                    ${interaction.fields.getTextInputValue("why")}\n
                `);
                (interaction.guild?.channels.cache.get("1022285742799589416") as ForumChannel).threads.create({
                    name: `🔒🟢 ${interaction.user.username}'s Appeal`,
                    message: {
                        content: `<@&${process.env.ADMIN_ID}>`,
                        embeds: [embed]
                    },
                    appliedTags: ["1022300302659039272"]
                });
            });
    }
};

export default {
    button, modal,
};
