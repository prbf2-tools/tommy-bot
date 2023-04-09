import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { Client, GatewayIntentBits, Events, Collection } from "discord.js";

import { getAdmins } from "./helpers/getAdmins.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.login(process.env.TOKEN);

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
        await client.handleEvents(eventFiles, "./events");
        await client.handleCommands(commandFolders, "./commands");
        await client.handleButtons();
        await client.handleModals();
        await client.handleLogs();
        await client.handlePRISM();
        await client.handleInfo();
        await client.handleTrackersDemos();
        getAdmins(client);
    })();
});
