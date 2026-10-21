import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { LEVELS, SFDR_MAP } from "@/lib/vsme";
import {
  activeFields,
  currencyCode,
  gateAnswer,
  globalProgress,
  isComplete,
  resolveUnit,
  type EntryMap,
} from "@/lib/engine";

/** Modelo único del informe: alimenta Word, JSON y Markdown para que los tres digan lo mismo. */
export interface ReportField {
  key: string;
  label: string;
  unit: string | null;
  status: "done" | "na" | "pending";
  value: string | null;
  motivo: string | null;
  evidencia: string | null;
}

export interface ReportDisclosure {
  code: string;
  title: string;
  module: string;
  sfdr: string | null;
  gate: { question: string; answer: "si" | "no" | "sin responder" } | null;
  notApplicable: boolean;
  fields: ReportField[];
}

export interface ReportModel {
  schema: "escala-esg/vsme-report";
  schemaVersion: "1.0";
  standard: string;
  generatedAt: string;
  company: {
    name: string;
    reportingOption: string;
    currency: string | null;
    naceCodes: string | null;
    country: string | null;
  };
  status: {
    coveragePct: number;
    resolved: number;
    total: number;
    basicModuleComplete: boolean;
    comprehensiveModuleComplete: boolean;
  };
  levels: { id: number; name: string; complete: boolean; disclosures: ReportDisclosure[] }[];
  omissions: { code: string; field: string; motivo: string }[];
  sfdrMapping: { disclosure: string; indicator: string }[];
}

export const STANDARD_REF =
  "EFRAG — Voluntary Sustainability Reporting Standard for non-listed SMEs (VSME)";
export const STANDARD_URL =
  "https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf";

export function buildReport(map: EntryMap): ReportModel {
  const g = globalProgress(map);
  const basico = [0, 1, 2, 3].every((id) => isComplete(id, map));
  const completo = basico && [4, 5].every((id) => isComplete(id, map));
  const omissions: ReportModel["omissions"] = [];

  const levels = LEVELS.map((l) => ({
    id: l.id,
    name: l.name,
    complete: isComplete(l.id, map),
    disclosures: l.disclosures.map((d): ReportDisclosure => {
      const ga = d.gate ? gateAnswer(d, map) : null;
      const notApplicable = ga === "no";
      const fields = notApplicable
        ? []
        : activeFields(d, map).map((f): ReportField => {
            const e = map[f.key];
            const status = (e?.status ?? "pending") as ReportField["status"];
            if (status === "na") {
              omissions.push({ code: d.code, field: f.label, motivo: e?.note || "Sin motivo registrado" });
            }
            return {
              key: f.key,
              label: f.label,
              unit: f.type === "number" ? resolveUnit(f.unit, map) ?? null : null,
              status,
              value: status === "done" && e?.value?.trim() ? e.value : null,
              motivo: status === "na" ? e?.note || "Sin motivo registrado" : null,
              evidencia: e?.evidence?.trim() ? e.evidence : null,
            };
          });
      return {
        code: d.code,
        title: d.title,
        module: d.module,
        sfdr: d.sfdr ?? null,
        gate: d.gate
          ? { question: d.gate.label, answer: ga === "si" ? "si" : ga === "no" ? "no" : "sin responder" }
          : null,
        notApplicable,
        fields,
      };
    }),
  }));

  return {
    schema: "escala-esg/vsme-report",
    schemaVersion: "1.0",
    standard: STANDARD_REF,
    generatedAt: new Date().toISOString(),
    company: {
      name: map["B1.nombre"]?.value || "Empresa sin denominar",
      reportingOption: map["B1.opcion"]?.value || "Opción no seleccionada",
      currency: currencyCode(map),
      naceCodes: map["B1.nace"]?.value || null,
      country: map["B1.pais"]?.value || null,
    },
    status: {
      coveragePct: g.pct,
      resolved: g.resolved,
      total: g.total,
      basicModuleComplete: basico,
      comprehensiveModuleComplete: completo,
    },
    levels,
    omissions,
    sfdrMapping: SFDR_MAP.map((s) => ({ disclosure: s.code, indicator: s.indicator })),
  };
}

/* ───────────────────────────── Descarga ───────────────────────────── */

export function slug(name: string) {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "empresa"
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ───────────────────────────── JSON ───────────────────────────── */

export function toJsonBlob(model: ReportModel) {
  return new Blob([JSON.stringify(model, null, 2)], { type: "application/json;charset=utf-8" });
}

/* ───────────────────────────── Word ───────────────────────────── */

const INK = "1F2A28";
const MUTED = "5F6B68";
const PINE = "1E4F45";
const RULE = "D6DAD8";
const FILL = "F1F3F2";

const cellBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: RULE },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE },
  left: { style: BorderStyle.SINGLE, size: 4, color: RULE },
  right: { style: BorderStyle.SINGLE, size: 4, color: RULE },
};

function cell(text: string, opts: { bold?: boolean; header?: boolean; width?: number; color?: string } = {}) {
  return new TableCell({
    borders: cellBorders,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.header ? { type: ShadingType.CLEAR, color: "auto", fill: FILL } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: opts.bold || opts.header,
            size: 18,
            color: opts.color ?? INK,
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

function table(headers: string[], rows: string[][], widths: number[]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => cell(h, { header: true, width: widths[i] })),
      }),
      ...rows.map(
        (r) =>
          new TableRow({
            children: r.map((c, i) => cell(c, { width: widths[i], color: i === 0 ? MUTED : INK })),
          })
      ),
    ],
  });
}

function p(text: string, opts: { bold?: boolean; color?: string; size?: number; after?: number; italics?: boolean } = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120 },
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        color: opts.color ?? INK,
        size: opts.size ?? 21,
        font: "Calibri",
      }),
    ],
  });
}

function fieldValue(f: ReportField) {
  if (f.status === "na") return `No aplica — ${f.motivo}`;
  if (f.value === null) return "Pendiente";
  return f.unit ? `${f.value} ${f.unit}` : f.value;
}

export async function toDocxBlob(model: ReportModel): Promise<Blob> {
  const date = new Date(model.generatedAt).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const body: (Paragraph | Table)[] = [];

  body.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: "PASAPORTE DE SOSTENIBILIDAD EMPRESARIAL · VSME (EFRAG)", bold: true, size: 18, color: PINE, font: "Calibri" })],
    }),
    new Paragraph({
      heading: HeadingLevel.TITLE,
      spacing: { after: 160 },
      children: [new TextRun({ text: model.company.name, bold: true, size: 44, color: INK, font: "Calibri" })],
    }),
    p(`Generado el ${date} · Metodología y Acompañamiento: Tatiana Lovric Consultoría.`, { color: MUTED, size: 19, after: 240 })
  );

  if (!model.status.basicModuleComplete) {
    body.push(
      p(
        "BORRADOR PARCIAL. Quedan campos sin responder o sin evidencia; este documento no debe presentarse como informe definitivo.",
        { bold: true, color: "9A4B1E", size: 19, after: 240 }
      )
    );
  }

  body.push(
    new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Ficha del informe", font: "Calibri" })] }),
    table(
      ["Concepto", "Valor"],
      [
        ["Opción de reporte", model.company.reportingOption],
        ["Moneda de reporte", model.company.currency ?? "Sin elegir"],
        ["Código(s) de actividad", model.company.naceCodes ?? "Sin declarar"],
        ["País de operaciones", model.company.country ?? "Sin declarar"],
        ["Cobertura", `${model.status.resolved} de ${model.status.total} datapoints (${model.status.coveragePct} %)`],
        ["Módulo Básico (OPCIÓN A)", model.status.basicModuleComplete ? "Completo" : "En preparación"],
        ["Módulo Completo (OPCIÓN B)", model.status.comprehensiveModuleComplete ? "Completo" : "En preparación"],
      ],
      [38, 62]
    ),
    p("", { after: 120 })
  );

  for (const l of model.levels) {
    body.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: l.id > 0,
        children: [new TextRun({ text: `Nivel ${l.id} — ${l.name}`, font: "Calibri" })],
      }),
      p(l.complete ? "Nivel cerrado." : "Nivel en preparación.", { color: MUTED, size: 19 })
    );
    for (const d of l.disclosures) {
      body.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: `${d.code} · ${d.title}`, font: "Calibri" })],
        }),
        p(`Módulo ${d.module}${d.sfdr ? ` · Indicadores SFDR: ${d.sfdr}` : ""}`, { color: MUTED, size: 18 })
      );
      if (d.gate) {
        body.push(
          p(`${d.gate.question} ${d.gate.answer === "si" ? "Sí" : d.gate.answer === "no" ? "No" : "Sin responder"}.`, {
            size: 19,
          })
        );
      }
      if (d.notApplicable) {
        body.push(p("Bloque no aplicable: declaración negativa registrada.", { color: MUTED, size: 19 }));
        continue;
      }
      if (d.fields.length) {
        body.push(
          table(
            ["Dato", "Valor declarado", "Evidencia"],
            d.fields.map((f) => [f.label, fieldValue(f), f.evidencia ?? "—"]),
            [36, 40, 24]
          )
        );
      }
    }
  }

  body.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      children: [new TextRun({ text: "Registro de omisiones", font: "Calibri" })],
    }),
    p(
      "El estándar permite omitir información clasificada o sensible, pero cada omisión debe indicarse. Se listan aquí todos los datos marcados como no aplicables, con su motivo.",
      { color: MUTED, size: 19 }
    ),
    model.omissions.length
      ? table(
          ["Código", "Dato", "Motivo"],
          model.omissions.map((o) => [o.code, o.field, o.motivo]),
          [12, 40, 48]
        )
      : p("No se registraron omisiones.", { size: 19 }),
    p("", { after: 120 }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Correspondencia con indicadores SFDR", font: "Calibri" })],
    }),
    p(
      "Correspondencias declaradas en el Apéndice C del VSME, que permiten responder a solicitudes de bancos, inversores y grandes empresas.",
      { color: MUTED, size: 19 }
    ),
    table(
      ["Divulgación", "Indicador SFDR"],
      model.sfdrMapping.map((s) => [s.disclosure, s.indicator]),
      [18, 82]
    ),
    p("", { after: 200 }),
    p(`Fuente normativa: ${model.standard}. ${STANDARD_URL}`, { color: MUTED, size: 17 }),
    p(
      "Herramienta de preparación de información. No sustituye el criterio profesional ni un aseguramiento externo.",
      { color: MUTED, size: 17 }
    )
  );

  const doc = new Document({
    creator: "Escala ESG",
    title: `Informe VSME — ${model.company.name}`,
    description: "Informe de sostenibilidad conforme al VSME de EFRAG",
    styles: {
      default: { document: { run: { font: "Calibri", size: 21, color: INK } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 30, bold: true, color: PINE, font: "Calibri" },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 23, bold: true, color: INK, font: "Calibri" },
          paragraph: { spacing: { before: 200, after: 80 } },
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } } },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: `${model.company.name} · Pasaporte de Sostenibilidad · Tatiana Lovric · pág. `, size: 16, color: MUTED, font: "Calibri" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED, font: "Calibri" }),
                ],
              }),
            ],
          }),
        },
        children: body,
      },
    ],
  });

  return Packer.toBlob(doc);
}
