const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: {
        name: "appeal",
    },
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('appeal')
            .setTitle('🟢 Ban Appeal');

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

        const firstActionRow = new ActionRowBuilder().addComponents(hashId);
        const secondActionRow = new ActionRowBuilder().addComponents(ingameName);
        const thirdActionRow = new ActionRowBuilder().addComponents(why);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);


        interaction.showModal(modal);
    }
}
