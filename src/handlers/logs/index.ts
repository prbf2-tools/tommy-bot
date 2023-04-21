import fs from "fs";

import Tail from "always-tail";
import { TextChannel } from "discord.js";

import { prepareEmbeds as prepareBanEmbeds, parseBanLine } from "./bans.js";
import { parseCommandLine } from "./commands/parser.js";
import { parseJoinLine, prepareEmbeds as prepareJoinEmbeds } from "./join.js";
import { prepareEmbeds as prepareCommandEmbeds } from "./commands/embeds.js";

import { Client } from "../../client";
import { channels, logs } from "../../config";

export default (client: Client) => {
    watchBanlist(client);
    watchCommands(client);
    watchJoin(client);
};

export const watchBanlist = (client: Client) => {
    const filenameBans = logs.bans;
    if (!fs.existsSync(filenameBans)) fs.writeFileSync(filenameBans, "");
    const tailBans = new Tail(filenameBans, "\n");

    tailBans.on("line", async (line: string) => {
        const ban = parseBanLine(line);
        if (!ban) {
            return;
        }

        const { priv, pub } = prepareBanEmbeds(ban);

        if (priv) {
            (client.channels.cache.get(channels.bans.priv) as TextChannel).send({ embeds: [priv] });
        }

        if (pub) {
            (client.channels.cache.get(channels.bans.pub) as TextChannel).send({ embeds: [pub] });
        }

    });

    tailBans.on("error", function(error: Error) {
        console.log("ERROR: ", error);
    });

    tailBans.watch();
};

export const watchCommands = (client: Client) => {
    const filenameAdmin = logs.commands;
    if (!fs.existsSync(filenameAdmin)) fs.writeFileSync(filenameAdmin, "");
    const tailAdmins = new Tail(filenameAdmin, "\n");

    tailAdmins.on("line", async (line: string) => {
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
            (client.channels.cache.get(channels.commands.priv) as TextChannel).send({ embeds: [priv] });
        }

        if (pub) {
            (client.channels.cache.get(channels.commands.pub) as TextChannel).send({ embeds: [pub] });
        }
    });

    tailAdmins.on("error", function(error: Error) {
        console.log("ERROR: ", error);
    });

    tailAdmins.watch();
};

export const watchJoin = (client: Client) => {
    const filenameJoin = logs.joins;
    if (!fs.existsSync(filenameJoin)) fs.writeFileSync(filenameJoin, "");
    const tailJoin = new Tail(filenameJoin, "\n");

    tailJoin.on("line", (line: string) => {
        const join = parseJoinLine(line);
        if (!join) {
            return;
        }

        const { priv } = prepareJoinEmbeds(join);

        if (priv) {
            (client.channels.cache.get(channels.join.priv) as TextChannel).send({ embeds: [priv] });
        }

    });

    tailJoin.on("error", function(error: Error) {
        console.log("ERROR: ", error);
    });

    tailJoin.watch();
};
