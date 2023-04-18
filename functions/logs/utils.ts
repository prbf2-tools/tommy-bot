import geoip from "geoip-lite";
import { UserType } from "./interfaces.js";
import { User } from "./interfaces.js";

export const descriptionLine = (header: string, body: string, code = true): string => {
    if (code) {
        body = `\`${body}\``;
    }

    return `**${header}: **${body}`;
};

export const obfuscateIP = (ip: string) => {
    const banIPSafe = ip.split(".");
    return `${banIPSafe[0]}.${banIPSafe[1]}.***.***`;
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

export const fullName = (u: User): string => {
    if (u.tag) {
        return u.tag + " " + u.name;
    }
    return u.name;
};
