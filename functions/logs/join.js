import geoip from "geoip-lite";
import { EmbedBuilder } from "discord.js";


export const processJoin = (line) => {
    const joinLoglines = line.trim().split("\n");
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

    return new EmbedBuilder()
        .setColor(0X6500B3)
        .setTitle(joinLogSplit[3])
        .setDescription(
            "**Hash-ID: **`" + joinLogSplit[1]
            + "`\n**IP: **`" + joinLogSplit[5] + "` :flag_" + geoready
            + ":\n**Account Level: **" + joinLogSplit[2]
            + "\n**Account Type: **" + accType
            + "\n**Creation Date: **" + joinLogSplit[4]
            + "\n**Joined: **" + joinLogSplit[0].replace("[", "").replace("]", "")
        );
};
