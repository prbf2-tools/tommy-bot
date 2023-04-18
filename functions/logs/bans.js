import { EmbedBuilder } from "discord.js";
import { decideIssuerType, descriptionLine, flagFromIP } from "./utils.js";
import { UserType } from "./interfaces.js";
var Duration;
(function (Duration) {
    Duration["Permanent"] = "perm";
    Duration["Round"] = "round";
})(Duration || (Duration = {}));
export const prepareEmbeds = (ban) => {
    let duration = "";
    if (ban.duration == Duration.Permanent) {
        duration = "Permanently";
    }
    else if (ban.duration == Duration.Round) {
        duration = "Current Round";
    }
    else {
        const hours = ban.duration / 3600;
        duration = hours + " Hours";
    }
    const color = 0x991b0d;
    const banSendPub = new EmbedBuilder()
        .setColor(color)
        .setTitle("Banned player: " + ban.receiver.toString())
        .setDescription([
        descriptionLine("Reason", ban.body),
        descriptionLine("Duration", duration)
    ].join("\n"))
        .setFooter({
        text: ban.issuer.toString() + " In-Game"
    })
        .setTimestamp(ban.date);
    const ip = ban.receiver.ip;
    const banSendAdmin = new EmbedBuilder()
        .setColor(color)
        .setTitle("BANNED")
        .setDescription([
        descriptionLine("Name", ban.receiver.toString()),
        descriptionLine("By", ban.issuer.toString()),
        descriptionLine("Reason", ban.body),
        descriptionLine("Duration", duration),
        descriptionLine("Hash-ID", ban.receiver.hash),
        descriptionLine("IP", `\`${obfuscateIP(ip)}\` :flag_${flagFromIP(ip)}`)
    ].join("\n"))
        .setTimestamp(ban.date);
    return {
        priv: banSendAdmin,
        pub: banSendPub,
    };
};
const obfuscateIP = (ip) => {
    const banIPSafe = ip.split(".");
    return `${banIPSafe[0]}.${banIPSafe[1]}.***.***`;
};
const regex = /\[(?<date>(\d{4})-(\d{2})-(\d{2}))\s(?<time>(\d{2}):(\d{2})(:\d{2})?)\]\s(?<hash>\w+)\s(?<receiver>(?<r_tag>\S*)\s(?<r_name>\S+))\s(?<ip>(\d{1,3}\.?){4})\s(?<body>.*) banned by (?<issuer>((PRISM user (?<prism>\S+))|(?<i_tag>\S*)\s(?<i_name>\S+)))\s\((?<duration>.+)\)/;
export const parseBanLine = (line) => {
    const match = line.match(regex);
    if (!match || !match.groups) {
        console.log("Unable to parse command line: ", line);
        return null;
    }
    const groups = match.groups;
    let duration = 0;
    switch (groups.duration) {
        case "perm":
            duration = Duration.Permanent;
            break;
        case "round":
            duration = Duration.Round;
            break;
        default:
            duration = Number(groups.duration);
    }
    const out = {
        date: new Date(groups.date + "T" + groups.time),
        body: groups.body,
        issuer: {
            typ: decideIssuerType(groups),
            name: groups.prism || groups.i_name,
            tag: groups.i_tag,
        },
        receiver: {
            typ: UserType.Player,
            name: groups.r_name,
            tag: groups.r_tag,
            hash: groups.hash,
            ip: groups.ip,
        },
        duration: duration,
    };
    return out;
};
