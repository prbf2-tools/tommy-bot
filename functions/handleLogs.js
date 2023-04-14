import fs from "fs";
import Tail from "always-tail";

import { watchBanlist } from "./logs/bans.js";
import { processCommand } from "./logs/commands.js";
import { watchJoin } from "./logs/join.js";

export default (client) => {
    client.handleLogs = async () => {
        watchBanlist(client);
        watchCommands(client);
        watchJoin(client);
    };
};

const watchCommands = (client) => {
    const filenameAdmin = "logs/ra_adminlog.txt";
    if (!fs.existsSync(filenameAdmin)) fs.writeFileSync(filenameAdmin, "");
    const tailAdmins = new Tail(filenameAdmin, "\n");

    tailAdmins.on("line", line => {
        const embeds = processCommand(line);

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
