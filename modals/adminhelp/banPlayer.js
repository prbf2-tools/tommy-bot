import { writePrism } from "../../functions/handlePRISM.js";

export default {
    data: {
        name: "banPlayer",
    },
    async execute(interaction) {
        console.log(interaction.fields.components[1]);
        writePrism("apiadmin", `addKeyToBanList ${interaction.fields.getTextInputValue("hashId")} ${interaction.fields.getSelectMenuValue("duration")}`);

    }
};
