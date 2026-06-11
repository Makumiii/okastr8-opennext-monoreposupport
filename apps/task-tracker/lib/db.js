import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";

const dbPath = process.env.SQLITE_PATH || "/tmp/task-tracker.db";
let sqlitePromise;
let db;

async function getSqlite() {
  if (!sqlitePromise) {
    sqlitePromise = initSqlJs({
      locateFile: (file) => path.join(process.cwd(), "node_modules/sql.js/dist", file)
    });
  }
  return sqlitePromise;
}

export async function getDb() {
  if (db) return db;
  const SQL = await getSqlite();
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      pomodoros INTEGER NOT NULL DEFAULT 0,
      active_started_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  persist();
  return db;
}

export function persist() {
  if (!db) return;
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
}

export async function all(sql, params = []) {
  const database = await getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

export async function run(sql, params = []) {
  const database = await getDb();
  database.run(sql, params);
  persist();
}
