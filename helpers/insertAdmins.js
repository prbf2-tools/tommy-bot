const fs = require("fs");
const { db } = require("../db/db.js");
const path = require("path");
const PRISM = require("../functions/handlePRISM.js");

const pathToRealityAdmin =
  "C:/Users/Administrator/Desktop/Mafia/mods/pr/python/game/realityconfig_admin.py";
const pathToDb = path.join(__dirname, "..", "db");

const insertAdmins = () => {
  try {
    fs.copyFileSync(
      pathToRealityAdmin,
      path.join(pathToDb, "realityconfig_admin.py")
    );
    const realityconfigFile = fs.readFileSync(
      path.join(pathToDb, "realityconfig_admin.py"),
      "utf8"
    );
    const hashDb = db.get("hashDb").value();
    const filterRoleless = hashDb.filter((hash) => hash.role);
    const objectToReplace = realityconfigFile.match(
      /adm_adminHashes = {[\s\S]*?}/
    );
    let str = "{\n";
    for (let i = 0; i < filterRoleless.length; i++) {
      const adminHash = filterRoleless[i].hashId;
      const adminHashNoSpace = adminHash.replace(/\s/g, "");
      const adminName = filterRoleless[i].ingameName;
      const adminRole = filterRoleless[i].role;
      const adminRoleNumber =
        adminRole === "senior"
          ? "0"
          : adminRole === "admin"
          ? "1"
          : adminRole === "trial"
          ? "2"
          : null;
      if (!adminRoleNumber) {
        console.log(`Error with ${adminHashNoSpace}!`);
        continue;
      }
      str += `    "${adminHashNoSpace}":  ${adminRoleNumber},  #${adminName}\n`;
    }
    str += "}";
    const realityconfigFileUpdated = realityconfigFile.replace(
      objectToReplace,
      `adm_adminHashes = ${str}`
    );
    fs.writeFileSync(pathToRealityAdmin, realityconfigFileUpdated);
    setTimeout(() => {
      PRISM.writePrism("say", `!init`);
    }, 2000);
    console.log("Admins inserted!");
  } catch (err) {
    console.log(`Error Inserting Admins: ${err}`);
  }
};

module.exports = { insertAdmins };
