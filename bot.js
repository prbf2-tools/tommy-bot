require("dotenv").config();
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  Events,
} = require("discord.js");
const { getAdmins } = require("./helpers/getAdmins.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.login(process.env.TOKEN);

client.once(Events.ClientReady, (c) => {
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
    getAdmins(client);
  })();
});
