import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dbPath = process.env.SQLITE_PATH || "/tmp/task-tracker.db";
let db;

export async function getDb() {
  if (db) return db;
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      pomodoros INTEGER NOT NULL DEFAULT 0,
      active_started_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

export function persist() {
  // Native SQLite persists writes directly to dbPath.
}

export async function all(sql, params = []) {
  const database = await getDb();
  return database.prepare(sql).all(...params);
}

export async function run(sql, params = []) {
  const database = await getDb();
  database.prepare(sql).run(...params);
}
