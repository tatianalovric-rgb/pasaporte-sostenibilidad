import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
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
  MessageCircle,
  Mail,
  Calendar,
  ExternalLink,
  ChevronRight,
  Download,
  Lock
} from "lucide-react";

export default function Home() {
  const { lang } = useI18n();
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
        title: lang === "es" ? "Solicitud enviada con éxito" : "Inquiry sent successfully",
        description:
          lang === "es"
            ? "Tatiana Lovric se pondrá en contacto en un plazo máximo de 24 horas laborales."
            : "Tatiana Lovric will contact you within 24 business hours.",
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
    <div className="space-y-28 pb-20">
      {/* ============================================================ */}
      {/* 1. HERO SECTION: LUMINOSO, ELEGANTE Y PROTAGÓNICO           */}
      {/* ============================================================ */}
      <section className="relative pt-6 pb-12 sm:pt-14 sm:pb-20 text-center space-y-10">
        {/* Fondo sutil y puro */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-60 pointer-events-none">
          <div className="w-[600px] h-[350px] bg-slate-100/80 rounded-full blur-3xl" />
        </div>

        {/* Logotipo Oficial en Gran Formato (Nítido y Protagónico) */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md transition-all hover:shadow-lg max-w-sm sm:max-w-md mx-auto">
            <img
              src="/logo-global-consulting.jpg"
              alt="Tatiana Lovric Global Consulting · Where Law, Strategy & Global Vision Converge"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold tracking-wider uppercase shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Where Law, Strategy & Global Vision Converge</span>
          </div>
        </div>

        {/* Titular Principal de Alto Impacto */}
        <div className="max-w-4xl mx-auto space-y-5 px-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
            {lang === "es" ? (
              <>
                Acredite la sostenibilidad de su empresa para{" "}
                <span className="text-primary underline decoration-slate-300 underline-offset-8">
                  ganar licitaciones
                </span>{" "}
                y financiación
              </>
            ) : (
              <>
                Certify your company's sustainability to{" "}
                <span className="text-primary underline decoration-slate-300 underline-offset-8">
                  win tenders
                </span>{" "}
                and secure financing
              </>
            )}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
            {lang === "es"
              ? "Acompañamiento especializado para estructurar y emitir su Pasaporte de Sostenibilidad bajo el estándar europeo oficial EFRAG VSME. El aval definitivo ante comités de contratación pública, banca y grandes corporaciones."
              : "Specialized advisory to structure and issue your Sustainability Passport under the official European EFRAG VSME standard. The definitive dossier for public procurement tenders, banking, and global supply chains."}
          </p>
        </div>

        {/* Botones de Acción Directos y Cómodos */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4">
          <Link href="/pasaporte">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold text-base px-8 py-6 rounded-xl shadow-md gap-2.5 transition-all hover:-translate-y-0.5"
            >
              <FileText className="h-5 w-5" />
              <span>{lang === "es" ? "Comenzar Pasaporte Digital" : "Start Digital Passport"}</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>

          <a
            href={`https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold text-base px-7 py-6 rounded-xl gap-2.5 transition-all"
            >
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              <span>{lang === "es" ? "Contactar por WhatsApp" : "Contact via WhatsApp"}</span>
            </Button>
          </a>

          <a href="#contacto">
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-slate-600 hover:text-slate-900 font-medium text-sm gap-1.5"
            >
              <Calendar className="h-4 w-4 text-primary" />
              <span>{lang === "es" ? "Solicitar Diagnóstico" : "Request Assessment"}</span>
            </Button>
          </a>
        </div>

        {/* Barra de Avales y Solvencia Normativa */}
        <div className="pt-10 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <Scale className="h-6 w-6 text-primary shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {lang === "es" ? "Licitaciones Públicas" : "Public Procurement"}
                </span>
                <span className="text-[0.7rem] text-slate-500">
                  {lang === "es" ? "Puntuación en pliegos" : "Technical tender points"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <Landmark className="h-6 w-6 text-primary shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {lang === "es" ? "Banca Sostenible" : "Sustainable Banking"}
                </span>
                <span className="text-[0.7rem] text-slate-500">
                  {lang === "es" ? "Alineado a SFDR" : "SFDR compliant"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <Award className="h-6 w-6 text-primary shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {lang === "es" ? "Estándar EFRAG" : "EFRAG Standard"}
                </span>
                <span className="text-[0.7rem] text-slate-500">
                  {lang === "es" ? "Marco VSME oficial" : "Official VSME framework"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {lang === "es" ? "Directiva CSRD" : "CSRD Directive"}
                </span>
                <span className="text-[0.7rem] text-slate-500">
                  {lang === "es" ? "Cadena de suministro" : "Supply chain ready"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. LOS 3 RETOS DE NEGOCIO (ESPACIOSO Y ELEGANTE)              */}
      {/* ============================================================ */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
          <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider text-primary bg-primary/10 px-3 py-1">
            {lang === "es" ? "Retorno de Inversión y Ventaja Competitiva" : "ROI & Competitive Advantage"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {lang === "es"
              ? "¿Por qué su empresa necesita el Pasaporte de Sostenibilidad hoy?"
              : "Why does your company need a Sustainability Passport today?"}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {lang === "es"
              ? "Las exigencias de sostenibilidad han dejado de ser teóricas: deciden directamente la adjudicación de contratos millonarios y el acceso al crédito bancario."
              : "Sustainability criteria are no longer theoretical: they directly decide multi-million contracts and bank credit approvals."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tarjeta 1: Licitaciones */}
          <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col p-2">
            <CardHeader className="space-y-4 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center">
                <Scale className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                {lang === "es" ? "Licitaciones y Contratación Pública" : "Public Procurement & Tenders"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-slate-600 flex-1">
              <p className="leading-relaxed">
                {lang === "es"
                  ? "Los nuevos pliegos de contratación pública premian con puntuación técnica determinante a las empresas que acreditan solvencia ESG con métricas auditables."
                  : "Public tender boards award decisive technical points to businesses proving ESG solvency with verifiable metrics."}
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 text-xs font-medium text-slate-800">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{lang === "es" ? "Puntuación técnica en pliegos oficiales" : "Technical scoring on procurement bids"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{lang === "es" ? "Expediente documental sin riesgo de exclusión" : "Audit-ready evidence eliminating tender rejection"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tarjeta 2: Banca SFDR */}
          <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col p-2">
            <CardHeader className="space-y-4 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Landmark className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                {lang === "es" ? "Banca y Financiación Sostenible (SFDR)" : "Banking & Sustainable Finance (SFDR)"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-slate-600 flex-1">
              <p className="leading-relaxed">
                {lang === "es"
                  ? "Bajo la normativa europea SFDR, las entidades bancarias requieren indicadores ESG certificados para autorizar préstamos verdes y conceder tipos bonificados."
                  : "Under European SFDR rules, banks require certified ESG metrics to authorize green loans and grant preferential interest rates."}
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 text-xs font-medium text-slate-800">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{lang === "es" ? "Tipos de interés bonificados en préstamos" : "Discounted interest rates on corporate loans"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{lang === "es" ? "Líneas de crédito y avales preferentes" : "Preferential performance bonds & credit lines"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tarjeta 3: Cadenas de Suministro CSRD */}
          <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col p-2">
            <CardHeader className="space-y-4 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Network className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                {lang === "es" ? "Cadenas de Valor de Grandes Clientes" : "Supply Chains of Global Buyers"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-slate-600 flex-1">
              <p className="leading-relaxed">
                {lang === "es"
                  ? "Las multinacionales sujetas a la directiva CSRD deben auditar a sus proveedores. Estar preparado evita la sustitución y garantiza contratos plurianuales."
                  : "Multinationals subject to CSRD must audit their supply tier. Being certified prevents substitution and secures multi-year vendor contracts."}
              </p>
              <ul className="space-y-3 pt-3 border-t border-slate-100 text-xs font-medium text-slate-800">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{lang === "es" ? "Homologación rápida ante comités de compras" : "Fast-track vendor approval in procurement audits"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{lang === "es" ? "Cumplimiento en cascada sin fricciones" : "Seamless CSRD supply-chain compliance"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SHOWCASE DE LA HERRAMIENTA INTERACTIVA                   */}
      {/* ============================================================ */}
      <section className="p-8 sm:p-14 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider border-slate-300 text-slate-700 bg-white px-3 py-1">
            {lang === "es" ? "Herramienta Digital Interactiva" : "Interactive Digital Platform"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lang === "es"
              ? "La Ruta Guiada hacia su Pasaporte de Sostenibilidad"
              : "The Guided Roadmap to your Sustainability Passport"}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {lang === "es"
              ? "Diseñado en 6 etapas progresivas según la metodología europea EFRAG VSME. Responda a su propio ritmo, adjunte evidencias y genere automáticamente su Informe Oficial en Word listo para presentar."
              : "Engineered in 6 progressive stages following European EFRAG VSME standard. Complete at your own pace, attach evidence, and instantly generate your Official Word Dossier."}
          </p>
        </div>

        {/* Módulos de la Ruta (3x2 Limpio) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              id: 0,
              title: lang === "es" ? "Nivel 0 · Estructura" : "Level 0 · Structure",
              code: "B1",
              desc: lang === "es" ? "Organización, modelo de negocio y gobierno corporativo." : "Organization, business model, and corporate governance."
            },
            {
              id: 1,
              title: lang === "es" ? "Nivel 1 · Medio Ambiente" : "Level 1 · Environment",
              code: "B2–B7",
              desc: lang === "es" ? "Consumo energético, agua, residuos y emisiones operativas." : "Energy consumption, water, waste, and operational emissions."
            },
            {
              id: 2,
              title: lang === "es" ? "Nivel 2 · Social & Empleo" : "Level 2 · Social & Workforce",
              code: "B8–B10",
              desc: lang === "es" ? "Salud laboral, brecha salarial, igualdad y formación." : "Occupational health, wage gap, diversity, and training."
            },
            {
              id: 3,
              title: lang === "es" ? "Nivel 3 · Conducta Ética" : "Level 3 · Ethical Conduct",
              code: "B11 (Cierre)",
              desc: lang === "es" ? "Anticorrupción, cumplimiento legal y proveedores responsables." : "Anti-bribery, legal compliance, and supply chain ethics."
            },
            {
              id: 4,
              title: lang === "es" ? "Nivel 4 · Clima & Descarbonización" : "Level 4 · Climate & Targets",
              code: "C1–C5",
              desc: lang === "es" ? "Planes de transición, reducción de carbono y resiliencia." : "Transition plans, greenhouse reduction, and resilience."
            },
            {
              id: 5,
              title: lang === "es" ? "Nivel 5 · Banca & SFDR" : "Level 5 · Banking & SFDR",
              code: "C6–C9 (SFDR)",
              desc: lang === "es" ? "Riesgos financieros climáticos y taxonomía europea." : "Climate financial risks and European green taxonomy."
            },
          ].map((step) => (
            <Link key={step.id} href={`/nivel/${step.id}`}>
              <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary hover:shadow-md transition-all cursor-pointer h-full flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-primary font-mono tracking-wide">
                      {step.title}
                    </span>
                    <Badge variant="secondary" className="text-[0.65rem] font-mono bg-slate-100 text-slate-700">
                      {step.code}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="flex items-center text-xs text-primary font-semibold gap-1 pt-4 group-hover:translate-x-1 transition-transform">
                  <span>{lang === "es" ? "Explorar módulo" : "View module"}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Botón Principal a la Aplicación */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/pasaporte">
            <Button size="lg" className="bg-primary hover:bg-primary/95 text-white font-bold px-8 py-6 rounded-xl shadow-md gap-2">
              <FileText className="h-5 w-5" />
              <span>{lang === "es" ? "Abrir el Pasaporte Completo" : "Open Full Passport"}</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>

          <Link href="/informe">
            <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-white font-semibold px-6 py-6 rounded-xl gap-2">
              <Download className="h-5 w-5 text-primary" />
              <span>{lang === "es" ? "Ver Expediente Oficial Word (.docx)" : "View Word Dossier (.docx)"}</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SOBRE TATIANA LOVRIC: PRESENTACIÓN EDITORIAL Y PRESTIGIO  */}
      {/* ============================================================ */}
      <section className="grid lg:grid-cols-12 gap-10 items-center" id="sobre-mi">
        {/* Tarjeta de Identidad */}
        <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
              <img
                src="/logo-global-consulting.jpg"
                alt="Tatiana Lovric Global Consulting"
                className="w-full max-w-[280px] h-auto object-contain rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tatiana Lovric
            </h3>
            <p className="text-xs font-bold text-sky-800 uppercase tracking-wider">
              Global Consulting · Sostenibilidad & Buen Gobierno
            </p>
            <p className="text-[0.7rem] text-slate-500 font-medium">
              Where Law, Strategy & Global Vision Converge
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed text-left italic">
            "{lang === "es"
              ? "La sostenibilidad solo genera valor real cuando se integra en la toma de decisiones directiva, en la rentabilidad de las ofertas comerciales y en la confianza con las entidades financieras."
              : "Sustainability only creates genuine business value when embedded into boardroom governance, commercial pricing power, and financial trust."}"
          </div>
        </div>

        {/* Biografía y Enfoque Directivo */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider text-primary bg-primary/10 px-3 py-1">
              {lang === "es" ? "Autoridad & Metodología" : "Authority & Methodology"}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {lang === "es"
                ? "Rigor técnico y visión directiva para proteger e impulsar el valor de su compañía"
                : "Technical rigor and board-level vision to protect and enhance corporate value"}
            </h2>
          </div>
          <p className="text-base text-slate-600 leading-relaxed">
            {lang === "es"
              ? "Con amplia trayectoria en gobierno corporativo, cumplimiento legal y dirección estratégica, Tatiana Lovric ayuda a consejos de administración y comités directivos a transformar las crecientes obligaciones regulatorias europeas en una palanca de solvencia y diferenciación en el mercado."
              : "With a strong track record in corporate governance, legal compliance, and strategic management, Tatiana Lovric guides boards and leadership teams to turn European regulatory mandates into market differentiation."}
          </p>
          <p className="text-base text-slate-600 leading-relaxed">
            {lang === "es"
              ? "Cada expediente se aborda con absoluto secreto profesional, rigor en la verificación de evidencias y enfoque pragmático orientado a resultados de negocio tangibles."
              : "Every case is handled under strict professional confidentiality, rigorous audit-ready verification, and a pragmatic focus on tangible business results."}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 pt-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <span className="text-primary font-bold text-xl font-mono">100%</span>
              <p className="text-xs font-semibold text-slate-900">
                {lang === "es" ? "Alineado a EFRAG" : "EFRAG Aligned"}
              </p>
              <p className="text-[0.7rem] text-slate-500">
                {lang === "es" ? "Estándar oficial UE" : "Official EU standard"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <span className="text-emerald-700 font-bold text-xl font-mono">SFDR</span>
              <p className="text-xs font-semibold text-slate-900">
                {lang === "es" ? "Aprobado para Banca" : "Bank Approved"}
              </p>
              <p className="text-[0.7rem] text-slate-500">
                {lang === "es" ? "Crédito bonificado" : "Discounted credit"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <span className="text-blue-700 font-bold text-xl font-mono">Word</span>
              <p className="text-xs font-semibold text-slate-900">
                {lang === "es" ? "Expediente Emitible" : "Issuable Dossier"}
              </p>
              <p className="text-[0.7rem] text-slate-500">
                {lang === "es" ? "Para licitaciones" : "Ready for tenders"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. CONTACTO DIRECTO: CÓMODO, RÁPIDO Y SIN FRICCIÓN          */}
      {/* ============================================================ */}
      <section className="space-y-10" id="contacto">
        <div className="text-center space-y-3 max-w-3xl mx-auto px-4">
          <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider text-primary bg-primary/10 px-3 py-1">
            {lang === "es" ? "Contacto Directo con Tatiana Lovric" : "Direct Contact with Tatiana Lovric"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {lang === "es"
              ? "¿Tiene una licitación o consulta estratégica?"
              : "Have an upcoming tender or strategic inquiry?"}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {lang === "es"
              ? "Elija el canal que le resulte más cómodo. Le responderemos con la máxima agilidad y discreción."
              : "Choose the channel most convenient for you. We will respond with promptness and discretion."}
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
          {/* Canales Directos Inmediatos */}
          <div className="md:col-span-5 space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              {lang === "es" ? "Atención Inmediata" : "Direct Channels"}
            </h3>

            {/* Botón WhatsApp */}
            <a
              href={`https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/60 hover:bg-emerald-50 transition-all flex items-center gap-4 group cursor-pointer shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                    {lang === "es" ? "WhatsApp Directo" : "Direct WhatsApp"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {lang === "es" ? "Respuesta ágil para empresas" : "Fast response for companies"}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-emerald-600 opacity-70 group-hover:opacity-100" />
              </div>
            </a>

            {/* Botón Correo Electrónico */}
            <a href="mailto:tatiana.lovric@consultoria.es" className="block">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-center gap-4 group cursor-pointer shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-primary">
                    {lang === "es" ? "Correo Corporativo" : "Corporate Email"}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    tatiana.lovric@consultoria.es
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:opacity-100" />
              </div>
            </a>

            {/* Garantía de Confidencialidad */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Lock className="h-4 w-4 text-primary" />
                <span>{lang === "es" ? "Confidencialidad Garantizada" : "Guaranteed Confidentiality"}</span>
              </div>
              <p className="leading-relaxed">
                {lang === "es"
                  ? "Toda la información remitida está amparada por secreto profesional y estricta reserva mercantil para procesos de licitación."
                  : "All information shared is strictly covered by professional privilege and trade-secret confidentiality."}
              </p>
            </div>
          </div>

          {/* Formulario Breve y Cómodo */}
          <div className="md:col-span-7">
            <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-900">
                  {lang === "es" ? "Solicitar Asesoramiento Personalizado" : "Request Personalized Advisory"}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {lang === "es"
                    ? "Indique brevemente los datos de su empresa y el motivo de su consulta."
                    : "Enter your company details and the topic of your inquiry."}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleFormSubmit}>
                <CardContent className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="c-name" className="text-xs font-semibold text-slate-700">
                      {lang === "es" ? "Nombre y Cargo" : "Name & Position"}
                    </Label>
                    <Input
                      id="c-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ej. Roberto Sánchez · Dir. General"
                      className="bg-white border-slate-200"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-company" className="text-xs font-semibold text-slate-700">
                        {lang === "es" ? "Empresa" : "Company"}
                      </Label>
                      <Input
                        id="c-company"
                        value={formCompany}
                        onChange={(e) => setFormCompany(e.target.value)}
                        placeholder="Ej. Soluciones Industriales S.L."
                        className="bg-white border-slate-200"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-email" className="text-xs font-semibold text-slate-700">
                        {lang === "es" ? "Correo Electrónico" : "Email Address"}
                      </Label>
                      <Input
                        id="c-email"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="direccion@tuempresa.com"
                        className="bg-white border-slate-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="c-msg" className="text-xs font-semibold text-slate-700">
                      {lang === "es" ? "Detalle o Pliego de la Consulta" : "Details or Tender Inquiry"}
                    </Label>
                    <Textarea
                      id="c-msg"
                      rows={3}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Ej. Necesitamos presentar el expediente de sostenibilidad para un concurso de contratación pública el próximo mes..."
                      className="bg-white border-slate-200"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold gap-2 py-5 rounded-xl shadow-xs"
                    disabled={formSending}
                  >
                    <Calendar className="h-4 w-4" />
                    {formSending
                      ? (lang === "es" ? "Enviando solicitud..." : "Sending inquiry...")
                      : (lang === "es" ? "Enviar Consulta Confidencial" : "Submit Confidential Inquiry")}
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
