import fs from "fs";
import Tail from "always-tail";

import { prepareEmbeds as prepareBanEmbeds, parseBanLine } from "./bans.js";
import { parseCommandLine } from "./commands/parser.js";
import { parseJoinLine, prepareEmbeds as prepareJoinEmbeds } from "./join.js";
import { prepareEmbeds as prepareCommandEmbeds } from "./commands/embeds.js";
import { Client, TextChannel } from "discord.js";

export const watchBanlist = (client: Client) => {
    const filenameBans = "logs/banlist_info.log";
    if (!fs.existsSync(filenameBans)) fs.writeFileSync(filenameBans, "");
    const tailBans = new Tail(filenameBans, "\n");

    tailBans.on("line", async (line: string) => {
        const ban = parseBanLine(line);
        if (!ban) {
            return;
        }

        const { priv, pub } = prepareBanEmbeds(ban);

        if (priv) {
            (client.channels.cache.get("995520998554218557") as TextChannel).send({ embeds: [priv] });
        }

        if (pub) {
            (client.channels.cache.get("995387208947204257") as TextChannel).send({ embeds: [pub] });
        }

    });

    tailBans.on("error", function(error: Error) {
        console.log("ERROR: ", error);
    });

    tailBans.watch();
};

export const watchCommands = (client: Client) => {
    const filenameAdmin = "logs/ra_adminlog.txt";
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
            (client.channels.cache.get("995520998554218557") as TextChannel).send({ embeds: [priv] });
        }

        if (pub) {
            (client.channels.cache.get("995387208947204257") as TextChannel).send({ embeds: [pub] });
        }
    });

    tailAdmins.on("error", function(error: Error) {
        console.log("ERROR: ", error);
    });

    tailAdmins.watch();
};

export const watchJoin = (client: Client) => {
    const filenameJoin = "logs/joinlog.log";
    if (!fs.existsSync(filenameJoin)) fs.writeFileSync(filenameJoin, "");
    const tailJoin = new Tail(filenameJoin, "\n");

    tailJoin.on("line", (line: string) => {
        const join = parseJoinLine(line);
        if (!join) {
            return;
        }

        const { priv } = prepareJoinEmbeds(join);

        if (priv) {
            (client.channels.cache.get("995521059119960144") as TextChannel).send({ embeds: [priv] });
        }

    });

    tailJoin.on("error", function(error: Error) {
        console.log("ERROR: ", error);
    });

    tailJoin.watch();
};
