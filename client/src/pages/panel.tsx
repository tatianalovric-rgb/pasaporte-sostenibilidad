import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  Check,
  Clock,
  Landmark,
  AlertTriangle,
  RotateCcw,
  Building2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LEVELS } from "@/lib/vsme";
import { globalProgress, isComplete, isUnlocked, levelProgress, lockReason, sectorAltoImpacto } from "@/lib/engine";
import { useEntries } from "@/hooks/use-entries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

function StepRail({ map }: { map: ReturnType<typeof useEntries>["map"] }) {
  return (
    <div className="flex gap-1.5" aria-label="Progreso por niveles">
      {LEVELS.map((l) => {
        const p = levelProgress(l, map);
        return (
          <div key={l.id} className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${p.pct}%` }}
              />
            </div>
            <span className="mt-1 block text-[0.7rem] text-muted-foreground font-mono">N{l.id}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Panel() {
  const { map, isLoading, reset } = useEntries();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const g = globalProgress(map);
  const alto = sectorAltoImpacto(map);
  const empresa = map["B1.nombre"]?.value || user?.companyName;
  const opcion = map["B1.opcion"]?.value;

  const next = LEVELS.find((l) => isUnlocked(l.id, map) && !isComplete(l.id, map)) ?? LEVELS[5];

  const handleReset = () => {
    if (window.confirm(t("btnResetConfirm"))) {
      reset.mutate();
    }
  };

  return (
    <div className="space-y-10">
      {/* Portada Ejecutiva / Hero Section */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[0.72rem] uppercase tracking-wider bg-primary/10 text-primary border-primary/20">
            {t("badgeStandard")}
          </Badge>
          <Badge variant="outline" className="text-[0.72rem] font-medium">
            <ShieldCheck className="h-3 w-3 mr-1 text-primary" />
            {opcion ? `${t("badgeOptionPrefix")}${opcion.split(":")[0]}` : t("badgeOptionNone")}
          </Badge>
          {alto === true && (
            <Badge className="bg-chart-3/15 text-[0.72rem] text-foreground hover:bg-chart-3/20 border-chart-3/30">
              <Sparkles className="h-3 w-3 mr-1 text-chart-3" />
              {t("badgeHighImpact")}
            </Badge>
          )}
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight text-foreground tracking-tight">
            {empresa ? t("heroTitleCompany", { empresa }) : t("heroTitleDefault")}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* 3 Pilares de Valor para Empresas Licitantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="rounded-lg border border-border/80 bg-card p-4 space-y-2 shadow-2xs hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Building2 className="h-4 w-4" />
              <h4>{t("pillarTendersTitle")}</h4>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("pillarTendersDesc")}
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-card p-4 space-y-2 shadow-2xs hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Landmark className="h-4 w-4" />
              <h4>{t("pillarBankTitle")}</h4>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("pillarBankDesc")}
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-card p-4 space-y-2 shadow-2xs hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <FileCheck2 className="h-4 w-4" />
              <h4>{t("pillarDossierTitle")}</h4>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("pillarDossierDesc")}
            </p>
          </div>
        </div>

        {/* Panel de Control y Cobertura Total */}
        <div className="rounded-xl border border-card-border bg-card p-6 shadow-xs">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-2 w-full" />
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {t("progressCoverageLabel")}
                  </p>
                  <p className="font-display text-xl font-bold mt-0.5" data-testid="text-global-progress">
                    {t("progressResolved", { resolved: g.resolved, total: g.total, pct: g.pct })}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Button asChild size="default" className="shadow-xs font-medium" data-testid="button-continue">
                    <Link href={`/nivel/${next.id}`}>
                      {t("btnContinueLevel", { id: next.id })}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    disabled={reset.isPending}
                    data-testid="button-reset"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    {t("btnReset")}
                  </Button>
                </div>
              </div>
              <StepRail map={map} />
            </>
          )}
        </div>
      </section>

      {/* Niveles / Roadmap */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-display">{t("roadmapTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("roadmapSubtitle")}</p>
        </div>

        <div className="space-y-3.5">
          {LEVELS.map((l, i) => {
            const p = levelProgress(l, map);
            const unlocked = isUnlocked(l.id, map);
            const done = isComplete(l.id, map);
            const reason = lockReason(l.id, map);

            const statusBtnText = done
              ? (lang === "es" ? "Revisar" : "Review")
              : unlocked
              ? t("levelWorkHere")
              : t("levelLocked");

            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={cn(
                    "group rounded-xl border bg-card p-5 transition-all shadow-2xs hover:shadow-xs",
                    done ? "border-primary/40 bg-primary/[0.02]" : "border-card-border",
                    !unlocked && "opacity-75 bg-muted/20"
                  )}
                  data-testid={`card-level-${l.id}`}
                >
                  <div className="flex flex-wrap items-start gap-4">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-display text-base font-bold",
                        done
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : unlocked
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="h-5 w-5" /> : unlocked ? l.id : <Lock className="h-4 w-4" />}
                    </div>

                    <div className="min-w-[16rem] flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-bold">
                          {lang === "es" ? `Nivel ${l.id} — ${l.name}` : `Level ${l.id} — ${l.name}`}
                        </h3>
                        <Badge variant="outline" className="text-[0.7rem] font-medium">
                          {l.option}
                        </Badge>
                        {l.disclosures.some((d) => d.sfdr) && (
                          <Badge variant="secondary" className="gap-1 text-[0.7rem] bg-accent/60 text-accent-foreground">
                            <Landmark className="h-3 w-3" />
                            {lang === "es" ? "Solicitado por bancos (SFDR)" : "Required by Banks (SFDR)"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground/90">{l.tagline}</p>
                      <p className="text-sm text-muted-foreground">{l.obtains}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {l.minutes < 60 ? `${l.minutes} min` : `≈ ${Math.round(l.minutes / 60)} h`}
                        </span>
                        <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[0.7rem]">
                          {l.disclosures.map((d) => d.code).join(" · ")}
                        </span>
                        <span>{t("levelWho", { who: l.who })}</span>
                      </div>
                      {!unlocked && reason && (
                        <p className="flex items-start gap-1.5 pt-1 text-xs text-chart-4 font-medium">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                          {lang === "es" ? `Se desbloquea al cerrar ${reason}.` : `Unlocks upon completing ${reason}.`}
                        </p>
                      )}
                    </div>

                    <div className="w-full space-y-2.5 sm:w-48">
                      <Progress value={p.pct} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span>{p.resolved}/{p.total} {lang === "es" ? "campos" : "fields"}</span>
                        <span>{p.pct}%</span>
                      </div>
                      {unlocked && !done && p.missingEvidence.length > 0 && (
                        <p className="text-xs font-medium text-chart-4" data-testid={`level-evidence-${l.id}`}>
                          {lang === "es"
                            ? `Falta evidencia en ${p.missingEvidence.length} campo(s)`
                            : `Evidence needed in ${p.missingEvidence.length} field(s)`}
                        </p>
                      )}
                      <Button
                        asChild
                        variant={done ? "outline" : unlocked ? "default" : "ghost"}
                        size="sm"
                        className="w-full font-medium"
                        disabled={!unlocked}
                        data-testid={`button-open-level-${l.id}`}
                      >
                        <Link href={`/nivel/${l.id}`}>{statusBtnText}</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground border border-border/40">
                    <span className="font-semibold text-foreground">
                      {lang === "es" ? "Puerta de salida:" : "Exit Gateway:"}
                    </span>{" "}
                    {l.gate}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
