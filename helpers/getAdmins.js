const { db } = require("../db/db.js");
const { getCommonValues } = require("./getCommonValues.js");

const rolesObj = {
  "993997234070896741": "senior", //Mafioso
  "995782398803464192": "senior", //Sysadmin
  "995093704366891079": "senior", //Senior Admin
  "995093551216078858": "admin", //Admin
  "1062472543275057212": "trial", //Trial Admin
};

const getAdmins = async (client) => {
  const roles = Object.keys(rolesObj);
  setInterval(async () => {
    try {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const members = await guild.members.fetch();
      const ownerId = guild.ownerId;
      const hashDb = db.get("hashDb");
      await guild.members.fetch(ownerId);
      for (const member of members) {
        const memberId = member[1].id;
        const memberRoles = member[1]._roles;
        const commonRoles = getCommonValues(memberRoles, roles);
        if (commonRoles.length === 0) continue;
        const adminRolesString = commonRoles.map((role) => rolesObj[role]);
        const role = adminRolesString.includes("senior")
          ? "senior"
          : adminRolesString.includes("admin")
          ? "admin"
          : "trial";
        const hashRecord = hashDb.find({ id: memberId }).value();
        if (!hashRecord || hashRecord.role === role) continue;
        hashDb.find({ id: memberId }).assign({ role }).write();
      }
    } catch (e) {
      console.log("Error getting admins", e);
    }
  }, 60000); // 1 minute(s)
};

module.exports = { getAdmins };
