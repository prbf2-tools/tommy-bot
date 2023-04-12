import fs from "fs";
import Tail from "always-tail";
import geoip from "geoip-lite";

export const watchJoin = (client) => {
    const filenameJoin = "logs/joinlog.log";
    if (!fs.existsSync(filenameJoin)) fs.writeFileSync(filenameJoin, "");
    const tailJoin = new Tail(filenameJoin, "\n");

    tailJoin.on("line", process(client));

    tailJoin.on("error", function(error) {
        console.log("ERROR: ", error);
    });

    tailJoin.watch();
};

const process = (client) => {
    return (data) => {
        const joinLoglines = data.trim().split("\n");
        const joinLogFormat = joinLoglines[joinLoglines.length - 1].toString("utf-8");
        const joinLogSplit = joinLogFormat.split("\t");

        let accType = "Standard";
        if (joinLogSplit[6] == "(LEGACY)") {
            accType = "Legacy";
        } else if (joinLogSplit[6] == "(VAC BANNED)") {
            accType = "VAC Banned";
        } else if (joinLogSplit[6] == "(LEGACY)(VAC BANNED)") {
            accType = "Legacy and VAC Banned";
        }

        const ip = joinLogSplit[5];
        let geoready = "white";
        const geo2 = geoip.lookup(ip);
        if (geo2 !== null) {
            geoready = geo2.country.toLowerCase();
        }

        const joinLogPost = {
            color: 0X6500B3,
            title: joinLogSplit[3],
            description: "**Hash-ID: **`" + joinLogSplit[1]
                + "`\n**IP: **`" + joinLogSplit[5] + "` :flag_" + geoready
                + ":\n**Account Level: **" + joinLogSplit[2]
                + "\n**Account Type: **" + accType
                + "\n**Creation Date: **" + joinLogSplit[4]
                + "\n**Joined: **" + joinLogSplit[0].replace("[", "").replace("]", ""),
        };
        client.channels.cache.get("995521059119960144").send({ embeds: [joinLogPost] });
    };
};
