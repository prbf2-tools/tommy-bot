import geoip from "geoip-lite";
import { UserType } from "./interfaces.js";
export const descriptionLine = (header, body, code = true) => {
    if (code) {
        body = `\`${body}\``;
    }
    return `**${header}: **${body}`;
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
