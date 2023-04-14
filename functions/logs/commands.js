import fs from "fs";
import Tail from "always-tail";

import { ISSUERS, adminCommand, parseAdminCommand, reasonedDescription, prepDescription, content } from "./utils.js";
import { Colors } from "discord.js";

const reportColor = Colors.DarkYellow;
const handledCommands = {
    REPORT: {
        color: reportColor,
        func: reportPlayer,
    },
    REPORTP: {
        color: reportColor,
        func: reportPlayer,
    },
    KICK: {
        color: Colors.DarkOrange,
        func: kickPlayer,
        pub: true,
    },
    WARN: {
        color: Colors.Yellow,
    },
    RESIGN: {
        color: Colors.DarkGold,
    },
    KILL: {
        color: Colors.LuminousVividPink,
    },
    INIT: {
        color: Colors.DarkPurple,
        header: null,
        body: "Adminhashes and -powerlevels have been reloaded",
    },
    MESSAGE: {
        color: Colors.DarkBlue,
        header: "Message",
        extractContent: true,
    },
    SAY: {
        color: Colors.Green,
        header: "Content",
        extractContent: true,
    },
    SETNEXT: {
        color: Colors.DarkGreen,
        header: "Map",
        pub: true,
        func: setNext,
    },
    SWITCH: {
        color: Colors.DarkCyan,
        header: "When",
    },
    RUNNEXT: {
        color: Colors.DarkTeal,
        header: null,
        body: null,
        func: runNext,
    },
    MAPVOTERESULT: {
        color: Colors.Purple,
        header: null,
        pub: true,
        func: mapvoteResult,
    },
};

export const processCommand = (line) => {
    let parsed = {}
    try {
        parsed = parseAdminCommand(line);
    } catch (e) {
        console.error("Failed to parse an admin log line\n", line, e)
    }

    if (parsed.command in handledCommands) {
        const commandBlueprint = handledCommands[parsed.command]

        if (commandBlueprint.func) {
            return commandBlueprint.func(commandBlueprint, parsed)
        } else {
            return adminCommand(commandBlueprint, parsed)
        }
    }

    return {};
}

const reportPlayer = (blueprint, data) => {
    const adminLogPost = adminCommand(blueprint, data);

    if (data.receiver !== undefined) {
        adminLogPost.setTitle("REPORT PLAYER");
    } else {
        adminLogPost.setTitle("REPORT");
    }

    return {
        priv: adminLogPost,
    }
};

const kickPlayer = (blueprint, data) => {
    const adminLogPost = adminCommand(blueprint, data);

    const adminLogPostPub = adminCommand(blueprint, data)
        .setTitle("Kicked")
        .setFooter({
            text: "You can rejoin after getting kicked."
        });

    if (
        data.issuer_type === ISSUERS.SERVER &&
        data.body.includes("Account related to banned key:")
    ) {
        adminLogPost.setFooter({
            text: "THIS MESSAGE DOES NOT EXIST! IF PLAYER ASK WHY THEY GET KICKED, JUST PING MAX AND TELL HIM THAT I'LL LOOK INTO IT!"
        });
        adminLogPostPub.setDescription(reasonedDescription(data, "ERROR"));
    }

    return {
        priv: adminLogPost,
        pub: adminLogPostPub,
    }
};


const setNext = (blueprint, data) => {
    const adminLogPost = adminCommand(blueprint, data);

    const adminLogPostPub = adminCommand(blueprint, data)
        .setFooter({})

    return {
        priv: adminLogPost,
        pub: adminLogPostPub,
    }
}

const runNext = (blueprint, data) => {
    fs.writeFile("logs/gungame_winner.txt", "Admin \"!runnext\"", function(err) {
        if (err) {
            // append failed
        } else {
            // done
        }
    });

    return adminCommand(blueprint, data)
}

const mapvoteResult = (blueprint, data) => {
    const adminMapsVotesFull = data.orig.split("Vote finished: ");
    const adminMapsVotesEach = adminMapsVotesFull[1].split(" | ");

    let votesDescription = [];
    adminMapsVotesEach.forEach(option => {
        const split = option.split(": ");
        votesDescription.push(
            `** ${split[0]}: **\`${split[1]}\``
        );
    });

    data.body = votesDescription.join("\n");

    const adminLogPost = adminCommand(blueprint, data)
        .setTitle("MAP VOTE RESULTS")

    const adminLogPostPub = adminCommand(data)
        .setTitle("Map Vote Results")
        .setFooter({});

    return {
        priv: adminLogPost,
        pub: adminLogPostPub,
    }
};
