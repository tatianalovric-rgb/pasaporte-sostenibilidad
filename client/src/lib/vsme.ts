/**
 * Catálogo VSME (EFRAG) — Módulo Básico (B1–B11) y Módulo Completo (C1–C9)
 * organizado en 6 niveles de madurez de producto.
 * Fuente normativa: EFRAG, VSME Standard.
 */

export type FieldType = "number" | "text" | "textarea" | "select" | "boolean";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  unit?: string;
  hint?: string;
  options?: string[];
  /** Si true, la app exige evidencia documental para marcar el campo como cerrado. */
  evidence?: boolean;
  /** El campo solo se muestra si otro campo tiene uno de estos valores. */
  dependsOn?: { key: string; equals: string[] };
}

export interface Disclosure {
  code: string;
  title: string;
  module: "Básico" | "Completo";
  /** Indicador SFDR al que alimenta (Apéndice C del estándar). */
  sfdr?: string;
  /** Pregunta filtro: si se responde "no", el bloque entero se colapsa. */
  gate?: { key: string; label: string };
  fields: Field[];
}

export interface Level {
  id: number;
  code: string;
  name: string;
  tagline: string;
  option: "Perfil" | "OPCIÓN A" | "OPCIÓN B";
  minutes: number;
  who: string;
  obtains: string;
  needs: string;
  mistake: string;
  gate: string;
  disclosures: Disclosure[];
}

export const CURRENCIES = [
  "USD — Dólar estadounidense",
  "EUR — Euro",
  "VES — Bolívar venezolano",
  "COP — Peso colombiano",
  "MXN — Peso mexicano",
  "BRL — Real brasileño",
  "ARS — Peso argentino",
  "CLP — Peso chileno",
  "PEN — Sol peruano",
  "UYU — Peso uruguayo",
  "BOB — Boliviano",
  "PYG — Guaraní paraguayo",
  "DOP — Peso dominicano",
  "CRC — Colón costarricense",
  "GTQ — Quetzal guatemalteco",
  "PAB — Balboa panameño",
  "GBP — Libra esterlina",
  "CHF — Franco suizo",
  "CAD — Dólar canadiense",
  "AUD — Dólar australiano",
  "CNY — Yuan chino",
  "JPY — Yen japonés",
  "INR — Rupia india",
  "ZAR — Rand sudafricano",
  "AED — Dírham de los Emiratos",
  "SAR — Riyal saudí",
  "Otra moneda",
];

export const HIGH_IMPACT_NACE = "Secciones NACE A–H y L (Anexo I, Reglamento (CE) n.º 1893/2006)";

export const LEVELS: Level[] = [
  {
    id: 0,
    code: "N0",
    name: "Perfil",
    tagline: "Tu empresa en 10 minutos",
    option: "Perfil",
    minutes: 12,
    who: "Administración o dirección",
    obtains: "Tu ficha ESG y la ruta personalizada según tu sector.",
    needs: "Documento constitutivo, últimos estados financieros, número de empleados y direcciones de tus instalaciones.",
    mistake:
      "Declarar un único código NACE cuando hay actividades secundarias relevantes: eso altera tu clasificación de alto impacto climático y el requisito de plan de transición en C3.",
    gate: "Ficha completa y OPCIÓN A u OPCIÓN B seleccionada (se puede cambiar después).",
    disclosures: [
      {
        code: "B1",
        title: "Bases de preparación",
        module: "Básico",
        fields: [
          { key: "B1.nombre", label: "Denominación de la empresa", type: "text" },
          {
            key: "B1.opcion",
            label: "Opción de reporte seleccionada",
            type: "select",
            options: ["OPCIÓN A: solo Módulo Básico", "OPCIÓN B: Módulo Básico y Módulo Completo"],
            hint: "El Módulo Básico es el enfoque objetivo para micro-empresas y el mínimo para las demás.",
          },
          {
            key: "B1.base",
            label: "Base del informe",
            type: "select",
            options: ["Individual", "Consolidada"],
            hint: "Si es consolidada, debes listar las subsidiarias con su domicilio registrado.",
          },
          {
            key: "B1.subsidiarias",
            label: "Subsidiarias cubiertas y domicilio registrado",
            type: "textarea",
            hint: "Solo se pide si el informe es consolidado.",
            dependsOn: { key: "B1.base", equals: ["Consolidada"] },
          },
          { key: "B1.forma_juridica", label: "Forma jurídica", type: "text" },
          {
            key: "B1.nace",
            label: "Código(s) de actividad NACE o CIIU",
            type: "text",
            hint: "Separa con comas. Si tu país usa la CIIU (ISIC Rev. 4 de Naciones Unidas), escribe ese código: sus secciones y divisiones coinciden con la NACE Rev. 2 de la UE. Determina si operas en sectores de alto impacto climático.",
          },
          {
            key: "B1.moneda",
            label: "Moneda de reporte",
            type: "select",
            options: CURRENCIES,
            hint: "La moneda de tus estados financieros. El VSME no impone una moneda; si el informe va a un banco o cliente europeo, puede pedirte además la conversión a euros.",
          },
          {
            key: "B1.moneda_otra",
            label: "Código de la moneda (ISO 4217)",
            type: "text",
            hint: "Tres letras, por ejemplo NGN, KRW o TRY.",
            dependsOn: { key: "B1.moneda", equals: ["Otra moneda"] },
          },
          { key: "B1.balance", label: "Tamaño del balance", type: "number", unit: "{MONEDA}", evidence: true },
          { key: "B1.facturacion", label: "Facturación", type: "number", unit: "{MONEDA}", evidence: true },
          { key: "B1.empleados", label: "Número de empleados", type: "number", unit: "headcount o ETC" },
          { key: "B1.pais", label: "País de operaciones principales y activos significativos", type: "text" },
          {
            key: "B1.geo",
            label: "Geolocalización de sedes propias, arrendadas o gestionadas",
            type: "textarea",
            hint: "Una línea por sede: nombre; latitud; longitud.",
          },
          {
            key: "B1.omisiones",
            label: "Divulgaciones omitidas por información clasificada o sensible",
            type: "textarea",
            hint: "El estándar permite la omisión, pero debe indicarse aquí qué divulgación se omitió.",
          },
        ],
      },
    ],
  },
  {
    id: 1,
    code: "N1",
    name: "Huella operativa",
    tagline: "Mide lo que ya pagas",
    option: "OPCIÓN A",
    minutes: 180,
    who: "Quien gestione compras o facturas",
    obtains: "Tu huella de Alcance 1 y 2 y el bloque de datos que más piden bancos y clientes grandes.",
    needs: "12 meses de facturas de electricidad y combustible, consumo de agua y comprobantes de retiro de residuos.",
    mistake: "Mezclar año fiscal y natural, o estimar sin dejar constancia del método de estimación.",
    gate: "12 meses consecutivos, cada línea con factura o medición adjunta y factor de emisión documentado.",
    disclosures: [
      {
        code: "B3",
        title: "Energía y emisiones de gases de efecto invernadero",
        module: "Básico",
        sfdr: "Cuota de energía no renovable · Emisiones de GEI y huella de carbono · Intensidad de GEI",
        fields: [
          { key: "B3.energia_total", label: "Consumo total de energía", type: "number", unit: "MWh", evidence: true },
          { key: "B3.energia_renovable", label: "Del cual, energía renovable", type: "number", unit: "MWh", evidence: true },
          { key: "B3.energia_no_renovable", label: "Del cual, energía no renovable", type: "number", unit: "MWh", evidence: true },
          { key: "B3.alcance1", label: "Emisiones brutas de Alcance 1", type: "number", unit: "tCO2e", evidence: true },
          { key: "B3.alcance2_location", label: "Alcance 2 (location-based)", type: "number", unit: "tCO2e", evidence: true },
          { key: "B3.alcance2_market", label: "Alcance 2 (market-based)", type: "number", unit: "tCO2e" },
          { key: "B3.alcance3", label: "Alcance 3 significativo (opcional en el Básico)", type: "number", unit: "tCO2e" },
          { key: "B3.intensidad", label: "Intensidad de GEI por facturación", type: "number", unit: "tCO2e / millón de {MONEDA}" },
          { key: "B3.factores", label: "Fuente y año de los factores de emisión aplicados", type: "textarea" },
        ],
      },
      {
        code: "B6",
        title: "Agua",
        module: "Básico",
        fields: [
          { key: "B6.extraccion", label: "Extracción total de agua", type: "number", unit: "m³", evidence: true },
          { key: "B6.consumo", label: "Consumo de agua", type: "number", unit: "m³" },
          {
            key: "B6.estres",
            label: "¿Alguna sede opera en zona de estrés hídrico?",
            type: "select",
            options: ["No", "Sí"],
          },
        ],
      },
      {
        code: "B7",
        title: "Uso de recursos, economía circular y gestión de residuos",
        module: "Básico",
        sfdr: "Ratio de residuos peligrosos y radiactivos",
        fields: [
          { key: "B7.residuos_total", label: "Residuos generados", type: "number", unit: "t", evidence: true },
          { key: "B7.residuos_peligrosos", label: "De los cuales, residuos peligrosos", type: "number", unit: "t", evidence: true },
          { key: "B7.residuos_reciclados", label: "Residuos desviados a reciclaje o reutilización", type: "number", unit: "t" },
          { key: "B7.circular", label: "Prácticas de economía circular aplicadas", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: 2,
    code: "N2",
    name: "Personas y cumplimiento",
    tagline: "Tu gente, en cifras",
    option: "OPCIÓN A",
    minutes: 90,
    who: "RRHH o gestoría externa",
    obtains: "Los indicadores sociales que exigen licitaciones y cuestionarios de proveedores.",
    needs: "Resumen de nómina por género y tipo de contrato, registro de accidentes, horas de formación y convenio aplicable.",
    mistake:
      "Dejar en blanco lo que no ocurrió. Declara cero de forma expresa: un campo vacío se lee como falta de control interno.",
    gate: "Cifras conciliadas con nómina y con el registro de siniestralidad, más declaración explícita en B11.",
    disclosures: [
      {
        code: "B8",
        title: "Fuerza laboral — características generales",
        module: "Básico",
        fields: [
          { key: "B8.total", label: "Plantilla total", type: "number", unit: "headcount" },
          { key: "B8.indefinidos", label: "Contratos indefinidos", type: "number", unit: "personas" },
          { key: "B8.temporales", label: "Contratos temporales", type: "number", unit: "personas" },
          { key: "B8.mujeres", label: "Mujeres en plantilla", type: "number", unit: "personas" },
          { key: "B8.hombres", label: "Hombres en plantilla", type: "number", unit: "personas" },
          { key: "B8.rotacion", label: "Rotación de personal", type: "number", unit: "%" },
        ],
      },
      {
        code: "B9",
        title: "Fuerza laboral — salud y seguridad",
        module: "Básico",
        sfdr: "Tasa de accidentes",
        fields: [
          { key: "B9.accidentes", label: "Accidentes laborales registrables", type: "number", unit: "nº", evidence: true },
          { key: "B9.tasa", label: "Tasa de accidentes", type: "number", unit: "por millón de horas" },
          { key: "B9.fallecimientos", label: "Fallecimientos por accidente o enfermedad profesional", type: "number", unit: "nº" },
        ],
      },
      {
        code: "B10",
        title: "Fuerza laboral — remuneración, negociación colectiva y formación",
        module: "Básico",
        sfdr: "Brecha salarial de género no ajustada",
        fields: [
          {
            key: "B10.salario_minimo",
            label: "¿Se paga a toda la plantilla al menos el salario mínimo aplicable?",
            type: "select",
            options: ["Sí", "No"],
          },
          { key: "B10.brecha", label: "Brecha salarial de género no ajustada", type: "number", unit: "%" },
          { key: "B10.convenio", label: "Plantilla cubierta por negociación colectiva", type: "number", unit: "%" },
          { key: "B10.formacion", label: "Horas medias de formación por empleado", type: "number", unit: "h/año" },
        ],
      },
      {
        code: "B11",
        title: "Condenas y multas por corrupción y soborno",
        module: "Básico",
        fields: [
          { key: "B11.condenas", label: "Número de condenas en el período", type: "number", unit: "nº" },
          { key: "B11.multas", label: "Importe total de multas", type: "number", unit: "{MONEDA}" },
          { key: "B11.detalle", label: "Detalle y medidas correctoras adoptadas", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: 3,
    code: "N3",
    name: "Módulo Básico completado",
    tagline: "Cierra tu informe básico",
    option: "OPCIÓN A",
    minutes: 150,
    who: "Responsable técnico o ambiental",
    obtains: "Tu informe VSME — Módulo Básico descargable, suficiente como mínimo para cualquier empresa no cotizada.",
    needs: "Permisos y licencias ambientales, coordenadas de tus sedes y descripción de tus iniciativas de sostenibilidad.",
    mistake:
      "Describir intenciones como políticas. Si no hay una política aprobada, decláralo así e indica la iniciativa prevista.",
    gate: "Cero campos obligatorios pendientes y cada omisión justificada en el registro que se declara en B1.",
    disclosures: [
      {
        code: "B2",
        title: "Prácticas, políticas e iniciativas futuras de transición",
        module: "Básico",
        fields: [
          { key: "B2.practicas", label: "Prácticas y políticas vigentes", type: "textarea" },
          { key: "B2.certificaciones", label: "Certificaciones o sistemas de gestión (ej. ISO 14001)", type: "text" },
          { key: "B2.iniciativas", label: "Iniciativas futuras comprometidas", type: "textarea" },
        ],
      },
      {
        code: "B4",
        title: "Contaminación de aire, agua y suelo",
        module: "Básico",
        sfdr: "Contaminantes atmosféricos · Vertidos al agua · Contaminantes inorgánicos · Sustancias que agotan el ozono",
        gate: {
          key: "B4.obligado",
          label: "¿Estás obligado a reportar contaminantes a un registro público de emisiones?",
        },
        fields: [
          { key: "B4.aire", label: "Contaminantes emitidos al aire", type: "textarea", unit: "t" },
          { key: "B4.agua", label: "Contaminantes vertidos al agua", type: "textarea", unit: "t" },
          { key: "B4.suelo", label: "Contaminantes liberados al suelo", type: "textarea", unit: "t" },
        ],
      },
      {
        code: "B5",
        title: "Biodiversidad",
        module: "Básico",
        sfdr: "Actividades que afectan negativamente a áreas sensibles en biodiversidad",
        gate: {
          key: "B5.aplica",
          label: "¿Alguna sede se ubica en o cerca de un área sensible en biodiversidad?",
        },
        fields: [
          { key: "B5.sedes", label: "Sedes en o cerca de áreas sensibles en biodiversidad", type: "textarea" },
          { key: "B5.uso_suelo", label: "Uso total del suelo", type: "number", unit: "ha" },
          { key: "B5.sellado", label: "Superficie sellada", type: "number", unit: "ha" },
        ],
      },
    ],
  },
  {
    id: 4,
    code: "N4",
    name: "Estrategia y clima",
    tagline: "Pon rumbo: objetivos y riesgos climáticos",
    option: "OPCIÓN B",
    minutes: 240,
    who: "Dirección, con apoyo técnico",
    obtains: "Objetivos de reducción defendibles ante un banco y tu mapa de riesgo climático físico y de transición.",
    needs: "Tu inventario del Nivel 1 cerrado, plan de inversiones y ubicación exacta de activos críticos.",
    mistake: "Fijar un objetivo sin año base verificado. La app lo bloquea a propósito.",
    gate: "Objetivos con año base, año objetivo, alcances cubiertos y acciones; riesgos climáticos con horizonte temporal.",
    disclosures: [
      {
        code: "C1",
        title: "Estrategia: modelo de negocio e iniciativas de sostenibilidad",
        module: "Completo",
        fields: [
          { key: "C1.modelo", label: "Descripción del modelo de negocio", type: "textarea" },
          { key: "C1.productos", label: "Grupos significativos de productos y servicios", type: "textarea" },
          { key: "C1.mercados", label: "Mercados y grupos de clientes principales", type: "textarea" },
          { key: "C1.grupos_interes", label: "Relaciones clave con grupos de interés", type: "textarea" },
        ],
      },
      {
        code: "C2",
        title: "Prácticas, políticas e iniciativas futuras (ampliado)",
        module: "Completo",
        fields: [
          { key: "C2.objetivos_politicas", label: "Objetivos de las políticas y avance medido", type: "textarea" },
          { key: "C2.responsable", label: "Nivel de responsabilidad interna de la política", type: "text" },
        ],
      },
      {
        code: "C3",
        title: "Objetivos de reducción de GEI y transición climática",
        module: "Completo",
        sfdr: "Inversiones en empresas sin iniciativas de reducción de emisiones de carbono",
        gate: { key: "C3.tiene_objetivo", label: "¿Has establecido objetivos de reducción de GEI?" },
        fields: [
          { key: "C3.ano_base", label: "Año base", type: "number" },
          { key: "C3.valor_base", label: "Valor del año base", type: "number", unit: "tCO2e" },
          { key: "C3.ano_objetivo", label: "Año objetivo", type: "number" },
          { key: "C3.valor_objetivo", label: "Valor del año objetivo", type: "number", unit: "tCO2e" },
          { key: "C3.alcances", label: "Alcances cubiertos por el objetivo y su cuota", type: "text", hint: "Alcance 1 y 2 en valores absolutos; Alcance 3 si existe objetivo." },
          { key: "C3.acciones", label: "Acciones principales para alcanzar el objetivo", type: "textarea" },
          {
            key: "C3.plan_transicion",
            label: "Plan de transición para la mitigación del cambio climático",
            type: "select",
            options: ["Adoptado", "No adoptado, con fecha prevista", "No aplica: no opera en sector de alto impacto"],
            hint: HIGH_IMPACT_NACE,
          },
          {
            key: "C3.plan_detalle",
            label: "Detalle del plan o fecha prevista de adopción",
            type: "textarea",
            dependsOn: { key: "C3.plan_transicion", equals: ["Adoptado", "No adoptado, con fecha prevista"] },
          },
        ],
      },
      {
        code: "C4",
        title: "Riesgos climáticos",
        module: "Completo",
        gate: { key: "C4.identificados", label: "¿Has identificado peligros climáticos o eventos de transición?" },
        fields: [
          { key: "C4.peligros", label: "Peligros climáticos identificados", type: "textarea" },
          { key: "C4.transicion", label: "Eventos de transición identificados", type: "textarea" },
          { key: "C4.exposicion", label: "Método de evaluación de exposición y sensibilidad de activos, actividades y cadena de valor", type: "textarea" },
          {
            key: "C4.horizonte",
            label: "Horizontes temporales",
            type: "select",
            options: ["Corto plazo", "Medio plazo", "Largo plazo", "Corto, medio y largo plazo"],
          },
          {
            key: "C4.magnitud",
            label: "Valoración del riesgo",
            type: "select",
            options: ["Alto", "Medio", "Bajo"],
          },
          { key: "C4.adaptacion", label: "Acciones de adaptación emprendidas", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: 5,
    code: "N5",
    name: "Grado inversión",
    tagline: "Listo para bancos e inversores",
    option: "OPCIÓN B",
    minutes: 360,
    who: "Dirección con revisión legal",
    obtains: "El paquete OPCIÓN B completo, con el mapeo a los indicadores SFDR que usa tu entidad financiera.",
    needs: "Desglose de ingresos por línea de negocio, composición del órgano de gobierno, políticas de derechos humanos y registro de incidentes.",
    mistake:
      "Omitir el desglose de ingresos de combustibles fósiles entre carbón, petróleo y gas: el desglose es exigido, no opcional.",
    gate: "Cobertura completa del mapeo SFDR del Apéndice C y exportación máquina-legible activa.",
    disclosures: [
      {
        code: "C5",
        title: "Características adicionales de la fuerza laboral",
        module: "Completo",
        fields: [
          { key: "C5.pais", label: "Plantilla por país", type: "textarea" },
          { key: "C5.tiempo_parcial", label: "Plantilla a tiempo parcial", type: "number", unit: "personas" },
          { key: "C5.no_empleados", label: "Trabajadores que no son empleados", type: "number", unit: "personas" },
        ],
      },
      {
        code: "C6",
        title: "Derechos humanos: políticas y procesos",
        module: "Completo",
        fields: [
          {
            key: "C6.politica",
            label: "¿Existe política de derechos humanos o compromiso público?",
            type: "select",
            options: ["Sí", "No"],
          },
          { key: "C6.diligencia", label: "Procesos de debida diligencia implantados", type: "textarea" },
          { key: "C6.canal", label: "Canal de denuncias disponible para la plantilla", type: "textarea" },
        ],
      },
      {
        code: "C7",
        title: "Incidentes graves negativos en derechos humanos",
        module: "Completo",
        gate: { key: "C7.incidentes", label: "¿Se han producido incidentes graves en derechos humanos?" },
        fields: [
          { key: "C7.numero", label: "Número de incidentes graves", type: "number", unit: "nº" },
          { key: "C7.acciones", label: "Acciones correctoras y remediación", type: "textarea" },
        ],
      },
      {
        code: "C8",
        title: "Ingresos de determinados sectores y exclusión de índices de referencia de la UE",
        module: "Completo",
        sfdr: "Exposición a combustibles fósiles, armas controvertidas, tabaco y agroquímicos",
        fields: [
          { key: "C8.armas", label: "Ingresos por armas controvertidas", type: "number", unit: "{MONEDA}", hint: "Minas antipersona, municiones en racimo, armas químicas y biológicas." },
          { key: "C8.tabaco", label: "Ingresos por cultivo y producción de tabaco", type: "number", unit: "{MONEDA}" },
          { key: "C8.carbon", label: "Ingresos derivados del carbón", type: "number", unit: "{MONEDA}" },
          { key: "C8.petroleo", label: "Ingresos derivados del petróleo", type: "number", unit: "{MONEDA}" },
          { key: "C8.gas", label: "Ingresos derivados del gas", type: "number", unit: "{MONEDA}" },
          { key: "C8.agroquimicos", label: "Ingresos por plaguicidas y otros agroquímicos", type: "number", unit: "{MONEDA}" },
          {
            key: "C8.exclusion",
            label: "¿Está excluida de índices de referencia de la UE alineados con el Acuerdo de París?",
            type: "select",
            options: ["No", "Sí"],
          },
        ],
      },
      {
        code: "C9",
        title: "Ratio de diversidad de género en el órgano de gobierno",
        module: "Completo",
        gate: { key: "C9.existe", label: "¿Existe un órgano de gobierno formalmente constituido?" },
        fields: [
          { key: "C9.mujeres", label: "Miembros mujeres del órgano de gobierno", type: "number", unit: "nº" },
          { key: "C9.hombres", label: "Miembros hombres del órgano de gobierno", type: "number", unit: "nº" },
        ],
      },
    ],
  },
];

export const ALL_FIELDS = LEVELS.flatMap((l) =>
  l.disclosures.flatMap((d) => d.fields.map((f) => ({ ...f, level: l.id, disclosure: d.code })))
);

export function levelById(id: number) {
  return LEVELS.find((l) => l.id === id);
}

/** Correspondencias VSME → SFDR declaradas en el Apéndice C del estándar. */
export const SFDR_MAP: { code: string; indicator: string }[] = [
  { code: "B3", indicator: "Cuota de consumo y producción de energía no renovable" },
  { code: "B3", indicator: "Emisiones de GEI y huella de carbono" },
  { code: "B3", indicator: "Intensidad de GEI de las empresas participadas" },
  { code: "B4", indicator: "Contaminantes atmosféricos, vertidos al agua, contaminantes inorgánicos y sustancias que agotan el ozono" },
  { code: "B5", indicator: "Actividades que afectan negativamente a áreas sensibles en biodiversidad" },
  { code: "B7", indicator: "Ratio de residuos peligrosos y radiactivos" },
  { code: "B9", indicator: "Tasa de accidentes" },
  { code: "B10", indicator: "Brecha salarial de género no ajustada" },
  { code: "C3", indicator: "Inversiones en empresas sin iniciativas de reducción de emisiones de carbono" },
  { code: "C8", indicator: "Exposición a combustibles fósiles, armas controvertidas, tabaco y agroquímicos" },
];

export const TECH_REQUIREMENTS = [
  {
    level: 0,
    model: "Entidad Undertaking con NACE multivalor, geolocalización por sede y jerarquía matriz-subsidiaria",
    calc: "Motor de reglas que marca alto impacto climático según NACE A–H y L",
    integrations: "Registro mercantil, validación de NACE",
    audit: "Documento constitutivo cargado",
    export: "Ficha de empresa (PDF)",
  },
  {
    level: 1,
    model: "Series temporales por sede, vector energético y período de facturación; unidades canónicas kWh/m³/t",
    calc: "Factores de emisión versionados por año y país; Alcance 1/2 location y market-based; intensidad por facturación",
    integrations: "Lectura de facturas, API de comercializadoras, plantilla Excel/CSV",
    audit: "Adjunto obligatorio por registro, hash del archivo y log de cambios",
    export: "JSON/CSV por datapoint, preparado para XBRL",
  },
  {
    level: 2,
    model: "Registro de plantilla por contrato, género y país; incidentes de SST; tramos salariales",
    calc: "Tasa de accidentes, brecha salarial no ajustada, cobertura de convenio, formación per cápita",
    integrations: "Nómina, RRHH, registro de siniestralidad",
    audit: "Segregación de datos personales y agregación mínima antes de mostrar",
    export: "Bloque social SFDR",
  },
  {
    level: 3,
    model: "Catálogo de contaminantes ligado a obligación de reporte; capa geoespacial de áreas protegidas",
    calc: "Superposición de sedes con capas protegidas; uso del suelo en hectáreas",
    integrations: "Capas geoespaciales de áreas protegidas, registros de emisiones",
    audit: "Registro de omisiones con motivo, vinculado a B1",
    export: "Informe VSME OPCIÓN A (PDF, DOCX, HTML)",
  },
  {
    level: 4,
    model: "Objetos Target y ClimateRisk con horizonte, exposición, sensibilidad y acción de adaptación",
    calc: "Validación de coherencia objetivo-inventario, trayectoria y brecha",
    integrations: "Bases de escenarios climáticos y datos geofísicos por ubicación",
    audit: "Versionado de objetivos e historial del plan de transición",
    export: "Bloque climático con narrativa estructurada",
  },
  {
    level: 5,
    model: "Desglose de ingresos por sector sensible; GovernanceBody con composición por género; registro de incidentes",
    calc: "Ratio de género, porcentaje de ingresos por sector excluido, chequeo de exclusión de índices",
    integrations: "ERP y contabilidad, registro de gobierno corporativo",
    audit: "Pista de auditoría completa, control de acceso por rol, preparación para aseguramiento limitado",
    export: "Informe OPCIÓN B, API y portal de acceso para bancos e inversores",
  },
];

export const DESIGN_PATTERNS = [
  {
    title: "Ruta por niveles con progreso visible",
    body: "Barra de seis segmentos siempre presente. Cada nivel queda bloqueado hasta cumplir la puerta de salida del anterior, salvo el Nivel 2, abordable en paralelo al Nivel 1 porque depende de otra área funcional.",
  },
  {
    title: "Sesión corta por defecto",
    body: "Bloques de 10 a 15 minutos, uno por divulgación, con guardado automático y reanudación en el campo abandonado. Nunca un formulario con B1 a B11 en una sola página.",
  },
  {
    title: "Preguntas condicionales agresivas",
    body: "Una pregunta filtro abre o cierra bloques enteros: sin obligación de reporte a un registro de emisiones, B4 se colapsa a una declaración; sin órgano de gobierno, C9 se marca como no aplicable con constancia.",
  },
  {
    title: "Captura por evidencia, no por formulario",
    body: "El usuario sube una factura y la app propone el valor; la persona valida en lugar de transcribir. Cada confirmación construye la pista de auditoría sin trabajo adicional.",
  },
  {
    title: "Reutilización en cascada",
    body: "Los datos del Nivel 0 y 1 prellenan el Nivel 4 (año base, ubicaciones) y el Nivel 5 (ingresos). La app muestra el dato heredado de forma explícita.",
  },
  {
    title: "Modo «no lo sé» con salida limpia",
    body: "Tres respuestas válidas en todo campo: valor, no aplica con motivo, o pendiente con responsable asignado. El campo en blanco deja de ser un estado posible.",
  },
  {
    title: "Traducción de jerga en el punto de uso",
    body: "Cada término normativo lleva glosario emergente con la definición del estándar y un ejemplo del sector del usuario derivado de su NACE. Sin documentación aparte.",
  },
  {
    title: "Señal de valor externo",
    body: "Junto a cada divulgación, una etiqueta indica quién la pide: solicitado por bancos (SFDR), habitual en licitaciones, requisito de cliente grande.",
  },
  {
    title: "Invitación colaborativa por rol",
    body: "Delegación de bloques concretos a gestoría, RRHH o responsable técnico, con acceso limitado a ese bloque.",
  },
  {
    title: "Preparación de aseguramiento desde el inicio",
    body: "Aunque el VSME es voluntario, cada dato se trata como auditable: origen, autor, fecha y versión.",
  },
];

export const ANTI_PATTERNS = [
  ["Formulario único con las 20 divulgaciones", "Abandono en la primera sesión", "Bloques de 10–15 minutos por divulgación"],
  ["Exigir Alcance 3 en niveles iniciales", "Parálisis en micro-empresas", "Alcance 3 solo si existe objetivo en C3"],
  ["Informe descargable solo al 100 %", "Ningún valor percibido durante semanas", "Entregable parcial en cada nivel"],
  ["Terminología EFRAG sin traducir", "Respuestas incorrectas de buena fe", "Glosario contextual con ejemplo sectorial"],
  ["Tratar el Módulo Completo como obligatorio", "Rechazo del producto", "OPCIÓN B como desbloqueo de acceso a financiación"],
];
