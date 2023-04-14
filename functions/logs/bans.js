import geoip from "geoip-lite";
import { EmbedBuilder } from "discord.js";


export const processBan = (line) => {
    const banLogSplit = line.split(" ");
    const banAdmin = banLogSplit[banLogSplit.length - 2];
    const banName = banLogSplit[3] + " " + banLogSplit[4];
    const banHash = banLogSplit[2];
    const banIP = banLogSplit[5];
    let banDuration = "";
    if (banLogSplit[banLogSplit.length - 1] === "(perm)\r") {
        banDuration = "Permanently";
    } else if (banLogSplit[banLogSplit.length - 1] === "(round)\r") {
        banDuration = "Current Round";
    } else {
        const banTimeRaw = banLogSplit[banLogSplit.length - 1].replace("(", "").replace(")", "");
        const banTimeHour = Number(banTimeRaw) / 3600;
        banDuration = banTimeHour + " Hours";
    }
    var banReason = banLogSplit.splice(6, banLogSplit.length).join(" ").split("banned by")[0];

    const banSendPub = new EmbedBuilder()
        .setColor(0x991b0d)
        .setTitle("Banned player: " + banName)
        .setDescription(
            "\n**Reason:** " + banReason
            + "\n**Duration:** " + banDuration,
        )
        .setFooter({
            text: banAdmin + " In-Game"
        })
        .setTimestamp();

    let geoready = "white";
    const geo2 = geoip.lookup(banIP);
    if (geo2 !== null) {
        geoready = geo2.country.toLowerCase();
    }

    const banSendAdmin = new EmbedBuilder()
        .setColor(0x991b0d)
        .setTitle("Banned player: " + banName)
        .setTitle("BANNED")
        .setDescription(
            "**Name:** `" + banName
            + "`\n**By:** `" + banAdmin
            + "`\n**Reason:** " + banReason
            + "\n**Duration:** " + banDuration
            + "\n**Hash-ID:** `" + banHash
            + "`\n**IP:** `" + obfuscateIP(banIP) + "` :flag_" + geoready + ":"
        )
        .setTimestamp();

    return {
        priv: banSendAdmin,
        pub: banSendPub,
    };
};

const obfuscateIP = (ip) => {
    const banIPSafe = ip.split(".");
    return `${banIPSafe[0]}.${banIPSafe[1]}.***.***`;
};
