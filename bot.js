require("dotenv").config();
const client = require("./helpers/client/client.js");
const fs = require("fs");
const { Collection } = require("discord.js");

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
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./events");
  client.handleCommands(commandFolders, "./commands");
  client.handleButtons();
  client.handleModals();
  client.handleLogs();
  client.handlePRISM();
  client.handleInfo();
  client.handleTrackersDemos();
  client.login(process.env.TOKEN);
})();
