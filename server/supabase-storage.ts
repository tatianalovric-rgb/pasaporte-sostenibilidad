import { createClient } from "@supabase/supabase-js";
import type { Entry, InsertEntry, User } from "@shared/schema";
import type { IStorage } from "./storage";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && key);

const client = supabaseConfigured ? createClient(url!, key!) : null;

const TABLE = "entries";
const USERS_TABLE = "users";

/**
 * Persistencia en Supabase con aislamiento por visitante o usuario.
 */
export class SupabaseStorage implements IStorage {
  async listEntries(userId: string): Promise<Entry[]> {
    const { data, error } = await client!
      .from(TABLE)
      .select("id, key, value, status, note, evidence, owner")
      .eq("user_id", userId)
      .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as Entry[];
  }

  async upsertEntries(userId: string, items: InsertEntry[]): Promise<Entry[]> {
    const rows = items.map((item) => ({
      user_id: userId,
      key: item.key,
      value: item.value ?? "",
      status: item.status ?? "pending",
      note: item.note ?? "",
      evidence: item.evidence ?? "",
      owner: item.owner ?? "",
    }));
    const { error } = await client!.from(TABLE).upsert(rows, { onConflict: "user_id,key" });
    if (error) throw new Error(error.message);
    return this.listEntries(userId);
  }

  async resetEntries(userId: string): Promise<void> {
    const { error } = await client!.from(TABLE).delete().eq("user_id", userId);
    if (error) throw new Error(error.message);
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await client!
      .from(USERS_TABLE)
      .select("id, email, password_hash, company_name, role, created_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return undefined;
    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      companyName: data.company_name,
      role: data.role,
      createdAt: data.created_at,
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await client!
      .from(USERS_TABLE)
      .select("id, email, password_hash, company_name, role, created_at")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();
    if (error || !data) return undefined;
    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      companyName: data.company_name,
      role: data.role,
      createdAt: data.created_at,
    };
  }

  async createUser(user: { id: string; email: string; passwordHash: string; companyName: string; role?: string; createdAt: string }): Promise<User> {
    const role = user.role || "client";
    const row = {
      id: user.id,
      email: user.email.toLowerCase().trim(),
      password_hash: user.passwordHash,
      company_name: user.companyName.trim(),
      role,
      created_at: user.createdAt,
    };
    const { error } = await client!.from(USERS_TABLE).insert(row);
    if (error) throw new Error(error.message);
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      companyName: row.company_name,
      role: row.role,
      createdAt: row.created_at,
    };
  }

  async listCompanies(): Promise<{ id: string; email: string; companyName: string; role: string; createdAt: string }[]> {
    const { data, error } = await client!
      .from(USERS_TABLE)
      .select("id, email, company_name, role, created_at")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      email: d.email,
      companyName: d.company_name,
      role: d.role,
      createdAt: d.created_at,
    }));
  }
}
