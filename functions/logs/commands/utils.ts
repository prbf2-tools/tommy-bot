import { EmbedBuilder } from "discord.js";
import geoip from "geoip-lite";

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

export const fullName = (data) => {
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
