import fs from "fs";
import { Client, GatewayIntentBits, Events, Collection } from "discord.js";

import config from "./config.js";
import { getAdmins } from "./helpers/getAdmins.js";


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.login(config.discord.token);

client.once(Events.ClientReady, () => {
    client.commands = new Collection();
    client.buttons = new Collection();
    client.modals = new Collection();

    const functions = fs
        .readdirSync("./functions")
        .filter((file) => file.endsWith(".js"));
    const eventFiles = fs
        .readdirSync("./events")
        .filter((file) => file.endsWith(".js"));
    const commandFolders = fs.readdirSync("./commands");

    (async () => {
        for (const file of functions) {
            const module = await import(`./functions/${file}`);
            module.default(client);
        }
        client.handleEvents(eventFiles, "./events");
        client.handleCommands(commandFolders, "./commands");
        client.handleButtons();
        client.handleModals();
        client.handleLogs();
        client.handlePRISM();
        client.handleInfo();
        client.handleTrackersDemos();
        getAdmins(client);
    })();
});
