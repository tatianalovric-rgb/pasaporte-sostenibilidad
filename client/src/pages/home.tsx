import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Logo } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  FileText,
  Landmark,
  Scale,
  Network,
  Gauge,
  Sparkles,
  MessageCircle,
  Mail,
  Calendar,
  Building2,
  ChevronRight,
  TrendingUp,
  Quote,
  Clock,
  ExternalLink
} from "lucide-react";

export default function Home() {
  const { t, lang } = useI18n();
  const { toast } = useToast();

  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSending, setFormSending] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSending(true);
    setTimeout(() => {
      setFormSending(false);
      toast({
        title: t("homeFormSentTitle"),
        description: t("homeFormSentDesc"),
      });
      setFormName("");
      setFormCompany("");
      setFormEmail("");
      setFormMessage("");
    }, 600);
  };

  const whatsAppNumber = "34600000000"; // Configurable
  const whatsAppMessage = encodeURIComponent(
    lang === "es"
      ? "Hola Tatiana, me gustaría solicitar información sobre el Pasaporte de Sostenibilidad y consultoría ESG para mi empresa."
      : "Hello Tatiana, I would like to request information about the Sustainability Passport and ESG consulting for my company."
  );

  return (
    <div className="space-y-24 pb-16">
      {/* ============================================================ */}
      {/* 1. HERO SECTION PRINCIPAL                                    */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 text-center space-y-8">
        {/* Fondo sutil con resplandor suave */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 dark:opacity-20 pointer-events-none">
          <div className="w-[500px] h-[500px] bg-primary/20 blur-[130px] rounded-full" />
        </div>

        {/* Logotipo Oficial en Gran Formato */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-md backdrop-blur-sm transition-transform hover:scale-105 duration-300">
            <Logo className="h-16 sm:h-20 w-auto max-w-[240px]" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t("homeHeroTag")}</span>
          </div>
        </div>

        {/* Titular Principal y Subtítulo */}
        <div className="max-w-4xl mx-auto space-y-4 px-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            {t("homeHeroTitle")}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
            {t("homeHeroSubtitle")}
          </p>
        </div>

        {/* Botones de Acción Principales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/pasaporte">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 gap-2.5 text-base px-8 py-6 rounded-xl transition-all hover:translate-y-[-2px]"
            >
              <FileText className="h-5 w-5" />
              <span>{t("homeBtnStart")}</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>

          <a href="#contacto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary/40 hover:bg-primary/10 font-semibold gap-2 text-base px-7 py-6 rounded-xl"
            >
              <Calendar className="h-5 w-5 text-primary" />
              <span>{t("homeBtnConsult")}</span>
            </Button>
          </a>

          <Link href="/pasaporte">
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-muted-foreground hover:text-foreground font-medium gap-1.5 text-sm"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>{t("homeBtnDemo")}</span>
            </Button>
          </Link>
        </div>

        {/* Barra de Avales y Estándares Oficiales */}
        <div className="pt-6 border-t border-border/60 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-lg bg-card/60 border border-border/60 flex items-center gap-2.5">
              <Scale className="h-5 w-5 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground leading-tight">
                {t("homeTrustProcurement")}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-card/60 border border-border/60 flex items-center gap-2.5">
              <Landmark className="h-5 w-5 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground leading-tight">
                {t("homeTrustSfdr")}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-card/60 border border-border/60 flex items-center gap-2.5">
              <Award className="h-5 w-5 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground leading-tight">
                {t("homeTrustStandard")}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-card/60 border border-border/60 flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground leading-tight">
                {t("homeTrustCsrd")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. LOS 3 RETOS DE LAS EMPRESAS Y CÓMO LOS RESOLVEMOS         */}
      {/* ============================================================ */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider text-primary bg-primary/10">
            {lang === "es" ? "Impacto en Negocio Real" : "Real Business Impact"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t("homeWhyTitle")}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t("homeWhySubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Tarjeta 1: Licitaciones */}
          <Card className="border-border/80 shadow-md bg-card/70 backdrop-blur-sm flex flex-col hover:border-primary/50 transition-all hover:-translate-y-1">
            <CardHeader className="space-y-3 pb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Scale className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">
                {t("homeCard1Title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground flex-1">
              <p className="leading-relaxed">
                {t("homeCard1Desc")}
              </p>
              <ul className="space-y-2 pt-2 border-t border-border/60 text-xs font-medium text-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{lang === "es" ? "Puntuación técnica en pliegos" : "Technical scoring on tenders"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{lang === "es" ? "Evidencias documentales válidas" : "Valid audit-ready documentation"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tarjeta 2: Banca SFDR */}
          <Card className="border-border/80 shadow-md bg-card/70 backdrop-blur-sm flex flex-col hover:border-primary/50 transition-all hover:-translate-y-1">
            <CardHeader className="space-y-3 pb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Landmark className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">
                {t("homeCard2Title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground flex-1">
              <p className="leading-relaxed">
                {t("homeCard2Desc")}
              </p>
              <ul className="space-y-2 pt-2 border-t border-border/60 text-xs font-medium text-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{lang === "es" ? "Créditos con tipo de interés bonificado" : "Discounted green loan rates"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{lang === "es" ? "Líneas de avales y pólizas de riesgo" : "Performance bonds & risk policies"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tarjeta 3: Cadenas de Valor */}
          <Card className="border-border/80 shadow-md bg-card/70 backdrop-blur-sm flex flex-col hover:border-primary/50 transition-all hover:-translate-y-1">
            <CardHeader className="space-y-3 pb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Network className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">
                {t("homeCard3Title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground flex-1">
              <p className="leading-relaxed">
                {t("homeCard3Desc")}
              </p>
              <ul className="space-y-2 pt-2 border-t border-border/60 text-xs font-medium text-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{lang === "es" ? "Homologación ante multinacionales" : "Qualification for global buyers"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{lang === "es" ? "Cumplimiento cascada CSRD" : "CSRD cascade compliance"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SERVICIOS DE CONSULTORÍA ESTRATÉGICA                      */}
      {/* ============================================================ */}
      <section className="space-y-10" id="servicios">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider text-primary bg-primary/10">
            {lang === "es" ? "Asesoramiento Directivo" : "Executive Advisory"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t("homeServicesTitle")}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t("homeServicesSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Servicio 1 */}
          <div className="p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/60 transition-all shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("homeSrv1Title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("homeSrv1Desc")}
            </p>
            <div className="pt-2">
              <Link href="/pasaporte">
                <Button variant="ghost" className="px-0 text-primary font-semibold gap-1.5 text-xs hover:bg-transparent hover:underline">
                  {lang === "es" ? "Comenzar en la herramienta" : "Launch in the tool"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Servicio 2 */}
          <div className="p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/60 transition-all shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Gauge className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("homeSrv2Title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("homeSrv2Desc")}
            </p>
            <div className="pt-2">
              <a href="#contacto">
                <Button variant="ghost" className="px-0 text-primary font-semibold gap-1.5 text-xs hover:bg-transparent hover:underline">
                  {lang === "es" ? "Solicitar diagnóstico" : "Request assessment"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Servicio 3 */}
          <div className="p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/60 transition-all shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("homeSrv3Title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("homeSrv3Desc")}
            </p>
            <div className="pt-2">
              <a href="#contacto">
                <Button variant="ghost" className="px-0 text-primary font-semibold gap-1.5 text-xs hover:bg-transparent hover:underline">
                  {lang === "es" ? "Consultar asesoría de gobierno" : "Inquire about governance"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Servicio 4 */}
          <div className="p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/60 transition-all shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("homeSrv4Title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("homeSrv4Desc")}
            </p>
            <div className="pt-2">
              <a href="#contacto">
                <Button variant="ghost" className="px-0 text-primary font-semibold gap-1.5 text-xs hover:bg-transparent hover:underline">
                  {lang === "es" ? "Preparar próxima licitación" : "Prepare upcoming tender"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. RUTA DEL PASAPORTE EN 6 ETAPAS                            */}
      {/* ============================================================ */}
      <section className="p-8 sm:p-12 rounded-3xl bg-muted/40 border border-border/80 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider">
            {lang === "es" ? "Metodología EFRAG VSME" : "EFRAG VSME Methodology"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {t("homeStepsTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("homeStepsSubtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 0, text: t("homeStep0"), badge: "B1" },
            { id: 1, text: t("homeStep1"), badge: "B2–B7" },
            { id: 2, text: t("homeStep2"), badge: "B8–B10" },
            { id: 3, text: t("homeStep3"), badge: "B11 (Cierre Básico)" },
            { id: 4, text: t("homeStep4"), badge: "C1–C5" },
            { id: 5, text: t("homeStep5"), badge: "C6–C9 (SFDR)" },
          ].map((step) => (
            <Link key={step.id} href={`/nivel/${step.id}`}>
              <div className="p-4 rounded-xl bg-card border border-border/70 hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-primary font-mono">
                      NIVEL {step.id}
                    </span>
                    <Badge variant="secondary" className="text-[0.65rem] font-mono">
                      {step.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.text}
                  </p>
                </div>
                <div className="flex items-center text-[0.7rem] text-primary font-semibold gap-1 pt-3 group-hover:translate-x-1 transition-transform">
                  <span>{lang === "es" ? "Ver requisitos" : "View requirements"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link href="/pasaporte">
            <Button className="gap-2 font-bold px-6 py-5">
              <span>{lang === "es" ? "Abrir el Pasaporte Completo" : "Open Full Passport"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SOBRE TATIANA LOVRIC                                      */}
      {/* ============================================================ */}
      <section className="grid lg:grid-cols-12 gap-8 items-center" id="sobre-mi">
        {/* Tarjeta de Identidad y Autoridad */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 space-y-6 shadow-md text-center">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
              <Logo className="h-20 w-auto max-w-[220px]" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
              Tatiana Lovric
            </h3>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              {t("homeAboutSubtitle")}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground italic leading-relaxed text-left">
            <Quote className="h-4 w-4 text-primary mb-1 inline mr-1" />
            {t("homeAboutQuote")}
          </div>
        </div>

        {/* Biografía y Enfoque de Trabajo */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider text-primary bg-primary/10">
              {lang === "es" ? "Autoridad & Metodología" : "Authority & Methodology"}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t("homeAboutTitle")}
            </h2>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("homeAboutText1")}
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("homeAboutText2")}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
              <span className="text-primary font-bold text-lg font-mono">100%</span>
              <p className="text-xs font-semibold text-foreground">
                {lang === "es" ? "Alineado a EFRAG" : "EFRAG Aligned"}
              </p>
              <p className="text-[0.7rem] text-muted-foreground">
                {lang === "es" ? "Estándar oficial europeo" : "Official European standard"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
              <span className="text-emerald-600 font-bold text-lg font-mono">SFDR</span>
              <p className="text-xs font-semibold text-foreground">
                {lang === "es" ? "Aprobado para Banca" : "Bank Approved"}
              </p>
              <p className="text-[0.7rem] text-muted-foreground">
                {lang === "es" ? "Financiación preferente" : "Discounted financing"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-1">
              <span className="text-amber-600 font-bold text-lg font-mono">Word</span>
              <p className="text-xs font-semibold text-foreground">
                {lang === "es" ? "Expediente Emitible" : "Issuable Dossier"}
              </p>
              <p className="text-[0.7rem] text-muted-foreground">
                {lang === "es" ? "Listo para licitar" : "Ready for bidding"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CONTACTO DIRECTO & FORMULARIO EXPRESS                     */}
      {/* ============================================================ */}
      <section className="space-y-10" id="contacto">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider text-primary bg-primary/10">
            {lang === "es" ? "Contacto Directo" : "Direct Contact"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t("homeContactTitle")}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t("homeContactSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
          {/* Canales Directos */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-foreground">
              {lang === "es" ? "Canales Inmediatos" : "Immediate Channels"}
            </h3>

            {/* Botón WhatsApp */}
            <a
              href={`https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-center gap-3 group cursor-pointer shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {t("homeContactWhatsApp")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lang === "es" ? "Respuesta ágil para empresas" : "Quick response for companies"}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-emerald-600 opacity-60 group-hover:opacity-100" />
              </div>
            </a>

            {/* Botón Correo Electrónico */}
            <a href="mailto:tatiana.lovric@consultoria.es" className="block">
              <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all flex items-center gap-3 group cursor-pointer shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground group-hover:text-primary">
                    {t("homeContactEmail")}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    tatiana.lovric@consultoria.es
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100" />
              </div>
            </a>

            {/* Garantía de Confidencialidad */}
            <div className="p-4 rounded-2xl bg-muted/50 border border-border/80 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>{lang === "es" ? "Confidencialidad Garantizada" : "Confidentiality Guaranteed"}</span>
              </div>
              <p>
                {lang === "es"
                  ? "Toda la información remitida está amparada por secreto profesional y normas de confidencialidad para licitaciones."
                  : "All submitted data is covered by professional confidentiality and tender trade-secret protections."}
              </p>
            </div>
          </div>

          {/* Formulario Express */}
          <div className="md:col-span-7">
            <Card className="border-border shadow-lg bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {t("homeFormTitle")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {lang === "es"
                    ? "Completa los datos para recibir una propuesta adaptada a tu sector."
                    : "Fill in the details to receive a proposal tailored to your industry."}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleFormSubmit}>
                <CardContent className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="c-name" className="text-xs">{t("homeFormName")}</Label>
                    <Input
                      id="c-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ej. Roberto Sánchez · Dir. General"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-company" className="text-xs">{t("homeFormCompany")}</Label>
                      <Input
                        id="c-company"
                        value={formCompany}
                        onChange={(e) => setFormCompany(e.target.value)}
                        placeholder="Ej. EcoSoluciones S.L."
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-email" className="text-xs">{t("homeFormEmail")}</Label>
                      <Input
                        id="c-email"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="direccion@tuempresa.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="c-msg" className="text-xs">{t("homeFormMessage")}</Label>
                    <Textarea
                      id="c-msg"
                      rows={3}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Ej. Necesitamos presentar el expediente de sostenibilidad para un pliego de contratación pública antes del 15 del próximo mes..."
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    type="submit"
                    className="w-full font-semibold gap-2 py-5"
                    disabled={formSending}
                  >
                    <Calendar className="h-4 w-4" />
                    {formSending ? "Enviando..." : t("homeFormSend")}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
