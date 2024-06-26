import geoip from "geoip-lite";
import { UserType } from "./interfaces.js";
export const descriptionLine = (header, body, code = true) => {
    if (code) {
        body = `\`${body}\``;
    }
    return `**${header}: **${body}`;
};
export const obfuscateIP = (ip) => {
    const banIPSafe = ip.split(".");
    return `${banIPSafe[0]}.${banIPSafe[1]}.***.***`;
};
export const flagFromIP = (ip) => {
    const geo2 = geoip.lookup(ip);
    if (geo2 !== null && geo2 !== undefined) {
        return geo2.country.toLowerCase();
    }
    return "white";
};
export const decideIssuerType = (groups) => {
    if (groups.prism) {
        return UserType.Prism;
    }
    else if (groups.server) {
        return UserType.Server;
    }
    return UserType.Player;
};
export const fullName = (u) => {
    if (u.tag) {
        return u.tag + " " + u.name;
    }
    return u.name;
};
export const prepareDiscordDate = (unixTimestamp, format) => {
    return `<t:${unixTimestamp}:${format}>`;
};
