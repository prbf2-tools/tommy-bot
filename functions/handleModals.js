import fs from 'fs';

export default (client) => {
    client.handleModals = async () => {
        const modalFolders = fs.readdirSync("./modals");
        for (const folder of modalFolders) {
            const modalFiles = fs.readdirSync(`./modals/${folder}`).filter(file => file.endsWith(".js"));
            for (const file of modalFiles) {
                const modal = await import(`../modals/${folder}/${file}`);
                client.modals.set(modal.data.name, modal);
            }
        }
    }
};
