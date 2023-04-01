const { ActionRowBuilder, ModalBuilder , TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: {
        name: "report",
    },
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('report')
            .setTitle('🔴 Report Incident');
        
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

            const firstActionRow = new ActionRowBuilder().addComponents(ingameName);
            const secondActionRow = new ActionRowBuilder().addComponents(map);
            const thirdActionRow = new ActionRowBuilder().addComponents(dateTime);
            const fourthActionRow = new ActionRowBuilder().addComponents(what);
        
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

        
        interaction.showModal(modal);
    }
}