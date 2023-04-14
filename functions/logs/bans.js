import { EmbedBuilder } from "discord.js";
import { flagFromIP, fullName } from "./utils.js";


export const processBan = (line) => {
    const parsed = parseBanLine(line);

    const color = 0x991b0d;
    const banSendPub = new EmbedBuilder()
        .setColor(color)
        .setTitle("Banned player: " + fullName(parsed))
        .setDescription(
            "\n**Reason:** " + parsed.reason
            + "\n**Duration:** " + parsed.duration,
        )
        .setFooter({
            text: parsed.admin + " In-Game"
        })
        .setTimestamp();

    const banSendAdmin = new EmbedBuilder()
        .setColor(color)
        .setTitle("BANNED")
        .setDescription(
            "**Name:** `" + fullName(parsed)
            + "`\n**By:** `" + parsed.admin
            + "`\n**Reason:** " + parsed.reason
            + "\n**Duration:** " + parsed.duration
            + "\n**Hash-ID:** `" + parsed.hash
            + "`\n**IP:** `" + obfuscateIP(parsed.ip) + "` :flag_" + flagFromIP(parsed.ip) + ":"
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

export const parseBanLine = (line) => {
    const split = line.trim().split(" ");

    let offset = 0;
    if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(split[5])) {
        offset = 1;
    }

    const out = {
        hash: split[2],
        ip: split[4 + offset],
        name: split[3 + offset],
    };

    if (offset === 1) {
        out.tag = split[3];
    }

    const rawContent = split.slice(5 + offset).join(" ").split("banned by");

    out.reason = rawContent[0];
    out.admin = rawContent[1].split(" ").slice(0, -1).join(" ").trim();

    const rawDuration = split[split.length - 1].replace("(", "").replace(")", "");
    if (rawDuration === "perm") {
        out.duration = "Permanently";
    } else if (rawDuration === "round") {
        out.duration = "Current Round";
    } else {
        const hours = Number(rawDuration) / 3600;
        out.duration = hours + " Hours";
    }

    return out;
}; 
