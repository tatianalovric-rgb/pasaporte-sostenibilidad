import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import type * as z from "zod/mini";

/**
 * Un único registro por campo de divulgación VSME.
 * `key` es el identificador canónico del datapoint (ej. "B3.energia_total").
 * `status`: pending | done | na
 */
export const entries = sqliteTable("entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().default("local"),
  key: text("key").notNull(),
  value: text("value").notNull().default(""),
  status: text("status").notNull().default("pending"),
  note: text("note").notNull().default(""),
  evidence: text("evidence").notNull().default(""),
  owner: text("owner").notNull().default(""),
});

export const insertEntrySchema = createInsertSchema(entries).omit({
  id: true,
  userId: true,
});

export type InsertEntry = z.infer<typeof insertEntrySchema>;
export type Entry = Omit<typeof entries.$inferSelect, "userId">;

/**
 * Tabla de Usuarios y Empresas para autenticación segura.
 */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  companyName: text("company_name").notNull(),
  role: text("role").notNull().default("client"), // "client" | "consultant"
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PublicUser = Omit<User, "passwordHash">;
