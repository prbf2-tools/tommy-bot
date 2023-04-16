import fs from "fs";
import Tail from "always-tail";

import { processBan } from "./logs/bans.js";
import { parseCommandLine } from "./logs/commands/parser.js";
import { processJoin } from "./logs/join.js";
import { prepareEmbeds as prepareCommandEmbeds } from "./logs/commands/embeds.js";

export default (client) => {
    client.handleLogs = async () => {
        watchBanlist(client);
        watchCommands(client);
        watchJoin(client);
    };
};

const watchBanlist = (client) => {
    const filenameBans = "logs/banlist_info.log";
    if (!fs.existsSync(filenameBans)) fs.writeFileSync(filenameBans, "");
    const tailBans = new Tail(filenameBans, "\n");

    tailBans.on("line", line => {
        const embeds = processBan(line);

        if ("priv" in embeds) {
            client.channels.cache.get("995520998554218557").send({ embeds: [embeds.priv] });
        }

        if ("pub" in embeds) {
            client.channels.cache.get("995387208947204257").send({ embeds: [embeds.pub] });
        }

    });

    tailBans.on("error", function(error) {
        console.log("ERROR: ", error);
    });

    tailBans.watch();
};

const watchCommands = (client) => {
    const filenameAdmin = "logs/ra_adminlog.txt";
    if (!fs.existsSync(filenameAdmin)) fs.writeFileSync(filenameAdmin, "");
    const tailAdmins = new Tail(filenameAdmin, "\n");

    tailAdmins.on("line", line => {
        const command = parseCommandLine(line);
        const embeds = prepareCommandEmbeds(command);

        if ("priv" in embeds) {
            client.channels.cache.get("995520998554218557").send({ embeds: [embeds.priv] });
        }

        if ("pub" in embeds) {
            client.channels.cache.get("995387208947204257").send({ embeds: [embeds.pub] }); // to change
        }
    });

    tailAdmins.on("error", function(error) {
        console.log("ERROR: ", error);
    });

    tailAdmins.watch();
};

const watchJoin = (client) => {
    const filenameJoin = "logs/joinlog.log";
    if (!fs.existsSync(filenameJoin)) fs.writeFileSync(filenameJoin, "");
    const tailJoin = new Tail(filenameJoin, "\n");

    tailJoin.on("line", line => {
        const embed = processJoin(line);

        client.channels.cache.get("995521059119960144").send({ embeds: [embed] });
    });

    tailJoin.on("error", function(error) {
        console.log("ERROR: ", error);
    });

    tailJoin.watch();
};
