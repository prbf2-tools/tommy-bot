import fs from "fs";
import Tail from "always-tail";
import geoip from "geoip-lite";

export const watchJoin = (client) => {
    var filenameJoin = "logs/joinlog.log";
    if (!fs.existsSync(filenameJoin)) fs.writeFileSync(filenameJoin, "");
    const tailJoin = new Tail(filenameJoin, "\n");

    tailJoin.on("line", process(client));

    tailJoin.on("error", function(error) {
        console.log("ERROR: ", error);
    });

    tailJoin.watch();
};

const process = (client) => {
    return (dataJoin) => {
        let joinLoglines = dataJoin.trim().split("\n");
        var joinLogFormat = joinLoglines[joinLoglines.length - 1].toString("utf-8");
        var joinLogSplit = joinLogFormat.split("\t");
        var accType = "Standard";
        if (joinLogSplit[6] == "(LEGACY)") {
            accType = "Legacy";
        } else if (joinLogSplit[6] == "(VAC BANNED)") {
            accType = "VAC Banned";
        } else if (joinLogSplit[6] == "(LEGACY)(VAC BANNED)") {
            accType = "Legacy and VAC Banned";
        }
        var geoready = "INVALID";
        var ip = joinLogSplit[5];
        var geo = geoip.lookup(ip);
        if (geo === null) {
            geoready = "white";
        } else {
            geoready = geo.country.toLowerCase();
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
