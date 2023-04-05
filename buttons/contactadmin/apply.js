import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    data: {
        name: "apply",
    },
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('apply')
            .setTitle('🔵 Admin Application');
        
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

            const firstActionRow = new ActionRowBuilder().addComponents(hashId);
            const secondActionRow = new ActionRowBuilder().addComponents(ingameName);
            const thirdActionRow = new ActionRowBuilder().addComponents(timeZone);
            const fourthActionRow = new ActionRowBuilder().addComponents(seed);
            const fifthActionRow = new ActionRowBuilder().addComponents(active);
        
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

        
        interaction.showModal(modal);
    }
};