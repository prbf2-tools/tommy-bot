import { EmbedBuilder } from "discord.js";
import geoip from "geoip-lite";

export const ISSUERS = {
    USER: "user",
    PRISM: "PRISM",
    SERVER: "SERVER",
};

export const parseAdminCommand = (data) => {
    data = data.replace(/\s+/g, " ").trim();
    const split = data.split(" ");

    const output = {
        orig: data,
    };

    // '!REPORT',
    output.command = split[2].replace("!", "");

    let offset;

    if (split[5].includes(ISSUERS.PRISM)) {
        output.issuer_type = ISSUERS.PRISM;

        // "Tommy_Bot':"
        output.issuer = {
            tag: "",
            name: split[7].split("'")[0],
        };

        offset = 2;
    } else if (split[5].includes(ISSUERS.SERVER)) {
        output.issuer_type = ISSUERS.SERVER;
        output.issuer = {
            tag: "",
            name: ISSUERS.SERVER
        };
        offset = 0;
    } else {
        output.issuer_type = ISSUERS.USER;

        output.issuer = {
            tag: split[5].slice(1),
            name: split[6].slice(0, -2),
        };

        offset = 1;
    }

    const i = data.indexOf("]");
    output.body = data.slice(i).split(":")[1];

    if (split[6 + offset] !== undefined && split[6 + offset].includes("on")) {
        output.receiver = {
            tag: split[7 + offset].slice(1),
            name: split[8 + offset].slice(0, -2),
        };
    }

    return output;
};

export const adminCommand = (blueprint, data) => {
    const embed = new EmbedBuilder()
        .setColor(blueprint.color)
        .setTitle(data.command)
        .setDescription(prepDescription(blueprint, data))
        .setTimestamp();

    if (data.issuer_type === ISSUERS.PRISM) {
        embed.setFooter({
            text: "PRISM"
        });
    } else if (data.issuer_type === ISSUERS.USER) {
        embed.setFooter({
            text: "IN-GAME"
        });
    }

    return embed;
};

export const prepDescription = (blueprint, data) => {
    let description = [
        `**Performed by: **\`${fullName(data.issuer)}\``,
    ];

    let header = "Reason";
    if (blueprint.header === null) {
        header = null;
    } else if (blueprint.header) {
        header = blueprint.header;
    }

    let body = data.body;
    if (blueprint.body === null) {
        body = null;
    } else if (blueprint.body) {
        body = blueprint.body;
    } else if (blueprint.extractContent) {
        body = content(body);
    }

    if (body !== null) {
        if (header !== null) {
            description.push(`**${header} : **\`${body}\``);
        } else {
            description.push(body);
        }
    }

    if (data.receiver !== undefined) {
        description.splice(1, 0, `**On user: ** \`${fullName(data.receiver)}\``);
    }

    return description.join("\n");
};

const fullName = (data) => {
    const tag = data.tag;
    const name = data.name;

    if (tag) {
        return tag + " " + name;
    }

    return name;
};

export const content = (body) => {
    const index = body.lastIndexOf(" - ");
    return body.slice(0, index);
};

export const flagFromIP = (ip) => {
    const geo2 = geoip.lookup(ip);
    return geo2 !== null ? geo2.country.toLowerCase() : "white";
};
