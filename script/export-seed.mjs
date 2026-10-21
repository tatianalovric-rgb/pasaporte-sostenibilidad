import Database from "better-sqlite3";
import fs from "node:fs";

const db = new Database("data.db");
const rows = db.prepare("SELECT key, value, status, note, evidence, owner FROM entries WHERE user_id = 'local'").all();
console.log("Demo entries count in local DB:", rows.length);
fs.writeFileSync("server/seed-demo.json", JSON.stringify(rows, null, 2), "utf-8");
console.log("Exported server/seed-demo.json successfully!");
