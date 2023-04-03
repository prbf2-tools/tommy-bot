const { db } = require("../db/db.js");
const { getCommonValues } = require("./getCommonValues.js");

const rolesObj = {
  "993997234070896741": "senior", //Mafioso
  "995782398803464192": "senior", //Sysadmin
  "995093704366891079": "senior", //Senior Admin
  "995093551216078858": "admin", //Admin
  "1062472543275057212": "trial", //Trial Admin
};

const getAdmins = (client) => {
  const roles = Object.keys(rolesObj);
  setInterval(async () => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const members = guild.members.cache;
    const ownerId = guild.ownerId;
    const hashDb = db.get("hashDb");
    await guild.members.fetch(ownerId);
    for (const member of members) {
      const commonRoles = getCommonValues(member._roles, roles);
      if (commonRoles.length === 0) continue;
      const adminRolesString = commonRoles.map((role) => rolesObj[role]);
      const role = adminRolesString.includes("senior")
        ? "senior"
        : adminRolesString.includes("admin")
        ? "admin"
        : "trial";
      const hashRecord = hashDb.find((record) => record.id === member.id);
      if (!hashRecord || hashRecord.role === role) continue;
      hashRecord.role = role;
    }
    db.write();
  }, 5 * 60 * 1000); // 5 minutes
};

module.exports = { getAdmins };
