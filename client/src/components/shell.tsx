import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, LayoutList, FileText, Compass, Gauge, Award, ExternalLink, ShieldCheck, UserCheck, LogOut, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n, LanguageToggle } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

/* ---------- Logo de Tatiana Lovric con fallback SVG ---------- */
export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label="Tatiana Lovric · Pasaporte de Sostenibilidad"
        role="img"
      >
        <path
          d="M3 27h5v-5H3zM9.5 27h5v-9h-5zM16 27h5V13h-5zM22.5 27h5V5h-5z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M2 30h28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <img
      src="/logo-tatiana-lovric.png"
      alt="Tatiana Lovric"
      className={cn("h-9 w-auto max-w-[125px] object-contain rounded transition-transform", className)}
      onError={() => setHasError(true)}
    />
  );
}

/* ---------- Tema ---------- */
const ThemeCtx = createContext<{ dark: boolean; toggle: () => void }>({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return <ThemeCtx.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>{children}</ThemeCtx.Provider>;
}

export function ThemeToggle() {
  const { dark, toggle } = useContext(ThemeCtx);
  const { t } = useI18n();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? t("themeToggleLight") : t("themeToggleDark")}
      data-testid="button-theme"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

/* ---------- Shell ---------- */
export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { t, lang } = useI18n();
  const { user, logout, isConsultant, companies, activeCompanyId, setActiveCompanyId } = useAuth();

  const NAV = [
    { href: "/", label: t("navRoadmap"), icon: LayoutList },
    { href: "/informe", label: t("navReport"), icon: FileText },
    { href: "/metodo", label: t("navMethod"), icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group text-primary" data-testid="link-home">
            <Logo className="h-9 w-auto shadow-2xs group-hover:opacity-90" />
            <div className="flex flex-col text-left">
              <span className="font-display text-sm font-extrabold uppercase tracking-[0.08em] text-foreground leading-tight">
                {t("brandTitle").split(" ")[0]} <span className="text-primary">{t("brandTitle").split(" ").slice(1).join(" ")}</span>
              </span>
              <span className="text-[0.62rem] tracking-wider text-muted-foreground uppercase font-medium">
                {t("brandSubtitle")}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1.5 md:flex">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? location === "/" || location.startsWith("/nivel") : location.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  data-testid={`link-nav-${href.replace("/", "") || "panel"}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Consultant: Selector de Empresas registradas */}
            {isConsultant && companies.length > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-md border border-border text-xs">
                <Building className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-[0.7rem] text-muted-foreground font-medium shrink-0">
                  {t("switchCompanyLabel")}
                </span>
                <select
                  value={activeCompanyId || ""}
                  onChange={(e) => setActiveCompanyId(e.target.value || null)}
                  className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer max-w-[150px] truncate"
                >
                  <option value="">{lang === "es" ? "Demo (EcoGestión)" : "Demo (EcoGestión)"}</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Estado de Autenticación */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link href="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs border-border/80 hover:bg-accent/80"
                    title={user.email}
                  >
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="max-w-[110px] truncate font-semibold">
                      {user.companyName}
                    </span>
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono hidden sm:inline">
                      {isConsultant ? (lang === "es" ? "Consultora" : "Consultant") : (lang === "es" ? "Empresa" : "Client")}
                    </span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  title={t("navLogout")}
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1.5 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10 transition-all"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>{t("navLogin")}</span>
                </Button>
              </Link>
            )}

            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden bg-muted/20">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? location === "/" || location.startsWith("/nivel") : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 flex-1">{children}</main>

      <footer className="border-t border-border bg-card/40 mt-auto">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-muted-foreground sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Award className="h-4 w-4 text-primary" />
              <span>{t("footerConsultant")}</span>
            </div>
            <div className="text-[0.7rem] text-muted-foreground font-mono">
              EFRAG VSME Standard · SFDR Mapping
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-2 text-[0.72rem] text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-primary" />
              {t("footerStandard")}
            </p>
            <p>
              {t("footerDisclaimer")}{" "}
              <a
                className="underline decoration-dotted underline-offset-2 hover:text-foreground inline-flex items-center gap-0.5 ml-1"
                href="https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf"
                target="_blank"
                rel="noreferrer"
              >
                EFRAG VSME Standard <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
