const { ActionRowBuilder, ModalBuilder , TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: {
        name: "adminhashid",
    },
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('adminhashid')
            .setTitle('🔷 Admin Hash-ID form');
        
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

            const firstActionRow = new ActionRowBuilder().addComponents(hashId);
            const secondActionRow = new ActionRowBuilder().addComponents(ingameName);
            const thirdActionRow = new ActionRowBuilder().addComponents(clanTag);
            const forthActionRow = new ActionRowBuilder().addComponents(timeZone);
        
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, forthActionRow);

        
        interaction.showModal(modal);
    }
}