import fs from "fs";
import Tail from "always-tail";

import { ISSUERS, adminCommand, parseAdminCommand, reasonedDescription, prepDescription, content } from "./utils.js";

export const processCommand = (data) => {
    const adminLogSplit = data.split(" ");
    const skip = [
        "SESSIONERR",
        "!HASH",
        "!TEMPBAN",
        "!BAN",
        "!MAPVOTE",
    ];
    let adminLogPost = null;
    let adminLogPostPub = null;

    if (!skip.find((s) => adminLogSplit[2].includes(s))) {

        const parsed = parseAdminCommand(data);

        if (parsed.command === "REPORTP" || parsed.command === "REPORT") {
            adminLogPost = reportPlayer(parsed);
        } else if (parsed.command === "KICK") {
            adminLogPost, adminLogPostPub = kickPlayer(parsed);
        } else if (parsed.command === "WARN") {
            adminLogPost = adminCommand(parsed)
                .setColor(0XEBCD34);
        } else if (parsed.command === "RESIGN") {
            adminLogPost = adminCommand(parsed)
                .setColor(0Xbba170);
        } else if (parsed.command === "KILL") {
            adminLogPost = adminCommand(parsed)
                .setColor(0Xff8bcb);
        } else if (parsed.command === "INIT") {
            adminLogPost = adminCommand(parsed)
                .setColor(0X3f213f)
                .setDescription(prepDescription(parsed, null, "Adminhashes and -powerlevels have been reloaded"));
        } else if (parsed.command === "MESSAGE") {
            const msgContent = content(parsed.body);

            adminLogPost = adminCommand(parsed)
                .setColor(0X2c37ca)
                .setDescription(prepDescription(parsed, "Message", msgContent));
        } else if (parsed.command === "SAY") {
            const sayContent = content(parsed.body);

            adminLogPost = adminCommand(parsed)
                .setColor(0X34EB6B)
                .setDescription(prepDescription(parsed, "Content", sayContent));
        } else if (parsed.command === "SETNEXT") {
            adminLogPost = adminCommand(parsed)
                .setColor(0X10a17d)
                .setDescription(prepDescription(parsed, "Map"));

            adminLogPostPub = adminCommand(parsed)
                .setColor(0X10a17d)
                .setDescription(prepDescription(parsed))
                .setFooter({});
        } else if (parsed.command === "SWITCH") {
            adminLogPost = adminCommand(parsed)
                .setColor(0X3292a8)
                .setDescription(prepDescription(parsed, "When"));
        } else if (parsed.command === "RUNNEXT") {
            fs.writeFile("logs/gungame_winner.txt", "Admin \"!runnext\"", function(err) {
                if (err) {
                    // append failed
                } else {
                    // done
                }
            });

            adminLogPost = adminCommand(parsed)
                .setColor(0X085441)
                .setDescription(prepDescription(parsed, null, " "));

        } else if (parsed.command === "MAPVOTERESULT") {
            adminLogPost, adminLogPostPub = mapvoteResult(parsed);
        }
        // TODO: figure out a way to handle undefined
        // else {
        //     client.channels.cache.get("995520998554218557").send("`" + adminLogSplit + "`");
        // }
    }

    return [adminLogPost, adminLogPostPub]
};

const reportPlayer = (data) => {
    const adminLogPost = adminCommand(data)
        .setColor(0X89a110);

    if (data.receiver !== undefined) {
        adminLogPost.setTitle("REPORT PLAYER");
    } else {
        adminLogPost.setTitle("REPORT");
    }

    return adminLogPost;
};

const kickPlayer = (data) => {
    const color = 0XEB7434;

    const adminLogPost = adminCommand(data)
        .setColor(color);

    const adminLogPostPub = adminCommand(data)
        .setTitle("Kicked")
        .setColor(color)
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
        adminLogPostPub
            .setDescription(reasonedDescription(data, "ERROR"));
    }

    return [adminLogPost, adminLogPostPub];
};

const mapvoteResult = (data) => {
    const adminMapsVotesFull = data.orig.split("Vote finished: ");
    const adminMapsVotesEach = adminMapsVotesFull[1].split(" | ");

    let votesDescription = [];
    adminMapsVotesEach.forEach(option => {
        const split = option.split(": ");
        votesDescription.push(
            `** ${split[0]}: **\`${split[1]}\``
        );
    });

    const description = votesDescription.join("\n");

    const adminLogPost = adminCommand(data)
        .setTitle("MAP VOTE RESULTS")
        .setColor(0X5c32a8)
        .setDescription(prepDescription(data, null, description));

    const adminLogPostPub = adminCommand(data)
        .setTitle("Map Vote Results")
        .setColor(0X5c32a8)
        .setDescription(prepDescription(data, null, description))
        .setFooter({});

    return [adminLogPost, adminLogPostPub];
};
