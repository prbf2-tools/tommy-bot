import { EmbedBuilder } from "discord.js";
import { descriptionLine, flagFromIP, obfuscateIP } from "./utils.js";
import { Embeds, UserDetailed, UserType } from "./interfaces.js";
import config from "../../config.js";

interface JoinData extends UserDetailed {
    joined: Date,
    created: Date,

    level: string,
    vacBan: boolean,
    legacy: boolean,
}

const regex = /\[(?<date>(\d{4})-(\d{2})-(\d{2}))\s(?<time>(\d{2}):(\d{2})(:\d{2})?)\]\s(?<hash>\w+)\s(?<level>\d)\s(?<player>(?<tag>\S*)\s(?<name>\S+))\s(?<created>(\d{4})-(\d{2})-(\d{2}))\s+(?<ip>(\d{1,3}\.?){4})\s+(\((?<legacy>LEGACY)\))?(\((?<vac_ban>VAC BANNED)\))?/;

export const parseJoinLine = (line: string): JoinData | null => {
    const match = line.match(regex);
    if (!match || !match.groups) {
        console.log("Unable to parse command line: ", line);
        return null;
    }

    const groups = match.groups;

    return {
        joined: new Date(groups.date + "T" + groups.time + config.timezone),
        created: new Date(groups.created),

        typ: UserType.Player,
        name: groups.name,
        tag: groups.tag,
        hash: groups.hash,
        ip: groups.ip,

        level: groups.level,
        legacy: groups.legacy !== undefined,
        vacBan: groups.vac_ban !== undefined,
    };
};

export const prepareEmbeds = (join: JoinData): Embeds => {
    const accType: string[] = [];
    if (join.legacy) {
        accType.push("Legacy");
    }
    if (join.vacBan) {
        accType.push("VAC Banned");
    }

    if (accType.length === 0) {
        accType.push("Standard");
    }

    const priv = new EmbedBuilder()
        .setColor(0X6500B3)
        .setTitle(join.name)
        .setDescription([
            descriptionLine("Hash-ID", join.hash),
            descriptionLine("IP", `\`${obfuscateIP(join.ip)}\` :flag_${flagFromIP(join.ip)}:`, false),
            descriptionLine("Account Level", join.level),
            descriptionLine("Account Type", accType.join(" and ")),
            descriptionLine("Creation Date", join.created.toDateString(), false),
            descriptionLine("Joined", join.joined.toString(), false),
        ].join("\n"));

    return { priv };
};
