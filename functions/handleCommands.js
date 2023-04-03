import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";

const CLIENT_ID = "994028593837527120";
const GUILD_ID = "993921259219980338";


export default (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith(".js"));

            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }
        const rest = new REST({
            version: "9"
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                console.log("\x1b[42m", "==================================== \n            BOT RESTARTED!            \n ====================================", "\x1b[0m");
                console.log("Started refreshing application (/) commands.");
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                        body: client.commandArray
                    },
                );

                console.log("Successfully reloaded application (/) commands.");
            } catch (error) {
                console.error(error);
            }
        })();
    };
};
