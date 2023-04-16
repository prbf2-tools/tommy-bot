import geoip from "geoip-lite";

export const descriptionLine = (header: string, body: string, code: boolean | undefined): string => {
  if (code) {
    body = `\`${body}\``;
  }

  return `**${header}: **${body}`
}

export const flagFromIP = (ip: string): string => {
  const geo2 = geoip.lookup(ip);
  if (geo2 !== null && geo2 !== undefined) {
    return geo2.country.toLowerCase();
  }
  return "white";
};
