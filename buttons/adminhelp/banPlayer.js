import { MessageActionRow, ModalBuilder, TextInputComponent, MessageSelectMenu } from 'discord.js';

export default {
    data: {
        name: "banPlayer",
    },
    async execute(interaction) {
        const modal = new Modal()
            .setCustomId('banPlayer')
            .setTitle('🔴 banPlayer');

        const hashId = new TextInputComponent()
            .setCustomId("hashId")
            .setLabel("What is your Project Reality Hash-ID?")
            .setPlaceholder("Hash-ID | PR:Launcher > Support > Account > ID")
            .setRequired(true)
            .setMaxLength(26)
            .setMinLength(26)
            .setStyle('SHORT');
        const duration = new MessageSelectMenu()
            .setCustomId("duration")
            .setPlaceholder("Duration?")
            .addOptions(
                { label: 'Round', value: 'round' },
                { label: '1 Hour', value: '3600' },
                { label: '2 Hours', value: '7200' },
                { label: '3 Hours', value: '10800' },
                { label: '6 Hours', value: '21600' },
                { label: '12 Hours', value: '43200' },
                { label: '1 Day', value: '86400' },
                { label: '2 Days', value: '172800' },
                { label: '3 Days', value: '259200' },
                { label: '1 Week', value: '604800' },
                { label: '2 Weeks', value: '1209600' },
                { label: '3 Weeks', value: '1814400' },
                { label: '1 Month', value: '2629800' },
                { label: '2 Months', value: '5259600' },
                { label: '3 Months', value: '7889400' },
                { label: '6 Months', value: '15778800' },
                { label: '1 Year', value: '189345600' },
                { label: 'Permanent', value: 'perm' })
        const reason = new TextInputComponent()
            .setCustomId("reason")
            .setLabel("What was reason for bannable offence?")
            .setPlaceholder("Explaination")
            .setRequired(true)
            .setStyle('PARAGRAPH');

        const firstActionRow = new MessageActionRow().addComponents(hashId);
        const secondActionRow = new MessageActionRow().addComponents(duration);
        const thirdActionRow = new MessageActionRow().addComponents(reason);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);


        interaction.showModal(modal);
    }
};
