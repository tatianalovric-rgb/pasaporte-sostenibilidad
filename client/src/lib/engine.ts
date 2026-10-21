import { LEVELS, type Disclosure, type Level } from "./vsme";
import type { Entry } from "@shared/schema";

export type EntryMap = Record<string, Entry>;

export function toMap(entries: Entry[] | undefined): EntryMap {
  const map: EntryMap = {};
  for (const e of entries ?? []) map[e.key] = e;
  return map;
}

export function gateAnswer(d: Disclosure, map: EntryMap): "si" | "no" | "unset" {
  if (!d.gate) return "si";
  const v = map[d.gate.key]?.value;
  if (v === "Sí") return "si";
  if (v === "No") return "no";
  return "unset";
}

/** Campos que la app debe pedir de verdad, tras aplicar la pregunta filtro y las dependencias. */
export function activeFields(d: Disclosure, map: EntryMap) {
  const base = !d.gate || gateAnswer(d, map) === "si" ? d.fields : [];
  return base.filter((f) =>
    f.dependsOn ? f.dependsOn.equals.includes(map[f.dependsOn.key]?.value ?? "") : true
  );
}

export interface Progress {
  total: number;
  resolved: number;
  pct: number;
  missing: string[];
  missingEvidence: string[];
}

export function disclosureProgress(d: Disclosure, map: EntryMap): Progress {
  const missing: string[] = [];
  const missingEvidence: string[] = [];
  let total = 0;
  let resolved = 0;

  if (d.gate) {
    total += 1;
    if (gateAnswer(d, map) !== "unset") resolved += 1;
    else missing.push(d.gate.label);
  }

  for (const f of activeFields(d, map)) {
    total += 1;
    const e = map[f.key];
    const ok = e && (e.status === "na" || (e.status === "done" && e.value.trim() !== ""));
    if (ok) {
      resolved += 1;
      if (f.evidence && e.status === "done" && e.evidence.trim() === "") {
        missingEvidence.push(f.label);
      }
    } else {
      missing.push(f.label);
    }
  }

  return { total, resolved, pct: total ? Math.round((resolved / total) * 100) : 100, missing, missingEvidence };
}

export function levelProgress(level: Level, map: EntryMap): Progress {
  const acc: Progress = { total: 0, resolved: 0, pct: 0, missing: [], missingEvidence: [] };
  for (const d of level.disclosures) {
    const p = disclosureProgress(d, map);
    acc.total += p.total;
    acc.resolved += p.resolved;
    acc.missing.push(...p.missing);
    acc.missingEvidence.push(...p.missingEvidence);
  }
  acc.pct = acc.total ? Math.round((acc.resolved / acc.total) * 100) : 0;
  return acc;
}

export function isComplete(levelId: number, map: EntryMap) {
  const l = LEVELS.find((x) => x.id === levelId)!;
  const p = levelProgress(l, map);
  return p.total > 0 && p.resolved === p.total && p.missingEvidence.length === 0;
}

/** Dependencias entre niveles: el Nivel 2 corre en paralelo al 1 porque depende de otra área funcional. */
export const PREREQS: Record<number, number[]> = {
  0: [],
  1: [0],
  2: [0],
  3: [1, 2],
  4: [3],
  5: [4],
};

export function isUnlocked(levelId: number, map: EntryMap) {
  return PREREQS[levelId].every((p) => isComplete(p, map));
}

export function lockReason(levelId: number, map: EntryMap) {
  const pending = PREREQS[levelId].filter((p) => !isComplete(p, map));
  if (!pending.length) return null;
  return pending.map((p) => `Nivel ${p} · ${LEVELS.find((l) => l.id === p)!.name}`).join(" y ");
}

export function globalProgress(map: EntryMap) {
  let total = 0;
  let resolved = 0;
  for (const l of LEVELS) {
    const p = levelProgress(l, map);
    total += p.total;
    resolved += p.resolved;
  }
  return { total, resolved, pct: total ? Math.round((resolved / total) * 100) : 0 };
}

/** Coherencia objetivo-inventario: no se permite fijar un objetivo sin año base verificado. */
export function targetBlocked(map: EntryMap) {
  const inventoryClosed = isComplete(1, map);
  const wantsTarget = map["C3.tiene_objetivo"]?.value === "Sí";
  return wantsTarget && !inventoryClosed;
}

export function num(map: EntryMap, key: string): number | null {
  const v = map[key]?.value;
  if (!v || v.trim() === "") return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** Sección NACE (letra) a partir de la división (2 primeras cifras). Anexo I, Reg. (CE) 1893/2006. */
const NACE_SECTIONS: [number, number, string, string][] = [
  [1, 3, "A", "Agricultura, ganadería, silvicultura y pesca"],
  [5, 9, "B", "Industrias extractivas"],
  [10, 33, "C", "Industria manufacturera"],
  [35, 35, "D", "Suministro de energía eléctrica, gas, vapor y aire acondicionado"],
  [36, 39, "E", "Suministro de agua, saneamiento, gestión de residuos y descontaminación"],
  [41, 43, "F", "Construcción"],
  [45, 47, "G", "Comercio al por mayor y al por menor"],
  [49, 53, "H", "Transporte y almacenamiento"],
  [55, 56, "I", "Hostelería"],
  [58, 63, "J", "Información y comunicaciones"],
  [64, 66, "K", "Actividades financieras y de seguros"],
  [68, 68, "L", "Actividades inmobiliarias"],
  [69, 75, "M", "Actividades profesionales, científicas y técnicas"],
  [77, 82, "N", "Actividades administrativas y servicios auxiliares"],
  [84, 84, "O", "Administración pública y defensa"],
  [85, 85, "P", "Educación"],
  [86, 88, "Q", "Actividades sanitarias y de servicios sociales"],
  [90, 93, "R", "Actividades artísticas, recreativas y de entretenimiento"],
  [94, 96, "S", "Otros servicios"],
  [97, 98, "T", "Actividades de los hogares"],
  [99, 99, "U", "Organizaciones extraterritoriales"],
];
const HIGH_IMPACT_SECTIONS = new Set(["A", "B", "C", "D", "E", "F", "G", "H", "L"]);

export interface NaceCode {
  raw: string;
  section: string | null;
  sectionName: string | null;
  highImpact: boolean | null;
}

/** Analiza TODOS los códigos NACE declarados (separados por comas, punto y coma o saltos de línea). */
export function parseNace(value: string): NaceCode[] {
  return value
    // "38,12" (coma decimal, sin espacio) se interpreta como 38.12
    .replace(/(\d{2}),(\d{1,2})(?!\d)/g, "$1.$2")
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((raw) => {
      const letter = raw.match(/^([A-Ua-u])(?![a-z])/)?.[1]?.toUpperCase();
      if (letter && !/^\d/.test(raw)) {
        const sec = NACE_SECTIONS.find((x) => x[2] === letter);
        return { raw, section: letter, sectionName: sec?.[3] ?? null, highImpact: HIGH_IMPACT_SECTIONS.has(letter) };
      }
      const div = Number(raw.match(/\d{1,2}/)?.[0] ?? NaN);
      const sec = NACE_SECTIONS.find(([a, b]) => div >= a && div <= b);
      if (!sec) return { raw, section: null, sectionName: null, highImpact: null };
      return { raw, section: sec[2], sectionName: sec[3], highImpact: HIGH_IMPACT_SECTIONS.has(sec[2]) };
    });
}

/** true si CUALQUIERA de los códigos declarados pertenece a las secciones A–H o L. */
export function sectorAltoImpacto(map: EntryMap) {
  const codes = parseNace(map["B1.nace"]?.value ?? "");
  if (!codes.length) return null;
  if (codes.some((c) => c.highImpact === true)) return true;
  if (codes.every((c) => c.highImpact === null)) return null;
  return false;
}


/** Código de la moneda de reporte elegida en B1 (ej. "USD"). */
export function currencyCode(map: EntryMap): string | null {
  const v = map["B1.moneda"]?.value ?? "";
  if (!v) return null;
  if (v === "Otra moneda") {
    const o = (map["B1.moneda_otra"]?.value ?? "").trim().toUpperCase();
    return o || null;
  }
  return v.split(" ")[0];
}

/** Sustituye {MONEDA} en la unidad por la moneda de reporte, o por un aviso si aún no se eligió. */
export function resolveUnit(unit: string | undefined, map: EntryMap): string | undefined {
  if (!unit) return unit;
  if (!unit.includes("{MONEDA}")) return unit;
  return unit.replace("{MONEDA}", currencyCode(map) ?? "moneda sin elegir");
}
