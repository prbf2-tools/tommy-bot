const fs = require("fs");

module.exports = (client) => {
    client.handleModals = async () => {
        const modalFolders = fs.readdirSync("./modals");
        for (const folder of modalFolders) {
            const modalFiles = fs.readdirSync(`./modals/${folder}`).filter(file => file.endsWith(".js"));
            for (const file of modalFiles) {
                const modal = require(`../modals/${folder}/${file}`);
                client.modals.set(modal.data.name, modal);
            }
        }
    }
}