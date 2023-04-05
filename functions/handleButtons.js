import fs from "fs"

export default (client) => {
    client.handleButtons = async () => {
        const buttonFolders = fs.readdirSync("./buttons")
        for (const folder of buttonFolders) {
            const buttonFiles = fs.readdirSync(`./buttons/${folder}`).filter(file => file.endsWith(".js"))
            for (const file of buttonFiles) {
                const { default: button } = await import(`../buttons/${folder}/${file}`)
                client.buttons.set(button.data.name, button)
            }
        }
    }
}
