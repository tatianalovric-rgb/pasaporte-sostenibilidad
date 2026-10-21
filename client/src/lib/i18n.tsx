import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export type Language = "es" | "en";

export const translations = {
  es: {
    // Branding & Header
    brandTitle: "Pasaporte de Sostenibilidad",
    brandSubtitle: "Acreditación ESG para Empresas y Licitaciones",
    navRoadmap: "Ruta de Acreditación",
    navReport: "Expediente / Informe Oficial",
    navMethod: "Criterios y Metodología",
    themeToggleLight: "Activar modo claro",
    themeToggleDark: "Activar modo oscuro",
    langToggle: "English",

    // Hero Section
    badgeStandard: "VSME · EFRAG",
    badgeHighImpact: "Sector de alto impacto climático detectado",
    badgeOptionPrefix: "Opción: ",
    badgeOptionNone: "Opción sin seleccionar",
    heroTitleDefault: "Pasaporte de Sostenibilidad Empresarial",
    heroTitleCompany: "{empresa}: Expediente de Pasaporte de Sostenibilidad",
    heroSubtitle:
      "Acredita la solvencia ambiental, social y de gobernanza (ESG) de tu empresa. El pasaporte oficial para ganar licitaciones públicas y privadas, homologarte ante grandes compradores multinacionales y acceder a financiación bancaria bajo el estándar europeo VSME de EFRAG.",

    // Value Pillars (Cards)
    pillarTendersTitle: "Habilitado para Licitaciones",
    pillarTendersDesc: "Cumple con las cláusulas de sostenibilidad y solvencia técnica exigidas en pliegos y comités de compras.",
    pillarBankTitle: "Aprobado para Banca y SFDR",
    pillarBankDesc: "Alineado con los indicadores que exige el sector financiero para líneas de crédito, avales y tipos preferenciales.",
    pillarDossierTitle: "Expediente en 6 Etapas",
    pillarDossierDesc: "Ruta guiada paso a paso. Genera tu informe oficial en Word y datos estructurados en sesiones cortas.",

    // Progress Box
    progressCoverageLabel: "Cobertura de requisitos",
    progressResolved: "{resolved} de {total} requisitos cumplidos · {pct}%",
    btnContinueLevel: "Continuar en Nivel {id}",
    btnReset: "Reiniciar",
    btnResetConfirm: "¿Estás seguro de que deseas reiniciar todos los datos?",

    // Maturity Roadmap
    roadmapTitle: "Ruta de madurez y acreditación",
    roadmapSubtitle: "Seis niveles consecutivos. Completa cada puerta de salida para desbloquear el siguiente peldaño.",
    levelWorkHere: "Trabajar aquí",
    levelLocked: "Bloqueado",
    levelComplete: "Completado",
    levelPendingFields: "Faltan datos",
    levelMinutes: "{min} min",
    levelWho: "Responsable: {who}",
    levelObtains: "Obtienes: {what}",
    levelMistake: "Evita: {mistake}",

    // Nivel Form
    btnBackRoadmap: "Volver a la ruta",
    btnNextBlock: "Siguiente bloque",
    btnSave: "Guardar",
    btnSaving: "Guardando...",
    btnUseInherited: "Usar dato heredado: {val}",
    btnMarkNa: "No aplica",
    btnUndoNa: "Restaurar campo",
    labelEvidence: "Evidencia documental",
    evidencePlaceholder: "Indica factura, archivo o registro justificativo...",
    gateQuestionLabel: "Pregunta filtro inicial",
    gateYes: "Sí",
    gateNo: "No",
    gateCollapsedMsg: "Bloque marcado como no aplicable. Declaración negativa registrada.",
    savedToastTitle: "Datos guardados",
    savedToastDesc: "Tus cambios se han registrado correctamente.",

    // Informe / Dossier
    reportTitle: "Expediente Oficial del Pasaporte",
    reportSubtitle:
      "Tu documentación de sostenibilidad lista para entregar. Cada nivel aporta a este expediente: con los Niveles 0–3 obtienes el Módulo Básico (OPCIÓN A); con los Niveles 4–5 alcanzas el Grado Inversión (OPCIÓN B) con correspondencia SFDR para bancos y pliegos.",
    badgeOptionA: "OPCIÓN A · Módulo Básico",
    badgeOptionB: "OPCIÓN B · Módulo Completo",
    badgeCoverage: "{pct}% de cumplimiento",
    draftWarning:
      "Borrador en preparación. El expediente se marcará como emitible cuando no queden campos obligatorios pendientes y cada omisión esté documentada.",
    btnDownloadWord: "Descargar Expediente (Word)",
    btnDownloadJson: "Datos para Bancos (JSON)",
    btnCopyText: "Copiar texto",
    btnDownloadMd: "Descargar Markdown",
    wordToastSuccess: "Expediente en Word descargado",
    wordToastSuccessDesc: "Lo encontrarás en tu carpeta de Descargas.",
    jsonToastDesc: "Archivo estructurado para departamentos de compras y análisis de riesgo bancario.",
    copyToastSuccess: "Expediente copiado al portapapeles",

    // Metodo
    methodTitle: "Criterios Técnicos y Metodología",
    methodSubtitle: "Arquitectura normativa basada en el estándar europeo VSME de EFRAG y su equivalencia con SFDR.",

    // Authentication & Multi-company
    navLogin: "Acceso Empresa",
    navLogout: "Cerrar sesión",
    authBadgeSecurity: "Seguridad y Cifrado Empresarial",
    authTitle: "Acceso Seguro al Pasaporte de Sostenibilidad",
    authSubtitle: "Inicia sesión con tu cuenta de empresa o crea una nueva para proteger tus datos de licitaciones bajo cifrado seguro y aislamiento estricto.",
    tabLogin: "Iniciar Sesión",
    tabRegister: "Crear Cuenta de Empresa",
    emailLabel: "Correo Electrónico Corporativo",
    emailPlaceholder: "direccion@tuempresa.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "••••••••",
    companyNameLabel: "Nombre Oficial de la Empresa",
    companyNamePlaceholder: "Ej. EcoSoluciones Industriales, S.L.",
    btnLoginAction: "Acceder a mi Expediente",
    btnRegisterAction: "Registrar Empresa y Proteger Datos",
    authLoading: "Verificando credenciales...",
    securityBadge1: "Cifrado Criptográfico de Contraseñas",
    securityDesc1: "Algoritmo scrypt con salting individual de 128 bits para máxima protección contra filtraciones.",
    securityBadge2: "Aislamiento Total de Expedientes",
    securityDesc2: "Tus datos, respuestas y evidencias son privadas e inaccesibles para otras empresas.",
    securityBadge3: "Confidencialidad para Licitaciones y RGPD",
    securityDesc3: "Protección de secretos comerciales y políticas de privacidad conformes con la UE.",
    consultantRoleBadge: "Consultora Principal",
    clientRoleBadge: "Empresa Cliente",
    switchCompanyLabel: "Expediente Activo:",
    demoAccountNotice: "Modo de Prueba (Sin iniciar sesión)",
    loginSuccessToast: "Sesión iniciada con éxito",
    loginSuccessToastDesc: "Bienvenido de nuevo a tu pasaporte.",
    registerSuccessToast: "Empresa registrada exitosamente",
    registerSuccessToastDesc: "Tu expediente ha sido creado con aislamiento seguro.",
    logoutSuccessToast: "Sesión cerrada",

    // Navegación Corporativa
    navHome: "Inicio",
    navPassport: "Pasaporte ESG",
    navServices: "Servicios",
    navAbout: "Sobre Mí",
    navContact: "Contacto",
    ctaOpenApp: "Acceder al Pasaporte",
    ctaRequestAudit: "Agendar Diagnóstico",

    // Home / Landing Page Corporativa
    homeHeroTag: "Tatiana Lovric · Consultoría Estratégica & Gobierno Corporativo",
    homeHeroTitle: "Acredita la Sostenibilidad de tu Empresa para Ganar Licitaciones y Financiación",
    homeHeroSubtitle:
      "Acompañamos a empresas de cualquier tamaño a estructurar, validar y emitir su Pasaporte de Sostenibilidad bajo el estándar europeo VSME de EFRAG. El expediente oficial para ganar concursos públicos y privados, homologarse ante grandes compradores multinacionales y acceder a financiación bancaria preferente.",
    homeBtnStart: "Iniciar mi Pasaporte ESG",
    homeBtnDemo: "Explorar Demostración",
    homeBtnConsult: "Agendar Diagnóstico con Tatiana",
    homeTrustStandard: "Estándar Oficial EFRAG VSME",
    homeTrustSfdr: "Alineado con Banca y SFDR",
    homeTrustCsrd: "Preparación Directiva CSRD",
    homeTrustProcurement: "Solvencia Técnica en Licitaciones",

    // Retos / Soluciones
    homeWhyTitle: "¿Por qué tu empresa necesita un Pasaporte de Sostenibilidad hoy?",
    homeWhySubtitle:
      "Las exigencias de sostenibilidad ya no son teóricas: deciden la adjudicación de contratos y las condiciones de financiación bancaria.",
    homeCard1Title: "Licitaciones Públicas y Privadas",
    homeCard1Desc:
      "Los pliegos de contratación y comités de compras multinacionales exigen cláusulas ambientales, sociales y de gobernanza obligatorias para adjudicar contratos.",
    homeCard2Title: "Banca y Financiación Sostenible (SFDR)",
    homeCard2Desc:
      "Las entidades financieras evalúan tu perfil ESG para autorizar créditos, líneas de avales y condiciones bonificadas según la taxonomía europea.",
    homeCard3Title: "Cadenas de Valor de Grandes Compradores",
    homeCard3Desc:
      "Las grandes corporaciones obligadas a reportar bajo CSRD trasladan sus exigencias a sus proveedores; sin acreditación documentada, quedas fuera de la lista homologada.",

    // Servicios
    homeServicesTitle: "Servicios de Consultoría Estratégica",
    homeServicesSubtitle:
      "Acompañamiento directivo y técnico para transformar la sostenibilidad en una ventaja competitiva real.",
    homeSrv1Title: "Elaboración Integral del Pasaporte de Sostenibilidad",
    homeSrv1Desc:
      "Ruta estructurada para recopilar, calcular y redactar cada una de las divulgaciones obligatorias (Módulo Básico B1–B11) y completas (C1–C9).",
    homeSrv2Title: "Diagnóstico Express de Brecha Normativa ESG",
    homeSrv2Desc:
      "Identificamos en días qué requisitos cumples, cuáles faltan y qué evidencias documentales te exigirán tus clientes y entidades financieras.",
    homeSrv3Title: "Gobierno Corporativo y Políticas Internas",
    homeSrv3Desc:
      "Diseño de códigos éticos, políticas anticorrupción, planes de igualdad y estructuras de administración para alcanzar el Grado Inversión.",
    homeSrv4Title: "Defensa Técnica en Pliegos de Licitación",
    homeSrv4Desc:
      "Revisión documental de los criterios de solvencia técnica y redacción de memorias de sostenibilidad para tus ofertas de licitación.",

    // Etapas
    homeStepsTitle: "Un Método Claro en 6 Etapas Consecutivas",
    homeStepsSubtitle:
      "De la ficha básica al expediente final con Grado Inversión y correspondencia bancaria SFDR.",
    homeStep0: "N0 · Ficha y Opción: Denominación, sector y alcance de reporte (Básico u Opción B).",
    homeStep1: "N1 · Clima y Energía: Consumo energético y emisiones de gases de efecto invernadero (Alcance 1 y 2).",
    homeStep2: "N2 · Capital Humano: Salud laboral, formación continua y brecha salarial de género.",
    homeStep3: "N3 · Conducta Empresarial: Políticas anticorrupción, condenas y cierre del Módulo Básico.",
    homeStep4: "N4 · Planes e Inversión: Objetivos cuantitativos y plan de transición con CAPEX verde.",
    homeStep5: "N5 · Gobierno Corporativo: Órgano de administración y correspondencia con el estándar SFDR.",

    // Sobre Tatiana
    homeAboutTitle: "Sobre Tatiana Lovric",
    homeAboutSubtitle: "Consultora Estratégica · Sostenibilidad y Gobierno Corporativo",
    homeAboutText1:
      "Especializada en transformar la sostenibilidad corporativa y los marcos regulatorios europeos (EFRAG VSME, CSRD, SFDR) en ventajas competitivas reales para las empresas.",
    homeAboutText2:
      "Mi enfoque no es burocrático ni teórico: trabajo codo a codo con la dirección y los equipos operativos para que cada dato se traduzca en mayor solvencia para ganar licitaciones, homologarse ante multinacionales y obtener condiciones bancarias preferenciales.",
    homeAboutQuote:
      "«La sostenibilidad no es un trámite estético: hoy es el filtro que decide quién gana los contratos y quién accede al capital.»",

    // Contacto
    homeContactTitle: "¿Hablamos de tus próximas licitaciones o de tu Pasaporte ESG?",
    homeContactSubtitle:
      "Agenda una sesión inicial de diagnóstico o contáctame directamente por WhatsApp o correo corporativo.",
    homeContactWhatsApp: "Contactar por WhatsApp",
    homeContactEmail: "Enviar Correo Directo",
    homeFormTitle: "Solicitar Diagnóstico Express",
    homeFormName: "Nombre y Apellidos",
    homeFormCompany: "Empresa",
    homeFormEmail: "Correo Corporativo",
    homeFormMessage: "¿En qué licitación o proyecto estás trabajando?",
    homeFormSend: "Enviar Solicitud de Diagnóstico",
    homeFormSentTitle: "Solicitud enviada con éxito",
    homeFormSentDesc: "Gracias por contactar. Tatiana Lovric te responderá en breve.",

    // Footer
    footerConsultant: "Plataforma desarrollada y asesorada por Tatiana Lovric · Consultoría Estratégica, Sostenibilidad y Gobierno Corporativo.",
    footerStandard: "Estructura de divulgaciones conforme al VSME Standard de EFRAG (Módulo Básico B1–B11, Módulo Completo C1–C9).",
    footerDisclaimer: "Herramienta de preparación de información para licitaciones y banca; no sustituye el aseguramiento externo formal.",
  },
  en: {
    // Branding & Header
    brandTitle: "Sustainability Passport",
    brandSubtitle: "ESG Accreditation for Tenders & Sustainable Finance",
    navRoadmap: "Accreditation Roadmap",
    navReport: "Official Dossier / Report",
    navMethod: "Criteria & Methodology",
    themeToggleLight: "Switch to light mode",
    themeToggleDark: "Switch to dark mode",
    langToggle: "Español",

    // Hero Section
    badgeStandard: "VSME · EFRAG",
    badgeHighImpact: "High Climate Impact Sector Detected",
    badgeOptionPrefix: "Option: ",
    badgeOptionNone: "Option not selected",
    heroTitleDefault: "Corporate Sustainability Passport",
    heroTitleCompany: "{empresa}: Sustainability Passport Dossier",
    heroSubtitle:
      "Certify your company's environmental, social, and governance (ESG) compliance. The official passport to win public and private tenders, qualify with multinational supply chains, and access sustainable banking finance under the European EFRAG VSME Standard.",

    // Value Pillars (Cards)
    pillarTendersTitle: "Ready for Tenders & Bidding",
    pillarTendersDesc: "Meets technical sustainability and ESG solvency criteria required in RFP tenders and corporate procurement.",
    pillarBankTitle: "Bank & SFDR Approved",
    pillarBankDesc: "Aligned with indicators required by the financial sector for credit lines, bank guarantees, and green rates.",
    pillarDossierTitle: "6-Stage Guided Dossier",
    pillarDossierDesc: "Step-by-step roadmap. Generate your official Word report and structured machine-readable data in short sessions.",

    // Progress Box
    progressCoverageLabel: "Requirement Coverage",
    progressResolved: "{resolved} of {total} requirements completed · {pct}%",
    btnContinueLevel: "Continue to Level {id}",
    btnReset: "Reset",
    btnResetConfirm: "Are you sure you want to reset all data?",

    // Maturity Roadmap
    roadmapTitle: "Maturity & Accreditation Roadmap",
    roadmapSubtitle: "Six consecutive levels. Complete each exit gateway to unlock the next maturity step.",
    levelWorkHere: "Work here",
    levelLocked: "Locked",
    levelComplete: "Completed",
    levelPendingFields: "Missing data",
    levelMinutes: "{min} mins",
    levelWho: "Responsible: {who}",
    levelObtains: "You obtain: {what}",
    levelMistake: "Avoid: {mistake}",

    // Nivel Form
    btnBackRoadmap: "Back to roadmap",
    btnNextBlock: "Next block",
    btnSave: "Save",
    btnSaving: "Saving...",
    btnUseInherited: "Use inherited value: {val}",
    btnMarkNa: "Not applicable",
    btnUndoNa: "Restore field",
    labelEvidence: "Documentary Evidence",
    evidencePlaceholder: "Indicate invoice, file, or audit record...",
    gateQuestionLabel: "Initial Filter Question",
    gateYes: "Yes",
    gateNo: "No",
    gateCollapsedMsg: "Block marked as not applicable. Negative statement recorded.",
    savedToastTitle: "Data saved",
    savedToastDesc: "Your entries have been saved successfully.",

    // Informe / Dossier
    reportTitle: "Official Passport Dossier",
    reportSubtitle:
      "Your sustainability documentation ready to submit. Each level contributes to this dossier: Levels 0–3 deliver the Basic Module (OPTION A); Levels 4–5 achieve Investment Grade (OPTION B) with SFDR mapping for banks and tenders.",
    badgeOptionA: "OPTION A · Basic Module",
    badgeOptionB: "OPTION B · Comprehensive Module",
    badgeCoverage: "{pct}% compliance",
    draftWarning:
      "Draft in progress. The dossier will be marked as finalized when all mandatory fields are completed and any omission is documented.",
    btnDownloadWord: "Download Dossier (Word)",
    btnDownloadJson: "Bank Data (JSON)",
    btnCopyText: "Copy text",
    btnDownloadMd: "Download Markdown",
    wordToastSuccess: "Word Dossier downloaded",
    wordToastSuccessDesc: "You can find it in your Downloads folder.",
    jsonToastDesc: "Structured file for procurement departments and bank risk assessments.",
    copyToastSuccess: "Dossier copied to clipboard",

    // Metodo
    methodTitle: "Technical Criteria & Methodology",
    methodSubtitle: "Regulatory architecture based on the European EFRAG VSME Standard and SFDR mapping.",

    // Authentication & Multi-company
    navLogin: "Company Login",
    navLogout: "Sign Out",
    authBadgeSecurity: "Enterprise Security & Encryption",
    authTitle: "Secure Access to Sustainability Passport",
    authSubtitle: "Sign in with your company account or register a new one to safeguard your tender data under high-grade protection.",
    tabLogin: "Sign In",
    tabRegister: "Register Company Account",
    emailLabel: "Corporate Email Address",
    emailPlaceholder: "contact@yourcompany.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    companyNameLabel: "Official Company Name",
    companyNamePlaceholder: "E.g. EcoSolutions Industrial Ltd.",
    btnLoginAction: "Access My Dossier",
    btnRegisterAction: "Register Company & Secure Data",
    authLoading: "Verifying credentials...",
    securityBadge1: "Cryptographic Password Encryption",
    securityDesc1: "Scrypt algorithm with unique 128-bit salting for maximum leak resilience.",
    securityBadge2: "Strict Multi-Tenant Isolation",
    securityDesc2: "Your data, answers, and audit evidence are completely private and segregated.",
    securityBadge3: "Tender Confidentiality & GDPR",
    securityDesc3: "Trade secret protections and European data privacy standards.",
    consultantRoleBadge: "Lead Consultant",
    clientRoleBadge: "Client Company",
    switchCompanyLabel: "Active Dossier:",
    demoAccountNotice: "Demo Mode (Not signed in)",
    loginSuccessToast: "Signed in successfully",
    loginSuccessToastDesc: "Welcome back to your sustainability passport.",
    registerSuccessToast: "Company registered successfully",
    registerSuccessToastDesc: "Your dossier has been initialized with isolated security.",
    logoutSuccessToast: "Signed out",

    // Corporate Navigation
    navHome: "Home",
    navPassport: "ESG Passport",
    navServices: "Services",
    navAbout: "About Me",
    navContact: "Contact",
    ctaOpenApp: "Open Passport",
    ctaRequestAudit: "Book Consultation",

    // Home / Corporate Landing Page
    homeHeroTag: "Tatiana Lovric · Strategic Advisory & Corporate Governance",
    homeHeroTitle: "Accredit Your Company's ESG Solvency to Win Tenders and Secure Financing",
    homeHeroSubtitle:
      "We guide companies of all sizes to structure, validate, and issue their Sustainability Passport under the European EFRAG VSME Standard. The official dossier to win public and private tenders, qualify for multinational corporate supply chains, and access preferential sustainable bank financing.",
    homeBtnStart: "Start My ESG Passport",
    homeBtnDemo: "Explore Live Demo",
    homeBtnConsult: "Book Consultation with Tatiana",
    homeTrustStandard: "Official EFRAG VSME Standard",
    homeTrustSfdr: "Aligned with Banking & SFDR",
    homeTrustCsrd: "CSRD Directive Readiness",
    homeTrustProcurement: "Technical Solvency for Tenders",

    // Challenges / Solutions
    homeWhyTitle: "Why does your company need a Sustainability Passport today?",
    homeWhySubtitle:
      "Sustainability demands are no longer theoretical: they decide contract awards and banking terms.",
    homeCard1Title: "Public & Private Tenders",
    homeCard1Desc:
      "Public procurement tenders and multinational purchasing boards mandate environmental, social, and governance compliance to award contracts.",
    homeCard2Title: "Sustainable Banking & Finance (SFDR)",
    homeCard2Desc:
      "Financial institutions evaluate your ESG profile to authorize credit lines, performance bonds, and discounted rates under European sustainable finance taxonomies.",
    homeCard3Title: "Multinational Supply Chains",
    homeCard3Desc:
      "Corporations obligated to report under CSRD cascade requirements to their suppliers; without documented accreditation, you are excluded from authorized vendor lists.",

    // Services
    homeServicesTitle: "Strategic Advisory Services",
    homeServicesSubtitle:
      "Executive and technical guidance to turn sustainability into a tangible competitive edge.",
    homeSrv1Title: "Full Sustainability Passport Formulation",
    homeSrv1Desc:
      "Structured roadmap to collect, calculate, and draft all mandatory (Basic Module B1–B11) and comprehensive (C1–C9) disclosures.",
    homeSrv2Title: "Express ESG Regulatory Gap Assessment",
    homeSrv2Desc:
      "We identify within days which requirements you meet, which are missing, and what audit evidence corporate clients and banks will demand.",
    homeSrv3Title: "Corporate Governance & Internal Policies",
    homeSrv3Desc:
      "Design of ethical codes, anti-corruption policies, gender equality plans, and board governance structures to reach Investment Grade.",
    homeSrv4Title: "Tender Defense & Bidding Support",
    homeSrv4Desc:
      "Documentary review of technical solvency criteria and sustainability memorandums for high-stakes tender submissions.",

    // Stages
    homeStepsTitle: "A Proven Method in 6 Sequential Stages",
    homeStepsSubtitle:
      "From basic corporate profile to Investment Grade dossier with SFDR banking correspondence.",
    homeStep0: "N0 · Profile & Option: Company details, sector classification, and reporting scope (Basic or Option B).",
    homeStep1: "N1 · Climate & Energy: Energy consumption and greenhouse gas emissions (Scope 1 and 2).",
    homeStep2: "N2 · Human Capital: Occupational health, continuous training, and gender pay gap metrics.",
    homeStep3: "N3 · Business Conduct: Anti-corruption policies, litigation checks, and completion of Basic Module.",
    homeStep4: "N4 · Action Plans & CAPEX: Quantified targets and verifiable green transition investments.",
    homeStep5: "N5 · Corporate Governance: Administrative body oversight and SFDR banking correspondence.",

    // About Tatiana
    homeAboutTitle: "About Tatiana Lovric",
    homeAboutSubtitle: "Strategic Consultant · Sustainability & Corporate Governance",
    homeAboutText1:
      "Specialized in transforming corporate sustainability and European regulatory frameworks (EFRAG VSME, CSRD, SFDR) into practical, commercial competitive advantages.",
    homeAboutText2:
      "My approach is neither bureaucratic nor theoretical: I work closely with executive leadership and operational teams so that every data point translates into higher solvency to win tenders, qualify for corporate buyers, and obtain preferential financing.",
    homeAboutQuote:
      "«Sustainability is not an aesthetic formality: today it is the filter that decides who wins contracts and who accesses capital.»",

    // Contact
    homeContactTitle: "Shall we discuss your upcoming tenders or your ESG Passport?",
    homeContactSubtitle:
      "Book an initial strategic diagnosis or contact me directly via WhatsApp or corporate email.",
    homeContactWhatsApp: "Chat on Direct WhatsApp",
    homeContactEmail: "Send Direct Email",
    homeFormTitle: "Request Express Assessment",
    homeFormName: "Full Name & Title",
    homeFormCompany: "Company",
    homeFormEmail: "Corporate Email",
    homeFormMessage: "Tell us about your company, tender, or project",
    homeFormSend: "Submit Assessment Request",
    homeFormSentTitle: "Message Sent Successfully",
    homeFormSentDesc: "Thank you for reaching out. Tatiana Lovric will reply promptly.",

    // Footer
    footerConsultant: "Platform developed and advised by Tatiana Lovric · Strategic Advisory, Sustainability & Corporate Governance.",
    footerStandard: "Disclosure structure compliant with EFRAG's VSME Standard (Basic Module B1–B11, Comprehensive Module C1–C9).",
    footerDisclaimer: "Information preparation tool for tenders and banking; does not replace formal third-party assurance.",
  },
} as const;

type TranslationKeys = keyof typeof translations.es;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKeys, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "es",
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => translations.es[key] || key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred_lang") as Language | null;
      if (saved === "es" || saved === "en") return saved;
      if (navigator.language?.startsWith("en")) return "en";
    }
    return "es";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_lang", newLang);
      document.documentElement.lang = newLang;
    }
  };

  const toggleLang = () => {
    setLang(lang === "es" ? "en" : "es");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (key: TranslationKeys, params?: Record<string, string | number>): string => {
    const dict = translations[lang] || translations.es;
    let text: string = (dict as Record<string, string>)[key] || (translations.es as Record<string, string>)[key] || (key as string);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageToggle() {
  const { lang, toggleLang } = useI18n();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold tracking-wide border-border/80 hover:bg-accent/80 transition-all"
      aria-label="Cambiar idioma / Switch language"
      title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <Globe className="h-3.5 w-3.5 text-primary" />
      <span>{lang === "es" ? "EN" : "ES"}</span>
      <span className="text-[0.65rem] opacity-60 font-mono">
        {lang === "es" ? "English" : "Español"}
      </span>
    </Button>
  );
}
