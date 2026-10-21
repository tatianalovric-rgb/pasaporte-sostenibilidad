import { entries, users } from '@shared/schema';
import { and, eq } from "drizzle-orm";
import type { Entry, InsertEntry, User } from '@shared/schema';
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const dbPath = process.env.DATA_PATH || "data.db";
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.exec(`CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL DEFAULT 'local',
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT NOT NULL DEFAULT '',
  evidence TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT '',
  UNIQUE (user_id, key)
)`);

sqlite.exec(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TEXT NOT NULL
)`);

import demoSeed from "./seed-demo.json";

try {
  const countRow = sqlite.prepare("SELECT COUNT(*) as count FROM entries WHERE user_id = 'local'").get() as { count: number };
  if (countRow && countRow.count === 0 && Array.isArray(demoSeed) && demoSeed.length > 0) {
    const insert = sqlite.prepare(`
      INSERT INTO entries (user_id, key, value, status, note, evidence, owner)
      VALUES ('local', @key, @value, @status, @note, @evidence, @owner)
    `);
    const insertMany = sqlite.transaction((rows: any[]) => {
      for (const row of rows) insert.run(row);
    });
    insertMany(demoSeed);
    console.log(`[Storage] Pre-seeded ${demoSeed.length} demo entries for 'local'`);
  }
} catch (e) {
  console.warn("[Storage] Note on auto-seeding:", e);
}

export const db = drizzle(sqlite);

export interface IStorage {
  listEntries(userId: string): Promise<Entry[]>;
  upsertEntries(userId: string, items: InsertEntry[]): Promise<Entry[]>;
  resetEntries(userId: string): Promise<void>;

  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: { id: string; email: string; passwordHash: string; companyName: string; role?: string; createdAt: string }): Promise<User>;
  listCompanies(): Promise<{ id: string; email: string; companyName: string; role: string; createdAt: string }[]>;
}

export class DatabaseStorage implements IStorage {
  async listEntries(userId: string): Promise<Entry[]> {
    return db.select().from(entries).where(eq(entries.userId, userId)).all();
  }

  async upsertEntries(userId: string, items: InsertEntry[]): Promise<Entry[]> {
    for (const item of items) {
      db.insert(entries)
        .values({ ...item, userId })
        .onConflictDoUpdate({
          target: [entries.userId, entries.key],
          set: {
            value: item.value ?? "",
            status: item.status ?? "pending",
            note: item.note ?? "",
            evidence: item.evidence ?? "",
            owner: item.owner ?? "",
          },
        })
        .run();
    }
    return this.listEntries(userId);
  }

  async resetEntries(userId: string): Promise<void> {
    db.delete(entries).where(eq(entries.userId, userId)).run();
  }

  async getUser(id: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).get();
  }

  async createUser(user: { id: string; email: string; passwordHash: string; companyName: string; role?: string; createdAt: string }): Promise<User> {
    const role = user.role || "client";
    const inserted = {
      id: user.id,
      email: user.email.toLowerCase().trim(),
      passwordHash: user.passwordHash,
      companyName: user.companyName.trim(),
      role,
      createdAt: user.createdAt,
    };
    db.insert(users).values(inserted).run();
    return inserted;
  }

  async listCompanies(): Promise<{ id: string; email: string; companyName: string; role: string; createdAt: string }[]> {
    return db.select({
      id: users.id,
      email: users.email,
      companyName: users.companyName,
      role: users.role,
      createdAt: users.createdAt,
    }).from(users).all();
  }
}

void and;

// Selección de backend: Supabase si hay credenciales, SQLite local en caso contrario.
import { SupabaseStorage, supabaseConfigured } from "./supabase-storage";

export const storage: IStorage = supabaseConfigured
  ? new SupabaseStorage()
  : new DatabaseStorage();

export const storageBackend = supabaseConfigured ? "supabase" : "sqlite";
