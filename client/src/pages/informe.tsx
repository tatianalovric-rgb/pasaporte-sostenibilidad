import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Braces, Check, Copy, Download, FileText, FileType2, Landmark, Loader2, TriangleAlert } from "lucide-react";
import { buildReport, downloadBlob, slug, toDocxBlob, toJsonBlob } from "@/lib/exporters";
import { LEVELS, SFDR_MAP } from "@/lib/vsme";
import { activeFields, currencyCode, gateAnswer, globalProgress, isComplete, resolveUnit } from "@/lib/engine";
import { useEntries } from "@/hooks/use-entries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Informe() {
  const { map } = useEntries();
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const basicoCerrado = [0, 1, 2, 3].every((id) => isComplete(id, map));
  const completoCerrado = basicoCerrado && [4, 5].every((id) => isComplete(id, map));
  const g = globalProgress(map);
  const empresa = map["B1.nombre"]?.value || user?.companyName || (lang === "es" ? "Empresa sin denominar" : "Unnamed Company");
  const opcion = map["B1.opcion"]?.value || (lang === "es" ? "Opción no seleccionada" : "Option not selected");

  const omisiones = useMemo(
    () =>
      LEVELS.flatMap((l) =>
        l.disclosures.flatMap((d) =>
          d.fields
            .filter((f) => map[f.key]?.status === "na")
            .map((f) => ({ code: d.code, label: f.label, motivo: map[f.key]?.note || "Sin motivo registrado" }))
        )
      ),
    [map]
  );

  const markdown = useMemo(() => {
    const lines: string[] = [];
    lines.push(`# Informe de sostenibilidad VSME — ${empresa}`);
    lines.push("");
    lines.push(`Opción de reporte: ${opcion}`);
    lines.push(`Cobertura: ${g.resolved} de ${g.total} datapoints (${g.pct} %)`);
    lines.push(`Moneda de reporte: ${currencyCode(map) ?? "sin elegir"}`);
    lines.push("");
    for (const l of LEVELS) {
      lines.push(`## Nivel ${l.id} — ${l.name}`);
      for (const d of l.disclosures) {
        lines.push("");
        lines.push(`### ${d.code} — ${d.title}`);
        if (d.gate) {
          lines.push(`- ${d.gate.label} **${map[d.gate.key]?.value || "sin responder"}**`);
        }
        if (d.gate && gateAnswer(d, map) === "no") {
          lines.push(`- Bloque no aplicable: declaración negativa registrada.`);
          continue;
        }
        for (const f of activeFields(d, map)) {
          const e = map[f.key];
          const val =
            e?.status === "na"
              ? `No aplica — ${e.note || "sin motivo"}`
              : e?.value?.trim()
                ? `${e.value}${f.unit && f.type === "number" ? ` ${resolveUnit(f.unit, map)}` : ""}`
                : "pendiente";
          lines.push(`- ${f.label}: ${val}${e?.evidence ? ` _(evidencia: ${e.evidence})_` : ""}`);
        }
      }
      lines.push("");
    }
    lines.push("## Correspondencia con indicadores SFDR (Apéndice C del VSME)");
    for (const s of SFDR_MAP) lines.push(`- ${s.code}: ${s.indicator}`);
    lines.push("");
    lines.push(
      "Fuente normativa: EFRAG, VSME Standard — https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf"
    );
    return lines.join("\n");
  }, [map, empresa, opcion, g]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast({
        title: t("copyToastSuccess"),
        description: lang === "es" ? "Pégalo en Word, Markdown o tu gestor documental." : "Paste it into Word, Markdown or your document manager.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: lang === "es" ? "No se pudo copiar" : "Could not copy",
        description: lang === "es" ? "Selecciona el texto manualmente." : "Select the text manually.",
      });
    }
  };

  const fileBase = `pasaporte-sostenibilidad-${slug(empresa)}`;

  const download = () => {
    try {
      downloadBlob(new Blob([markdown], { type: "text/markdown;charset=utf-8" }), `${fileBase}.md`);
    } catch {
      toast({
        title: lang === "es" ? "Descarga no disponible aquí" : "Download not available",
        description: lang === "es" ? "Usa el botón de copiar." : "Use copy button.",
      });
    }
  };

  const downloadWord = async () => {
    setBusy(true);
    try {
      const blob = await toDocxBlob(buildReport(map));
      downloadBlob(blob, `${fileBase}.docx`);
      toast({
        title: t("wordToastSuccess"),
        description: t("wordToastSuccessDesc"),
      });
    } catch {
      toast({
        title: lang === "es" ? "No se pudo generar el Word" : "Could not generate Word document",
        description: lang === "es" ? "Inténtalo de nuevo o usa la descarga en Markdown." : "Try again or use Markdown download.",
      });
    } finally {
      setBusy(false);
    }
  };

  const downloadJson = () => {
    try {
      downloadBlob(toJsonBlob(buildReport(map)), `${fileBase}.json`);
      toast({
        title: lang === "es" ? "Datos estructurados descargados" : "Structured data downloaded",
        description: t("jsonToastDesc"),
      });
    } catch {
      toast({
        title: lang === "es" ? "Descarga no disponible aquí" : "Download not available",
        description: lang === "es" ? "Usa el botón de copiar." : "Use copy button.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="font-display text-2xl font-extrabold">{t("reportTitle")}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("reportSubtitle")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant={basicoCerrado ? "default" : "outline"} className="gap-1">
            {basicoCerrado && <Check className="h-3 w-3" />}
            {t("badgeOptionA")}
          </Badge>
          <Badge variant={completoCerrado ? "default" : "outline"} className="gap-1">
            {completoCerrado && <Check className="h-3 w-3" />}
            {t("badgeOptionB")}
          </Badge>
          <Badge variant="secondary">{t("badgeCoverage", { pct: g.pct })}</Badge>
        </div>
      </div>

      {!basicoCerrado && (
        <div className="flex items-start gap-2 rounded-lg border border-chart-4/40 bg-chart-4/5 p-4 text-sm">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
          <span>
            {t("draftWarning")}{" "}
            <Link href="/" className="underline font-medium">
              {t("btnBackRoadmap")}
            </Link>
            .
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5">
        <Button onClick={downloadWord} disabled={busy} className="font-medium shadow-xs" data-testid="button-download-word">
          {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <FileType2 className="mr-1.5 h-3.5 w-3.5" />}
          {t("btnDownloadWord")}
        </Button>
        <Button variant="outline" onClick={downloadJson} className="font-medium" data-testid="button-download-json">
          <Braces className="mr-1.5 h-3.5 w-3.5 text-primary" />
          {t("btnDownloadJson")}
        </Button>
        <Button variant="outline" onClick={copy} data-testid="button-copy-report">
          {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-primary" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
          {t("btnCopyText")}
        </Button>
        <Button variant="ghost" onClick={download} data-testid="button-download-report">
          <Download className="mr-1.5 h-3.5 w-3.5" />
          {t("btnDownloadMd")}
        </Button>
      </div>

      {omisiones.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Registro de omisiones</h2>
          <p className="text-sm text-muted-foreground">
            El estándar permite omitir información clasificada o sensible, pero la omisión debe indicarse en B1. Este
            registro alimenta ese campo automáticamente.
          </p>
          <div className="overflow-hidden rounded-lg border border-card-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Código</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Motivo registrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {omisiones.map((o, i) => (
                  <TableRow key={`${o.code}-${i}`}>
                    <TableCell className="font-mono text-xs">{o.code}</TableCell>
                    <TableCell className="text-sm">{o.label}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{o.motivo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Landmark className="h-4 w-4" />
          Puente con finanzas sostenibles
        </h2>
        <p className="text-sm text-muted-foreground">
          Correspondencias declaradas en el Apéndice C del VSME, que satisface solicitudes de bancos, inversores y
          grandes empresas.
        </p>
        <div className="overflow-hidden rounded-lg border border-card-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Divulgación</TableHead>
                <TableHead>Indicador SFDR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SFDR_MAP.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{s.code}</TableCell>
                  <TableCell className="text-sm">{s.indicator}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-4 w-4" />
          Vista previa
        </h2>
        <pre className="max-h-[32rem] overflow-auto rounded-lg border border-card-border bg-card p-5 font-mono text-xs leading-relaxed">
          {markdown}
        </pre>
      </section>
    </div>
  );
}
