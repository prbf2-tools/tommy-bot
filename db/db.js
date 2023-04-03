const { join, dirname } = require("node:path");
const { fileURLToPath } = require("node:url");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");

const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();
db.data ||= { admins: [], hashDb: [] };
await db.write();

module.exports = { db };
