import fs from "fs";
import Tail from "always-tail";
import { prepareEmbeds as prepareBanEmbeds, parseBanLine } from "./bans.js";
import { parseCommandLine } from "./commands/parser.js";
import { parseJoinLine, prepareEmbeds as prepareJoinEmbeds } from "./join.js";
import { prepareEmbeds as prepareCommandEmbeds } from "./commands/embeds.js";
import { channels, logs } from "../../config.js";
export const watchBanlist = (client) => {
    const filenameBans = logs.bans;
    if (!fs.existsSync(filenameBans))
        fs.writeFileSync(filenameBans, "");
    const tailBans = new Tail(filenameBans, "\n");
    tailBans.on("line", async (line) => {
        const ban = parseBanLine(line);
        if (!ban) {
            return;
        }
        const { priv, pub } = prepareBanEmbeds(ban);
        if (priv) {
            client.channels.cache.get(channels.bans.priv).send({ embeds: [priv] });
        }
        if (pub) {
            client.channels.cache.get(channels.bans.pub).send({ embeds: [pub] });
        }
    });
    tailBans.on("error", function (error) {
        console.log("ERROR: ", error);
    });
    tailBans.watch();
};
export const watchCommands = (client) => {
    const filenameAdmin = logs.commands;
    if (!fs.existsSync(filenameAdmin))
        fs.writeFileSync(filenameAdmin, "");
    const tailAdmins = new Tail(filenameAdmin, "\n");
    tailAdmins.on("line", async (line) => {
        const command = parseCommandLine(line);
        if (!command) {
            return;
        }
        const skip = [
            "SESSIONERR",
            "!HASH",
            "!TEMPBAN",
            "!BAN",
            "!MAPVOTE",
        ];
        if (command.command in skip) {
            return;
        }
        const { priv, pub } = prepareCommandEmbeds(command);
        if (priv) {
            client.channels.cache.get(channels.commands.priv).send({ embeds: [priv] });
        }
        if (pub) {
            client.channels.cache.get(channels.commands.pub).send({ embeds: [pub] });
        }
    });
    tailAdmins.on("error", function (error) {
        console.log("ERROR: ", error);
    });
    tailAdmins.watch();
};
export const watchJoin = (client) => {
    const filenameJoin = logs.joins;
    if (!fs.existsSync(filenameJoin))
        fs.writeFileSync(filenameJoin, "");
    const tailJoin = new Tail(filenameJoin, "\n");
    tailJoin.on("line", (line) => {
        const join = parseJoinLine(line);
        if (!join) {
            return;
        }
        const { priv } = prepareJoinEmbeds(join);
        if (priv) {
            client.channels.cache.get(channels.join.priv).send({ embeds: [priv] });
        }
    });
    tailJoin.on("error", function (error) {
        console.log("ERROR: ", error);
    });
    tailJoin.watch();
};
