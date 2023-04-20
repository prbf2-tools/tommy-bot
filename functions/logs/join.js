import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import { descriptionLine, flagFromIP, prepareDiscordDate } from "./utils.js";
import { DiscordTimeFormat, UserType } from "./interfaces.js";
import config from "../../config.js";
const regex = /\[(?<date>(\d{4})-(\d{2})-(\d{2}))\s(?<time>(\d{2}):(\d{2})(:\d{2})?)\]\s(?<hash>\w+)\s(?<level>\d)\s(?<player>(?<tag>\S*)\s(?<name>\S+))\s(?<created>(\d{4})-(\d{2})-(\d{2}))\s+(?<ip>(\d{1,3}\.?){4})\s+(\((?<legacy>LEGACY)\))?(\((?<vac_ban>VAC BANNED)\))?/;
export const parseJoinLine = (line) => {
    const match = line.match(regex);
    if (!match || !match.groups) {
        console.log("Unable to parse command line: ", line);
        return null;
    }
    const groups = match.groups;
    return {
        joined: dayjs(groups.date + "T" + groups.time + config.timezone),
        created: dayjs(groups.created + "T" + "00:00:00" + config.timezone),
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
export const prepareEmbeds = (join) => {
    const accType = [];
    if (join.legacy) {
        accType.push("Legacy");
    }
    if (join.vacBan) {
        accType.push("VAC Banned");
    }
    if (accType.length === 0) {
        accType.push("Standard");
    }
    const created = `${prepareDiscordDate(join.created.unix(), DiscordTimeFormat.Date)}`;
    const joined = `${prepareDiscordDate(join.joined.unix(), DiscordTimeFormat.Date)} ${prepareDiscordDate(join.joined.unix(), DiscordTimeFormat.LongTime)}`;
    const priv = new EmbedBuilder()
        .setColor(0X6500B3)
        .setTitle(join.name)
        .setDescription([
        descriptionLine("Hash-ID", join.hash),
        descriptionLine("IP", `\`${join.ip}\` :flag_${flagFromIP(join.ip)}:`, false),
        descriptionLine("Account Level", join.level, false),
        descriptionLine("Account Type", accType.join(" and "), false),
        descriptionLine("Creation Date", created, false),
        descriptionLine("Joined", joined, false),
    ].join("\n"));
    return { priv };
};
