import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
require("dotenv").config();


export default {
    data: {
        name: "banPlayer",
    },
    async execute(interaction, client) {
        console.log(interaction.fields.components[1])
        client.writePrism('apiadmin', `addKeyToBanList ${interaction.fields.getTextInputValue('hashId')} ${interaction.fields.getSelectMenuValue('duration')}`)

    }
};
