import geoip from "geoip-lite";
import { UserType } from "./interfaces";

export const descriptionLine = (header: string, body: string, code = true): string => {
    if (code) {
        body = `\`${body}\``;
    }

    return `**${header}: **${body}`;
};

export const flagFromIP = (ip: string): string => {
    const geo2 = geoip.lookup(ip);
    if (geo2 !== null && geo2 !== undefined) {
        return geo2.country.toLowerCase();
    }
    return "white";
};

export const decideIssuerType = (groups: { [key: string]: string }): UserType => {
    if (groups.prism) {
        return UserType.Prism;
    } else if (groups.server) {
        return UserType.Server;
    }

    return UserType.Player;
};
