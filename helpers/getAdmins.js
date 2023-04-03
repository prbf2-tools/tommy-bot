import { db } from "../db/db.js";
import { client } from "./client/client.js";
import { getCommonValues } from "./getCommonValues.js";

const rolesObj = {
  "993997234070896741": "senior", //Mafioso
  "995782398803464192": "senior", //Sysadmin
  "995093704366891079": "senior", //Senior Admin
  "995093551216078858": "admin", //Admin
  "1062472543275057212": "trial", //Trial Admin
};

export const getAdmins = () => {
  const roles = Object.keys(rolesObj);
  setInterval(async () => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const members = guild.members.cache;
    const ownerId = guild.ownerId;
    await guild.members.fetch(ownerId);
    const admins = members.map((member) => {
      const commonRoles = getCommonValues(member._roles, roles);
      if (commonRoles.length === 0) return;
      const adminRolesString = commonRoles.map((role) => rolesObj[role]);
      const role = adminRolesString.includes("senior")
        ? "senior"
        : adminRolesString.includes("admin")
        ? "admin"
        : "trial";
      return {
        id: member.id,
        name: member.user.username,
        role: role,
      };
    });
    const filteredAdmins = admins.filter((admin) => admin !== undefined);
    db.data.admins = filteredAdmins;
    db.write();
  }, 5 * 60 * 1000); // 5 minutes
};
