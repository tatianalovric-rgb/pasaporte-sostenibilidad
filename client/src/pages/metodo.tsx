import { ANTI_PATTERNS, DESIGN_PATTERNS, HIGH_IMPACT_NACE, LEVELS, TECH_REQUIREMENTS } from "@/lib/vsme";
import { PREREQS } from "@/lib/engine";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export default function Metodo() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-12">
      <section className="max-w-3xl space-y-3">
        <h1 className="font-display text-2xl font-extrabold">{t("methodTitle")}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {t("methodSubtitle")}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Hitos de transición</h2>
        <div className="overflow-x-auto rounded-lg border border-card-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Transición</TableHead>
                <TableHead>Condición cuantitativa</TableHead>
                <TableHead>Condición cualitativa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LEVELS.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="whitespace-nowrap font-mono text-xs">
                    {PREREQS[l.id].length ? `${PREREQS[l.id].join(",")} → ${l.id}` : `Inicio → 0`}
                  </TableCell>
                  <TableCell className="text-sm">
                    {l.disclosures.map((d) => d.code).join(" · ")} sin campos pendientes
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.gate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">
          El Nivel 2 se habilita en paralelo al Nivel 1: depende de nómina y RRHH, no de facturas de energía, así que
          bloquearlo solo retrasaría el trabajo sin mejorar la calidad del dato.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Requerimientos técnicos por nivel</h2>
        <div className="overflow-x-auto rounded-lg border border-card-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Nivel</TableHead>
                <TableHead className="min-w-56">Modelo de datos</TableHead>
                <TableHead className="min-w-56">Cálculo</TableHead>
                <TableHead className="min-w-44">Integraciones</TableHead>
                <TableHead className="min-w-44">Evidencia y auditoría</TableHead>
                <TableHead className="min-w-40">Exportación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TECH_REQUIREMENTS.map((r) => (
                <TableRow key={r.level}>
                  <TableCell className="font-mono text-xs">N{r.level}</TableCell>
                  <TableCell className="text-sm">{r.model}</TableCell>
                  <TableCell className="text-sm">{r.calc}</TableCell>
                  <TableCell className="text-sm">{r.integrations}</TableCell>
                  <TableCell className="text-sm">{r.audit}</TableCell>
                  <TableCell className="text-sm">{r.export}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Versionado normativo", "Cada respuesta se ancla al código de divulgación y a la versión del estándar, para absorber revisiones de EFRAG sin migración manual."],
            ["Multiperiodo", "Todo dato lleva período de reporte; la comparabilidad interanual es obligatoria desde el Nivel 1."],
            ["Trazabilidad", "Ningún valor cuantitativo se publica sin origen: medición, factura, estimación documentada o cálculo derivado."],
            ["Multilingüe", "Español e inglés con terminología normativa espejada, dado el destinatario financiero europeo."],
            ["Privacidad", "Datos de plantilla bajo minimización y agregación, con base legal documentada."],
            ["Clasificación sectorial", `Detección automática de alto impacto climático: ${HIGH_IMPACT_NACE}.`],
          ].map(([t, b]) => (
            <div key={t} className="rounded-lg border border-card-border bg-card p-4">
              <p className="text-sm font-semibold">{t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recolección progresiva: patrones de diseño</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DESIGN_PATTERNS.map((p, i) => (
            <div key={p.title} className="rounded-lg border border-card-border bg-card p-4">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Anti-patrones que provocan sobrecarga</h2>
        <div className="overflow-x-auto rounded-lg border border-card-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anti-patrón</TableHead>
                <TableHead>Consecuencia</TableHead>
                <TableHead>Alternativa aplicada en la app</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ANTI_PATTERNS.map((row) => (
                <TableRow key={row[0]}>
                  <TableCell className="text-sm">{row[0]}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row[1]}</TableCell>
                  <TableCell className="text-sm">{row[2]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Guía de usuario por nivel</h2>
        <div className="space-y-3">
          {LEVELS.map((l) => (
            <div key={l.id} className="rounded-lg border border-card-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono text-[0.7rem]">
                  N{l.id}
                </Badge>
                <h3 className="font-display text-base font-bold">{l.tagline}</h3>
                <span className="text-xs text-muted-foreground">
                  {l.minutes < 60 ? `${l.minutes} min` : `≈ ${Math.round(l.minutes / 60)} h`} · {l.who}
                </span>
              </div>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Qué obtienes</dt>
                  <dd className="mt-1 text-sm">{l.obtains}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Qué necesitas</dt>
                  <dd className="mt-1 text-sm">{l.needs}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Error frecuente</dt>
                  <dd className="mt-1 text-sm">{l.mistake}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
