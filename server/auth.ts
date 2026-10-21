import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import memorystore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { storage } from "./storage";
import type { User, PublicUser } from "@shared/schema";
import * as z from "zod";

const scryptAsync = promisify(scrypt);

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) return false;
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

function sanitizeUser(user: User): PublicUser {
  const { passwordHash, ...rest } = user;
  return rest;
}

const registerSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  companyName: z.string().min(2, "El nombre de la empresa es obligatorio"),
  role: z.enum(["client", "consultant"]).default("client"),
});

const loginSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export function setupAuth(app: Express) {
  const MemoryStore = memorystore(session);
  const sessionSecret = process.env.SESSION_SECRET || "pasaporte-sostenibilidad-tatiana-lovric-2026";

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // 24 hours
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // Registro de nueva empresa
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: parsed.error.issues[0]?.message || "Datos no válidos",
          issues: parsed.error.issues,
        });
      }

      const { email, password, companyName, role } = parsed.data;
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Ya existe una cuenta con este correo electrónico." });
      }

      const passwordHash = await hashPassword(password);
      const id = "usr_" + randomBytes(8).toString("hex");
      const user = await storage.createUser({
        id,
        email,
        passwordHash,
        companyName,
        role: email.toLowerCase().includes("tatiana") || email.toLowerCase().includes("admin") ? "consultant" : role,
        createdAt: new Date().toISOString(),
      });

      req.session.userId = user.id;
      return res.status(201).json({ user: sanitizeUser(user) });
    } catch (err: any) {
      console.error("Error en registro:", err);
      return res.status(500).json({ message: "Error al registrar la cuenta." });
    }
  });

  // Inicio de sesión
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: parsed.error.issues[0]?.message || "Credenciales incompletas",
        });
      }

      const { email, password } = parsed.data;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Correo o contraseña incorrectos." });
      }

      const valid = await comparePasswords(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Correo o contraseña incorrectos." });
      }

      req.session.userId = user.id;
      return res.json({ user: sanitizeUser(user) });
    } catch (err: any) {
      console.error("Error en inicio de sesión:", err);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
  });

  // Cierre de sesión
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "No se pudo cerrar la sesión." });
      }
      res.clearCookie("connect.sid");
      return res.json({ ok: true });
    });
  });

  // Usuario actual autenticado
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Sesión inválida" });
    }
    return res.json({ user: sanitizeUser(user) });
  });

  // Listado de empresas para rol consultora
  app.get("/api/companies", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Requiere autenticación" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "consultant") {
        return res.status(403).json({ message: "Acceso exclusivo para consultores" });
      }
      const list = await storage.listCompanies();
      return res.json(list);
    } catch (err: any) {
      console.error("Error al listar empresas:", err);
      return res.status(500).json({ message: "Error al obtener empresas." });
    }
  });
}
