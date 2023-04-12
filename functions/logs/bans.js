import fs from "fs";
import Tail from "always-tail";
import geoip from "geoip-lite";

export const watchBanlist = (client) => {
    var filenameBans = "logs/banlist_info.log";
    if (!fs.existsSync(filenameBans)) fs.writeFileSync(filenameBans, "");
    const tailBans = new Tail(filenameBans, "\n");

    tailBans.on("line", process(client));

    tailBans.on("error", function(error) {
        console.log("ERROR: ", error);
    });

    tailBans.watch();

};

const process = (client) => {
    return (dataBans) => {
        var banLogSplit = dataBans.split(" ");
        console.log(banLogSplit);
        var banAdmin = banLogSplit[banLogSplit.length - 2];
        var banName = banLogSplit[3] + " " + banLogSplit[4];
        var banHash = banLogSplit[2];
        var banIP = banLogSplit[5];
        let banDuration = "";
        if (banLogSplit[banLogSplit.length - 1] === "(perm)\r") {
            banDuration = "Permanently";
        } else if (banLogSplit[banLogSplit.length - 1] === "(round)\r") {
            banDuration = "Current Round";
        } else {
            var banTimeRaw = banLogSplit[banLogSplit.length - 1].replace("(", "").replace(")", "");
            var banTimeHour = Number(banTimeRaw) / 3600;
            banDuration = banTimeHour + " Hours";
        }
        var banReason = banLogSplit.splice(6, banLogSplit.length).join(" ").split("banned by")[0];

        const banSendPub = {
            color: 0x991b0d,
            title: "Banned player: " + banName,
            description: "\n**Reason:** " + banReason
                + "\n**Duration:** " + banDuration,
            footer: {
                text: banAdmin + " In-Game"
            },
            timestamp: new Date(),
        };
        var geoready = "INVALID";
        banIP = banLogSplit[5];
        var geo2 = geoip.lookup(banIP);
        if (geo2 === null) {
            geoready = "white";
        } else {
            geoready = geo2.country.toLowerCase();
        }
        var banIPSafe = banIP.split(".");

        const banSendAdmin = {
            color: 0x991b0d,
            title: "BANNED",
            description: "**Name:** `" + banName
                + "`\n**By:** `" + banAdmin
                + "`\n**Reason:** " + banReason
                + "\n**Duration:** " + banDuration
                + "\n**Hash-ID:** `" + banHash
                + "`\n**IP:** `" + banIPSafe[0] + "." + banIPSafe[1] + ".***.***` :flag_" + geoready + ":",
            timestamp: new Date(),
        };

        client.channels.cache.get("995387208947204257").send({ embeds: [banSendPub] }); //742795954729517077
        client.channels.cache.get("995520998554218557").send({ embeds: [banSendAdmin] });
    };
};
