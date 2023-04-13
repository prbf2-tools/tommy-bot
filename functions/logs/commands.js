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
            } else if (adminLogSplit[2].includes("!KICK") == true) {
                adminLogPost, adminLogPostPub = kickPlayer(parsed);
                client.channels.cache.get("995387208947204257").send({ embeds: [adminLogPostPub] }); // to change
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (adminLogSplit[2].includes("!WARN") == true) {
                adminLogReason = data.split("': ");
                if (adminLogSplit[15].includes("'PRISM") == true) {
                    adminLogPost = {
                        color: 0XEBCD34,
                        title: "WARN",
                        description: "**Performed by: **`" + adminLogSplit[17].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[19].replace("'", "") + " " + adminLogSplit[20].replace("':", "")
                            + "`\n**Reason: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                } else {
                    adminLogPost = {
                        color: 0XEBCD34,
                        title: "WARN",
                        description: "**Performed by: **`" + adminLogSplit[15].replace("'", "") + " " + adminLogSplit[16].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[18].replace("'", "") + " " + adminLogSplit[19].replace("':", "")
                            + "`\n**Reason: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                }
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (adminLogSplit[2].includes("!RESIGN") == true) {
                adminLogReason = data.split("': ");
                if (adminLogSplit[13].includes("'PRISM") == true) {
                    adminLogPost = {
                        color: 0Xbba170,
                        title: "RESIGN",
                        description: "**Performed by: **`" + adminLogSplit[15].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[17].replace("'", "") + " " + adminLogSplit[18].replace("':", "")
                            + "`\n**Reason: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                } else {
                    adminLogPost = {
                        color: 0Xbba170,
                        title: "RESIGN",
                        description: "**Performed by: **`" + adminLogSplit[13].replace("'", "") + " " + adminLogSplit[14].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[16].replace("'", "") + " " + adminLogSplit[17].replace("':", "")
                            + "`\n**Reason: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                }
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (adminLogSplit[2].includes("!KILL") == true) {
                adminLogReason = data.split("': ");
                if (adminLogSplit[15].includes("'PRISM") == true) {
                    adminLogPost = {
                        color: 0Xff8bcb,
                        title: "KILL",
                        description: "**Performed by: **`" + adminLogSplit[17].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[19].replace("'", "") + " " + adminLogSplit[20].replace("':", "")
                            + "`\n**Reason: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                } else {
                    adminLogPost = {
                        color: 0Xff8bcb,
                        title: "KILL",
                        description: "**Performed by: **`" + adminLogSplit[15].replace("'", "") + " " + adminLogSplit[16].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[18].replace("'", "") + " " + adminLogSplit[19].replace("':", "")
                            + "`\n**Reason: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                }
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (adminLogSplit[2].includes("!INIT") == true) {
                adminLogReason = data.split("': ");
                if (adminLogSplit[15].includes("'PRISM") == true) {
                    //console.log(client.channels.cache.get('1033130739505565716').availableTags)
                    adminLogPost = {
                        color: 0X3f213f,
                        title: "INIT",
                        description: "**Performed by: **`" + adminLogSplit[17].replace("':", "")
                            + "`\nAdminhashes and -powerlevels have been reloaded",
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                } else {
                    adminLogPost = {
                        color: 0X3f213f,
                        title: "INIT",
                        description: "**Performed by: **`" + adminLogSplit[15].replace("'", "") + " " + adminLogSplit[16].replace("':", "")
                            + "`\nAdminhashes and -powerlevels have been reloaded",
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                }
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (adminLogSplit[2].includes("!MESSAGE") == true) {
                adminLogReason = data.split("': ");
                if (adminLogSplit[12].includes("'PRISM") == true) {
                    adminLogPost = {
                        color: 0X2c37ca,
                        title: "MESSAGE",
                        description: "**Performed by: **`" + adminLogSplit[14].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[16].replace("'", "") + " " + adminLogSplit[17].replace("':", "")
                            + "`\n**Message: **" + adminLogReason[1].split(" ").reverse().slice(4).reverse().join(" "),
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                } else {
                    adminLogPost = {
                        color: 0X2c37ca,
                        title: "MESSAGE",
                        description: "**Performed by: **`" + adminLogSplit[12].replace("'", "") + " " + adminLogSplit[13].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[15].replace("'", "") + " " + adminLogSplit[16].replace("':", "")
                            + "`\n**Message: **" + adminLogReason[1].split(" ").reverse().slice(3).reverse().join(" "),
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                }
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (adminLogSplit[2].includes("!SAY") == true) {
                adminLogReason = data.split("': ");
                if (adminLogSplit[16].includes("'PRISM") == true) {
                    adminLogPost = {
                        color: 0X34EB6B,
                        title: "SAY",
                        description: "**Performed by: **`" + adminLogSplit[18].replace("':", "")
                            + "`\n**Content: **" + adminLogReason[1].split(" ").reverse().slice(4).reverse().join(" "),
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                } else {
                    adminLogPost = {
                        color: 0X34EB6B,
                        title: "SAY",
                        description: "**Performed by: **`" + adminLogSplit[16].replace("'", "") + " " + adminLogSplit[17].replace("':", "")
                            + "`\n**Content: **" + adminLogReason[1].split(" ").reverse().slice(3).reverse().join(" "),
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                }
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });
            } else if (adminLogSplit[2].includes("!SETNEXT") == true) {
                adminLogReason = data.split("': ");
                if (adminLogSplit[12].includes("'PRISM") == true) {
                    adminLogPost = {
                        color: 0X10a17d,
                        title: "SETNEXT",
                        description: "**Performed by: **`" + adminLogSplit[14].replace("':", "")
                            + "`\n**Map: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                    adminLogPostPub = {
                        color: 0X10a17d,
                        title: "Next Map Set",
                        description: adminLogReason[1],
                        timestamp: new Date()
                    };
                } else {
                    adminLogPost = {
                        color: 0X10a17d,
                        title: "SETNEXT",
                        description: "**Performed by: **`" + adminLogSplit[12].replace("'", "") + " " + adminLogSplit[13].replace("':", "")
                            + "`\n**Map: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                    adminLogPostPub = {
                        color: 0X10a17d,
                        title: "Next Map Set",
                        description: adminLogReason[1],
                        timestamp: new Date()
                    };
                }
                client.channels.cache.get("995387208947204257").send({ embeds: [adminLogPostPub] });
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });

            } else if (adminLogSplit[2].includes("MAPVOTERESULT") == true) {
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

            } else if (adminLogSplit[2].includes("!SWITCH") == true) {
                adminLogReason = data.split("': ");
                if (adminLogSplit[13].includes("'PRISM") == true) {
                    adminLogPost = {
                        color: 0X3292a8,
                        title: "SWITCH",
                        description: "**Performed by: **`" + adminLogSplit[15].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[17].replace("'", "") + " " + adminLogSplit[18].replace("':", "")
                            + "`\n**When: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                } else {
                    adminLogPost = {
                        color: 0X3292a8,
                        title: "SWITCH",
                        description: "**Performed by: **`" + adminLogSplit[13].replace("'", "") + " " + adminLogSplit[14].replace("'", "")
                            + "`\n**On user: **`" + adminLogSplit[16].replace("'", "") + " " + adminLogSplit[17].replace("':", "")
                            + "`\n**When: **" + adminLogReason[1],
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                }
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });

            } else if (adminLogSplit[2].includes("!RUNNEXT") == true) {
                adminLogReason = data.split("': ");

                fs.writeFile("logs/gungame_winner.txt", "Admin \"!runnext\"", function(err) {
                    if (err) {
                        // append failed
                    } else {
                        // done
                    }
                });

                if (adminLogSplit[12].includes("'PRISM") == true) {
                    adminLogPost = {
                        color: 0X085441,
                        title: "RUNNEXT",
                        description: "**Performed by: **`" + adminLogSplit[14].replace("':", "`"),
                        timestamp: new Date(),
                        footer: {
                            text: "PRISM"
                        }
                    };
                } else {
                    adminLogPost = {
                        color: 0X085441,
                        title: "RUNNEXT",
                        description: "**Performed by: **`" + adminLogSplit[12].replace("'", "") + " " + adminLogSplit[13].replace("'", ""),
                        timestamp: new Date(),
                        footer: {
                            text: "IN-GAME"
                        }
                    };
                }
                client.channels.cache.get("995520998554218557").send({ embeds: [adminLogPost] });

            } else {
                client.channels.cache.get("995520998554218557").send("`" + adminLogSplit + "`");
            }
        }

    };
};

const reportPlayer = (data) => {
    const adminLogPost = new EmbedBuilder()
        .setColor(0X89a110)
        .setDescription(prepDescription(data))
        .setTimestamp();

    if (data.receiver !== undefined) {
        adminLogPost.setTitle("REPORT PLAYER");
    } else {
        adminLogPost.setTitle("REPORT");
    }

    if (data.issuer_type === ISSUERS.PRISM) {
        adminLogPost.setFooter({
            text: "PRISM"
        });
    } else {
        adminLogPost.setFooter({
            text: "IN-GAME"
        });
    }

    return adminLogPost;
};

const kickPlayer = (data) => {
    const adminLogPost = new EmbedBuilder()
        .setTitle("KICK")
        .setColor(0XEB7434)
        .setTimestamp()
        .setDescription(prepDescription(data));

    const adminLogPostPub = new EmbedBuilder()
        .setTitle("Kicked")
        .setColor(0XEB7434)
        .setTimestamp()
        .setFooter({
            text: "You can rejoin after getting kicked."
        })
        .setDescription(prepDescription(data));

    if (data.issuer_type === ISSUERS.SERVER) {
        if (data.body.includes("Account related to banned key:")) {
            adminLogPost.setFooter({
                text: "THIS MESSAGE DOES NOT EXIST! IF PLAYER ASK WHY THEY GET KICKED, JUST PING MAX AND TELL HIM THAT I'LL LOOK INTO IT!"
            });
            adminLogPostPub
                .setFooter({})
                .setDescription(prepDescription(data, "ERROR"));
        }
    } else if (data.issuer_type === ISSUERS.PRISM) {
        adminLogPost.setFooter({
            text: "PRISM"
        });
    } else {
        adminLogPost.setFooter({
            text: "IN-GAME"
        });
    }

    return [adminLogPost, adminLogPostPub];
};

const prepDescription = (data, reason) => {
    let description = "**Performed by: **`" + fullName(data.issuer);
    if (data.receiver !== undefined) {
        description += "`\n**On user: **`" + fullName(data.receiver);
    }

    reason = reason ? reason : data.body;

    description += "`\n**Reason: **" + reason;

    return description;
};

const fullName = (data) => {
    const tag = data.tag;
    const name = data.name;

    if (tag !== "") {
        return tag + " " + name;
    }

    return name;
};
