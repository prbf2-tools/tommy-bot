import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";

const adapter = new FileSync("./db/db.json");
const db = low(adapter);
db.defaults({
  hashDb: [],
  channels: []
}).write();

export default db;
