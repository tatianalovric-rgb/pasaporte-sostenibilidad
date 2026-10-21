import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleSlash,
  Clock,
  HelpCircle,
  Info,
  Landmark,
  Lightbulb,
  Lock,
  Paperclip,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { levelById, type Disclosure, type Field } from "@/lib/vsme";
import {
  activeFields,
  disclosureProgress,
  gateAnswer,
  isUnlocked,
  levelProgress,
  lockReason,
  num,
  parseNace,
  resolveUnit,
  targetBlocked,
  type EntryMap,
} from "@/lib/engine";
import { useEntries, type EntryPatch } from "@/hooks/use-entries";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Reutilización en cascada: datos que un nivel posterior hereda de uno anterior. */
const INHERITED: Record<string, { label: string; compute: (m: EntryMap) => string | null }> = {
  "C3.valor_base": {
    label: "Alcance 1 + Alcance 2 (location-based) del Nivel 1",
    compute: (m) => {
      const a = num(m, "B3.alcance1");
      const b = num(m, "B3.alcance2_location");
      if (a === null && b === null) return null;
      return String((a ?? 0) + (b ?? 0));
    },
  },
  "C8.carbon": { label: "Facturación declarada en B1 como techo de control", compute: (m) => (num(m, "B1.facturacion") !== null ? null : null) },
};

function FieldRow({
  field,
  map,
  onSave,
}: {
  field: Field;
  map: EntryMap;
  onSave: (patch: EntryPatch) => void;
}) {
  const entry = map[field.key];
  const [value, setValue] = useState(entry?.value ?? "");
  const [evidence, setEvidence] = useState(entry?.evidence ?? "");
  const [note, setNote] = useState(entry?.note ?? "");
  const status = (entry?.status ?? "pending") as "done" | "pending" | "na";

  useEffect(() => {
    setValue(entry?.value ?? "");
    setEvidence(entry?.evidence ?? "");
    setNote(entry?.note ?? "");
  }, [entry?.key, entry?.value, entry?.evidence, entry?.note]);

  const inherited = INHERITED[field.key];
  const inheritedValue = inherited ? inherited.compute(map) : null;
  const needsEvidence = field.evidence && status === "done" && evidence.trim() === "";

  const commit = (next: Partial<EntryPatch>) =>
    onSave({ key: field.key, value, evidence, note, status, ...next });

  return (
    <div
      className={cn(
        "rounded-md border p-4 transition-colors",
        status === "done" && !needsEvidence
          ? "border-primary/35 bg-primary/[0.04]"
          : status === "na"
            ? "border-border bg-muted/40"
            : "border-card-border bg-card"
      )}
      data-testid={`field-${field.key}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-1.5">
          <label className="text-sm font-medium leading-snug" htmlFor={field.key}>
            {field.label}
            {field.unit && <span className="ml-1.5 font-mono text-xs text-muted-foreground">({resolveUnit(field.unit, map)})</span>}
          </label>
          {field.hint && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label="Definición" className="mt-0.5 text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs leading-relaxed">{field.hint}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex gap-1">
          {(
            [
              ["done", "Valor", Check],
              ["na", "No aplica", CircleSlash],
              ["pending", "Pendiente", Clock],
            ] as const
          ).map(([st, label, Icon]) => (
            <Button
              key={st}
              size="sm"
              variant={status === st ? "secondary" : "ghost"}
              className="h-7 px-2 text-xs"
              onClick={() => commit({ status: st })}
              data-testid={`button-status-${st}-${field.key}`}
            >
              <Icon className="mr-1 h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {status !== "na" && (
        <div className="mt-3 space-y-2">
          {field.type === "textarea" ? (
            <Textarea
              id={field.key}
              value={value}
              rows={3}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => commit({ status: value.trim() ? "done" : status })}
              data-testid={`input-${field.key}`}
            />
          ) : field.type === "select" ? (
            <Select
              value={value || undefined}
              onValueChange={(v) => {
                setValue(v);
                onSave({ key: field.key, value: v, evidence, note, status: "done" });
              }}
            >
              <SelectTrigger data-testid={`input-${field.key}`}>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                {(field.options ?? []).map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.key}
              type={field.type === "number" ? "number" : "text"}
              inputMode={field.type === "number" ? "decimal" : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => commit({ status: value.trim() ? "done" : status })}
              data-testid={`input-${field.key}`}
            />
          )}

          {inheritedValue && (
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              onClick={() => {
                setValue(inheritedValue);
                onSave({ key: field.key, value: inheritedValue, evidence, note, status: "done" });
              }}
              data-testid={`button-inherit-${field.key}`}
            >
              <Sparkles className="h-3 w-3" />
              Usar dato heredado: {inheritedValue} · {inherited!.label}
            </button>
          )}

          {field.key === "B1.nace" && <NaceFeedback value={value} />}

          {field.evidence && (
            <div className="flex items-center gap-2">
              <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <Input
                value={evidence}
                placeholder="Evidencia: factura, medición o método de estimación"
                className={cn("h-8 text-xs", needsEvidence && "border-chart-4")}
                onChange={(e) => setEvidence(e.target.value)}
                onBlur={() => commit({})}
                data-testid={`input-evidence-${field.key}`}
              />
            </div>
          )}
          {needsEvidence && (
            <p className="text-xs text-chart-4">
              Este dato exige trazabilidad. Sin evidencia no cuenta para la puerta de salida del nivel.
            </p>
          )}
        </div>
      )}

      {status === "na" && (
        <div className="mt-3">
          <Input
            value={note}
            placeholder="Motivo de la no aplicabilidad (queda en el registro de omisiones de B1)"
            className="h-8 text-xs"
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => commit({})}
            data-testid={`input-note-${field.key}`}
          />
        </div>
      )}
    </div>
  );
}

function NaceFeedback({ value }: { value: string }) {
  const codes = parseNace(value);
  if (!codes.length) return null;
  const alto = codes.some((c) => c.highImpact === true);
  return (
    <div
      className={cn(
        "rounded-md border p-3 text-xs leading-relaxed",
        alto ? "border-chart-3/40 bg-chart-3/10" : "border-border bg-muted/40"
      )}
      data-testid="nace-feedback"
      aria-live="polite"
    >
      <p className="mb-1.5 font-medium text-foreground">
        {codes.length === 1 ? "1 código detectado" : `${codes.length} códigos detectados`}
      </p>
      <ul className="space-y-1">
        {codes.map((c, i) => (
          <li key={i} className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="font-mono font-medium text-foreground">{c.raw}</span>
            <span className="text-muted-foreground">
              {c.section ? `Sección ${c.section} · ${c.sectionName}` : "Código no reconocido: revisa el formato (ej. 38.22)"}
            </span>
            {c.highImpact === true && <span className="font-medium text-foreground">· alto impacto climático</span>}
          </li>
        ))}
      </ul>
      {alto && (
        <p className="mt-2 font-medium text-foreground">
          Sector de alto impacto climático detectado. En el Nivel 4 se te pedirá un plan de transición (C3).
        </p>
      )}
    </div>
  );
}

function DisclosureBlock({
  disclosure,
  map,
  onSave,
}: {
  disclosure: Disclosure;
  map: EntryMap;
  onSave: (patch: EntryPatch) => void;
}) {
  const answer = gateAnswer(disclosure, map);
  const fields = activeFields(disclosure, map);
  const p = disclosureProgress(disclosure, map);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-xs font-semibold text-background">
            {disclosure.code}
          </span>
          <h3 className="font-display text-base font-bold">{disclosure.title}</h3>
          <Badge variant="outline" className="text-[0.7rem]">
            Módulo {disclosure.module}
          </Badge>
        </div>
        {disclosure.sfdr && (
          <p className="flex items-start gap-1.5 rounded-md bg-accent/60 p-2.5 text-xs leading-relaxed text-accent-foreground">
            <Landmark className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <span className="font-medium">Solicitado por bancos (SFDR):</span> {disclosure.sfdr}
            </span>
          </p>
        )}
        <div className="flex items-center gap-3">
          <Progress value={p.pct} className="h-1" />
          <span className="shrink-0 text-xs text-muted-foreground">
            {p.resolved}/{p.total}
          </span>
        </div>
      </div>

      {disclosure.gate && (
        <div className="rounded-md border border-dashed border-border bg-muted/40 p-4">
          <p className="mb-2 flex items-start gap-1.5 text-sm font-medium">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            {disclosure.gate.label}
          </p>
          <div className="flex gap-2">
            {["Sí", "No"].map((opt) => (
              <Button
                key={opt}
                size="sm"
                variant={map[disclosure.gate!.key]?.value === opt ? "default" : "outline"}
                onClick={() => onSave({ key: disclosure.gate!.key, value: opt, status: "done" })}
                data-testid={`button-gate-${disclosure.gate!.key}-${opt}`}
              >
                {opt}
              </Button>
            ))}
          </div>
          {answer === "no" && (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Bloque cerrado. {disclosure.code} se resuelve con esta declaración negativa y queda registrado — no se te
              pedirán {disclosure.fields.length} campos que no te aplican.
            </p>
          )}
          {answer === "unset" && (
            <p className="mt-3 text-xs text-muted-foreground">
              Responde para saber si este bloque te aplica. Una sola pregunta puede ahorrarte {disclosure.fields.length} campos.
            </p>
          )}
        </div>
      )}

      <AnimatePresence initial={false}>
        {fields.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3 overflow-hidden"
          >
            {fields.map((f) => (
              <FieldRow key={f.key} field={f} map={map} onSave={onSave} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Nivel() {
  const params = useParams<{ id: string }>();
  const levelId = Number(params.id);
  const level = levelById(levelId);
  const { map, save } = useEntries();
  const { t, lang } = useI18n();
  const [step, setStep] = useState(0);

  useEffect(() => setStep(0), [levelId]);

  const onSave = (patch: EntryPatch) => save.mutate([patch]);
  const unlocked = level ? isUnlocked(level.id, map) : false;
  const p = useMemo(() => (level ? levelProgress(level, map) : null), [level, map]);

  if (!level) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">{lang === "es" ? "Ese nivel no existe." : "This level does not exist."}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">{t("btnBackRoadmap")}</Link>
        </Button>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-lg rounded-lg border border-card-border bg-card p-8 text-center">
        <Lock className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
        <h1 className="font-display text-lg font-bold">
          {lang === "es" ? `Nivel ${level.id} bloqueado` : `Level ${level.id} locked`}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "es"
            ? `Primero cierra ${lockReason(level.id, map)}. Fijar objetivos o responder a un banco sobre datos sin cerrar es la forma más rápida de perder credibilidad.`
            : `First complete ${lockReason(level.id, map)}. Setting targets or responding to banks with unverified data reduces credibility.`}
        </p>
        <Button asChild className="mt-5">
          <Link href="/">{t("btnBackRoadmap")}</Link>
        </Button>
      </div>
    );
  }

  const current = level.disclosures[step];
  const blocked = level.id === 4 && targetBlocked(map);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("navRoadmap")}
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {lang === "es" ? `Nivel ${level.id} · ${level.option}` : `Level ${level.id} · ${level.option}`}
            </p>
            <h1 className="font-display text-xl font-extrabold">{level.name}</h1>
            <p className="text-sm text-muted-foreground">{level.tagline}</p>
          </div>
          <div className="w-full sm:w-52">
            <Progress value={p!.pct} className="h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {p!.resolved}/{p!.total} {lang === "es" ? "campos resueltos" : "fields completed"} · {p!.pct}%
            </p>
          </div>
        </div>
      </div>

      {/* Guía del nivel */}
      <div className="grid gap-4 rounded-lg border border-card-border bg-card p-5 sm:grid-cols-2">
        {[
          ["Qué obtienes", level.obtains],
          ["Qué necesitas a mano", level.needs],
          ["Tiempo estimado", level.minutes < 60 ? `${level.minutes} minutos` : `≈ ${Math.round(level.minutes / 60)} horas, repartidas en varias sesiones`],
          ["Quién lo hace", level.who],
        ].map(([k, v]) => (
          <div key={k as string}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{k}</p>
            <p className="mt-1 text-sm leading-relaxed">{v}</p>
          </div>
        ))}
        <div className="sm:col-span-2 rounded-md bg-chart-4/10 p-3">
          <p className="flex items-start gap-1.5 text-sm leading-relaxed">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
            <span>
              <span className="font-medium">Consejo para evitar un error común:</span> {level.mistake}
            </span>
          </p>
        </div>
        <div className="sm:col-span-2 text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Puerta de salida:</span> {level.gate}
        </div>
      </div>

      {/* Qué falta para cerrar el nivel */}
      {p && (p.missing.length > 0 || p.missingEvidence.length > 0) ? (
        <div className="rounded-lg border border-chart-4/40 bg-chart-4/5 p-4" data-testid="level-missing">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Info className="h-4 w-4 shrink-0 text-chart-4" />
            Qué falta para cerrar este nivel
          </p>
          {p.missing.length > 0 && (
            <div className="mt-2.5">
              <p className="text-xs font-medium text-foreground">
                Sin responder ({p.missing.length}): escribe el dato, o marca No aplica con el motivo.
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-muted-foreground">
                {p.missing.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {p.missingEvidence.length > 0 && (
            <div className="mt-2.5">
              <p className="text-xs font-medium text-foreground">
                Falta la evidencia ({p.missingEvidence.length}): escribe en el espacio del clip qué documento respalda el dato.
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-muted-foreground">
                {p.missingEvidence.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : p && p.total > 0 ? (
        <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/[0.05] p-4 text-sm" data-testid="level-complete">
          <Check className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-medium">Nivel cerrado. Todos los datos están respondidos y con su evidencia.</span>
        </div>
      ) : null}

      {blocked && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <span>
            Has declarado que tienes objetivos de reducción, pero tu inventario del Nivel 1 no está cerrado. La app no
            valida objetivos sobre un año base sin verificar:{" "}
            <Link href="/nivel/1" className="underline">
              vuelve al Nivel 1
            </Link>{" "}
            antes de publicar C3.
          </span>
        </div>
      )}

      {/* Sesión corta: un bloque por vez */}
      <div className="flex flex-wrap gap-1.5">
        {level.disclosures.map((d, i) => {
          const dp = disclosureProgress(d, map);
          return (
            <button
              key={d.code}
              onClick={() => setStep(i)}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
                i === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : dp.pct === 100
                    ? "border-primary/40 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
              )}
              data-testid={`button-step-${d.code}`}
            >
              {dp.pct === 100 && <Check className="h-3 w-3" />}
              {d.code}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.code}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg border border-card-border bg-background p-5"
        >
          <DisclosureBlock disclosure={current} map={map} onSave={onSave} />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          data-testid="button-prev-block"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          {lang === "es" ? "Bloque anterior" : "Previous block"}
        </Button>
        <span className="text-xs text-muted-foreground font-mono">
          {lang === "es"
            ? `Bloque ${step + 1} de ${level.disclosures.length} · guardado automático`
            : `Block ${step + 1} of ${level.disclosures.length} · auto-saved`}
        </span>
        {step < level.disclosures.length - 1 ? (
          <Button size="sm" onClick={() => setStep((s) => s + 1)} data-testid="button-next-block">
            {t("btnNextBlock")}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button asChild size="sm" data-testid="button-go-report">
            <Link href={level.id >= 3 ? "/informe" : `/nivel/${level.id + 1}`}>
              {level.id >= 3
                ? (lang === "es" ? "Ver expediente" : "View dossier")
                : (lang === "es" ? `Ir al Nivel ${level.id + 1}` : `Go to Level ${level.id + 1}`)}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
