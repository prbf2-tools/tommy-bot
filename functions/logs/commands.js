import fs from "fs";
import Tail from "always-tail";
import { EmbedBuilder } from "discord.js";

import { ISSUERS, parseAdminCommand } from "./utils.js";

export const watchCommands = (client) => {
    const filenameAdmin = "logs/ra_adminlog.txt";
    if (!fs.existsSync(filenameAdmin)) fs.writeFileSync(filenameAdmin, "");
    const tailAdmins = new Tail(filenameAdmin, "\n");

    tailAdmins.on("line", process(client));

    tailAdmins.on("error", function(error) {
        console.log("ERROR: ", error);
    });

    tailAdmins.watch();
};

const process = (client) => {
    return (data) => {
        const adminLogSplit = data.split(" ");
        const skip = [
            "SESSIONERR",
            "!HASH",
            "!TEMPBAN",
            "!BAN",
            "!MAPVOTE",
        ];

        if (!skip.find((s) => adminLogSplit[2].includes(s))) {
            let adminLogPost = {};
            let adminLogPostPub = {};

            const parsed = parseAdminCommand(data);

            if (parsed.command === "REPORTP" || parsed.command === "REPORT") {
                adminLogPost = reportPlayer(parsed);
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "KICK") {
                adminLogPost, adminLogPostPub = kickPlayer(parsed);
                client.channels.cache.get("995387208947204257").send({ embeds: [adminLogPostPub] }); // to change
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "WARN") {
                adminLogPost = adminCommand(parsed)
                    .setColor(0XEBCD34);
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "RESIGN") {
                adminLogPost = adminCommand(parsed)
                    .setColor(0Xbba170);
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "KILL") {
                adminLogPost = adminCommand(parsed)
                    .setColor(0Xff8bcb);
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "INIT") {
                adminLogPost = adminCommand(parsed)
                    .setColor(0X3f213f)
                    .setDescription(prepDescription(parsed, null, "Adminhashes and -powerlevels have been reloaded"));

                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "MESSAGE") {
                const msgContent = content(parsed.body);

                adminLogPost = adminCommand(parsed)
                    .setColor(0X2c37ca)
                    .setDescription(prepDescription(parsed, "Message", msgContent));

                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "SAY") {
                const sayContent = content(parsed.body);

                adminLogPost = adminCommand(parsed)
                    .setColor(0X34EB6B)
                    .setDescription(prepDescription(parsed, "Content", sayContent));

                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "SETNEXT") {
                adminLogPost = adminCommand(parsed)
                    .setColor(0X10a17d)
                    .setDescription(prepDescription(parsed, "Map"));

                adminLogPostPub = adminCommand(parsed)
                    .setColor(0X10a17d)
                    .setDescription(prepDescription(parsed))
                    .setFooter({});

                client.channels.cache.get("995387208947204257").send({ embeds: [adminLogPostPub] });
            } else if (parsed.command === "SWITCH") {
                adminLogPost = adminCommand(parsed)
                    .setColor(0X3292a8)
                    .setDescription(prepDescription(parsed, "When"));

                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
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

                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (parsed.command === "MAPVOTERESULT") {
                const adminMapsVotesFull = data.split("Vote finished: ");
                const adminMapsVotesEach = adminMapsVotesFull[1].split(" | ");
                if (adminMapsVotesEach.length === 2) {
                    const adminMapsVotesEachElem1 = adminMapsVotesEach[0].split(": ");
                    const adminMapsVotesEachElem2 = adminMapsVotesEach[1].split(": ");

                    if (adminLogSplit[7].includes("'PRISM") == true) {
                        adminLogPost = {
                            color: 0X5c32a8,
                            title: "MAP VOTE RESULTS",
                            description: "**Performed by: **`" + adminLogSplit[9].replace("':", "")
                                + "`\n**" + adminMapsVotesEachElem1[0] + ": **`" + adminMapsVotesEachElem1[1]
                                + "`\n**" + adminMapsVotesEachElem2[0] + ": **`" + adminMapsVotesEachElem2[1] + "`",
                            timestamp: new Date(),
                            footer: {
                                text: "PRISM"
                            }
                        };
                        adminLogPostPub = {
                            color: 0X5c32a8,
                            title: "Map Vote Results",
                            description: "**" + adminMapsVotesEachElem1[0] + ": **`" + adminMapsVotesEachElem1[1]
                                + "`\n**" + adminMapsVotesEachElem2[0] + ": **`" + adminMapsVotesEachElem2[1] + "`",
                            timestamp: new Date()
                        };
                    } else {
                        adminLogPost = {
                            color: 0X5c32a8,
                            title: "MAP VOTE RESULTS",
                            description: "**Performed by: **`" + adminLogSplit[7].replace("'", "") + " " + adminLogSplit[8].replace("':", "")
                                + "`\n**" + adminMapsVotesEachElem1[0] + ": **`" + adminMapsVotesEachElem1[1]
                                + "`\n**" + adminMapsVotesEachElem2[0] + ": **`" + adminMapsVotesEachElem2[1] + "`",
                            timestamp: new Date(),
                            footer: {
                                text: "IN-GAME"
                            }
                        };
                        adminLogPostPub = {
                            color: 0X5c32a8,
                            title: "Map Vote Results",
                            description: "**" + adminMapsVotesEachElem1[0] + ": **`" + adminMapsVotesEachElem1[1]
                                + "`\n**" + adminMapsVotesEachElem2[0] + ": **`" + adminMapsVotesEachElem2[1] + "`",
                            timestamp: new Date()
                        };
                    }
                } else {
                    const adminMapsVotesEachElem1 = adminMapsVotesEach[0].split(": ");
                    const adminMapsVotesEachElem2 = adminMapsVotesEach[1].split(": ");
                    const adminMapsVotesEachElem3 = adminMapsVotesEach[2].split(": ");
                    if (adminLogSplit[7].includes("'PRISM") == true) {
                        adminLogPost = {
                            color: 0X5c32a8,
                            title: "MAP VOTE RESULTS",
                            description: "**Performed by: **`" + adminLogSplit[9].replace("':", "")
                                + "`\n**" + adminMapsVotesEachElem1[0] + ": **`" + adminMapsVotesEachElem1[1]
                                + "`\n**" + adminMapsVotesEachElem2[0] + ": **`" + adminMapsVotesEachElem2[1]
                                + "`\n**" + adminMapsVotesEachElem3[0] + ": **`" + adminMapsVotesEachElem3[1] + "`",
                            timestamp: new Date(),
                            footer: {
                                text: "PRISM"
                            }
                        };
                        adminLogPostPub = {
                            color: 0X5c32a8,
                            title: "Map Vote Results",
                            description: "**" + adminMapsVotesEachElem1[0] + ": **`" + adminMapsVotesEachElem1[1]
                                + "`\n**" + adminMapsVotesEachElem2[0] + ": **`" + adminMapsVotesEachElem2[1]
                                + "`\n**" + adminMapsVotesEachElem3[0] + ": **`" + adminMapsVotesEachElem3[1] + "`",
                            timestamp: new Date(),
                        };
                    } else {
                        adminLogPost = {
                            color: 0X5c32a8,
                            title: "MAP VOTE RESULTS",
                            description: "**Performed by: **`" + adminLogSplit[7].replace("'", "") + " " + adminLogSplit[8].replace("':", "")
                                + "`\n**" + adminMapsVotesEachElem1[0] + ": **`" + adminMapsVotesEachElem1[1]
                                + "`\n**" + adminMapsVotesEachElem2[0] + ": **`" + adminMapsVotesEachElem2[1]
                                + "`\n**" + adminMapsVotesEachElem3[0] + ": **`" + adminMapsVotesEachElem3[1] + "`",
                            timestamp: new Date(),
                            footer: {
                                text: "IN-GAME"
                            }
                        };
                        adminLogPostPub = {
                            color: 0X5c32a8,
                            title: "Map Vote Results",
                            description: "**" + adminMapsVotesEachElem1[0] + ": **`" + adminMapsVotesEachElem1[1]
                                + "`\n**" + adminMapsVotesEachElem2[0] + ": **`" + adminMapsVotesEachElem2[1]
                                + "`\n**" + adminMapsVotesEachElem3[0] + ": **`" + adminMapsVotesEachElem3[1] + "`",
                            timestamp: new Date()
                        };
                    }
                }

                client.channels.cache.get("995387208947204257").send({ embeds: [adminLogPostPub] });
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else {
                client.channels.cache.get("995520998554218557").send("`" + adminLogSplit + "`");
            }
        }

    };
};

const adminCommand = (data, reason) => {
    const embed = new EmbedBuilder()
        .setTitle(data.command)
        .setDescription(reasonedDescription(data, reason))
        .setTimestamp();

    if (data.issuer_type === ISSUERS.PRISM) {
        embed.setFooter({
            text: "PRISM"
        });
    } else if (data.issuer_type === ISSUERS.USER) {
        embed.setFooter({
            text: "IN-GAME"
        });
    }

    return embed;
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

const reasonedDescription = (data, reason) => {
    return prepDescription(data, "Reason", reason);
};

const prepDescription = (data, header, reason) => {
    reason = reason ? reason : data.body;

    description = [
        `**Performed by: **\`${fullName(data.issuer)}\``,
        `**${header} : **\`${reason}\`` ? header : reason,
    ];

    if (data.receiver !== undefined) {
        description.splice(1, 0, `**On user: ** ${fullName(data.receiver)}`);
    }

    return description.join("\n");
};

const fullName = (data) => {
    const tag = data.tag;
    const name = data.name;

    if (tag) {
        return tag + " " + name;
    }

    return name;
};

const content = (body) => {
    return body.split(" ").reverse().slice(4).reverse().join(" ");
};
