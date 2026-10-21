import type { Express, Request } from "express";
import type { Server } from 'node:http';
import { storage } from "./storage";
import { insertEntrySchema } from "@shared/schema";
import * as z from "zod";

const bulkSchema = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1).max(120),
      value: z.string().max(4000).default(""),
      status: z.enum(["pending", "done", "na"]).default("pending"),
      note: z.string().max(4000).default(""),
      evidence: z.string().max(4000).default(""),
      owner: z.string().max(200).default(""),
    })
  ).max(200),
});

/**
 * Resuelve el identificador de tenant/empresa:
 * 1. Si hay sesión iniciada:
 *    - Si es consultora y especifica companyId en query o header, opera sobre esa empresa.
 *    - Si es empresa cliente, usa estrictamente su userId aislado.
 * 2. Si no hay sesión, recurre a X-Visitor-Id o "local" (datos demo).
 */
async function resolveTenantId(req: Request): Promise<string> {
  const sessionUserId = (req.session as any)?.userId;
  if (sessionUserId) {
    const user = await storage.getUser(sessionUserId);
    if (user) {
      if (user.role === "consultant") {
        const targetCompany = (req.query.companyId as string) || req.header("X-Company-Id");
        if (targetCompany) {
          return targetCompany.slice(0, 200);
        }
      }
      return user.id;
    }
  }
  return req.header("X-Visitor-Id")?.slice(0, 200) || "local";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/entries", async (req, res) => {
    const tenantId = await resolveTenantId(req);
    res.json(await storage.listEntries(tenantId));
  });

  app.put("/api/entries", async (req, res) => {
    const parsed = bulkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", issues: parsed.error.issues });
    }
    const tenantId = await resolveTenantId(req);
    res.json(await storage.upsertEntries(tenantId, parsed.data.items));
  });

  app.delete("/api/entries", async (req, res) => {
    const tenantId = await resolveTenantId(req);
    await storage.resetEntries(tenantId);
    res.json({ ok: true });
  });

  void insertEntrySchema;
  return httpServer;
}
