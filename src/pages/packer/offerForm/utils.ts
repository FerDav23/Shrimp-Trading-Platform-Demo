import type {
  PriceTier,
  QualityRequirement,
  ProductForm,
  Adjustment,
  PaymentTerm,
  Offer,
  PackingCompany,
} from '../../../types';
import type { OfferFormType, OfferFormData } from './types';
import type { QualityRequirementOption } from './types';
import { REQUISITOS_CALIDAD_BD } from './constants';
import { GUARANTIA_CLASE_A_MIN, GUARANTIA_CLASE_A_MAX, VIGENCIA_MAX_DIAS } from './constants';
import { buildPriceTiersFromTallas } from './utils-tallas';

export { buildPriceTiersFromTallas, parseTalla, formatTalla } from './utils-tallas';

export const mergePriceTiersWithTallas = (
  formType: OfferFormType,
  existingTiers: PriceTier[]
): PriceTier[] => {
  const baseTiers = buildPriceTiersFromTallas(formType);
  const byKey = new Map(existingTiers.map((t) => [`${t.sizeMin}/${t.sizeMax}`, t]));
  return baseTiers.map((tier) => {
    const key = `${tier.sizeMin}/${tier.sizeMax}`;
    const existing = byKey.get(key);
    return existing ? { ...tier, price: existing.price, isActive: existing.isActive } : tier;
  });
};

export const getQualityRequirementsFromSelected = (
  selectedIds: string[]
): QualityRequirement[] => {
  return selectedIds
    .map((id) => REQUISITOS_CALIDAD_BD.find((r) => r.id === id))
    .filter((r): r is QualityRequirementOption => r != null)
    .map((r) => ({ code: r.code, text: r.text }));
};

export const getSelectedQualityIdsFromOffer = (
  qualityRequirements: QualityRequirement[]
): string[] => {
  const codes = new Set(qualityRequirements.map((q) => q.code.trim()).filter(Boolean));
  return REQUISITOS_CALIDAD_BD.filter((r) => codes.has(r.code)).map((r) => r.id);
};

export const getPriceUnitForForm = (formType: OfferFormType): 'PER_LB' | 'PER_KG' =>
  formType === 'ENTERO' ? 'PER_KG' : 'PER_LB';

export const getPriceUnitLabel = (formType: OfferFormType): string =>
  formType === 'ENTERO' ? 'Por kilogramo' : 'Por libra';

export const getTodayISO = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const isVigenciaExpired = (validTo: string): boolean => {
  if (!validTo) return false;
  return validTo < getTodayISO();
};

export const getOfferLabel = (type: OfferFormType): string => {
  const labels: Partial<Record<OfferFormType, string>> = {
    ENTERO: 'Entero',
    COLA_DIRECTA: 'Cola Directa',
  };
  return labels[type] ?? type;
};

export const createEmptyOfferForm = (productForm: ProductForm): OfferFormData => ({
  productForm,
  priceUnit: getPriceUnitForForm(productForm as OfferFormType),
  validFrom: getTodayISO(),
  validTo: getTodayISO(),
  plantCity: '',
  plantAddress: '',
  logisticsTolerancePct: '10',
  isVisible: false,
  priceTiers: buildPriceTiersFromTallas(productForm as OfferFormType),
  selectedQualityRequirementIds: [],
  adjustments: [
    { type: 'CLASS_DISCOUNT', appliesToClass: 'B', amount: 0, unit: 'USD' },
    { type: 'CLASS_DISCOUNT', appliesToClass: 'C', amount: 0, unit: 'USD' },
  ],
  guaranteeClassAPct: '',
  paymentTerms: [
    { termType: 'ADVANCE', percent: 30, dueInHours: 24, trigger: '' },
    { termType: 'BALANCE', dueInDays: 7, trigger: '' },
  ],
  enteroAdjustmentsMode: 'CLASS',
  colaDirectaTiers: buildPriceTiersFromTallas('COLA_DIRECTA'),
  ventaLocalPrices: { quebrado: 0, rojo: 0, juvenil: 0 },
  additionalConditions: [],
  quantityRangeMin: undefined,
  quantityRangeMax: undefined,
});

/** Input numérico con decimales: solo dígitos y un ".", sin "-". */
export const sanitizePositiveDecimalInput = (raw: string): string => {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  const rawInt = parts[0] ?? '';
  const intPart =
    rawInt.length > 1 ? rawInt.replace(/^0+/, '') || '0' : rawInt === '' ? '0' : rawInt;
  const decPart = parts.length > 1 ? parts.slice(1).join('').slice(0, 2) : '';
  if (parts.length > 1) return decPart === '' ? `${intPart}.` : `${intPart}.${decPart}`;
  return intPart;
};

export const toPositiveDecimal = (
  value: string,
  opts?: { min?: number; max?: number }
): number => {
  const s = sanitizePositiveDecimalInput(value);
  const n = parseFloat(s);
  if (Number.isNaN(n) || n < 0) return opts?.min ?? 0;
  const min = opts?.min ?? 0;
  const max = opts?.max ?? Infinity;
  const clamped = Math.max(min, Math.min(max, n));
  return Math.round(clamped * 100) / 100;
};

/** Input numérico solo enteros positivos: dígitos únicamente, sin ceros a la izquierda (01 → 1). */
export const sanitizePositiveIntegerInput = (raw: string): string => {
  const cleaned = raw.replace(/\D/g, '');
  if (cleaned === '') return '';
  return cleaned.length > 1 ? cleaned.replace(/^0+/, '') || '0' : cleaned;
};

export const toPositiveInteger = (
  value: string,
  opts?: { min?: number; max?: number }
): number => {
  const s = sanitizePositiveIntegerInput(value);
  if (s === '') return opts?.min ?? 0;
  const n = parseInt(s, 10);
  if (Number.isNaN(n) || n < 0) return opts?.min ?? 0;
  const min = opts?.min ?? 0;
  const max = opts?.max ?? Infinity;
  return Math.max(min, Math.min(max, Math.floor(n)));
};

/** En inputs de precios: permite "." pero no "-" ni "e"/"E". */
export const blockNegativeAndExponentKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['-', 'e', 'E'].includes(e.key)) e.preventDefault();
};

export const getVigenciaDias = (validFrom: string, validTo: string): number | null => {
  if (!validFrom || !validTo) return null;
  const from = new Date(validFrom);
  const to = new Date(validTo);
  const diffMs = to.getTime() - from.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const isVigenciaValid = (data: OfferFormData): boolean => {
  const from = getTodayISO();
  if (!data.validTo) return false;
  const dias = getVigenciaDias(from, data.validTo);
  if (dias == null || dias < 0) return false;
  return dias <= VIGENCIA_MAX_DIAS;
};

export const isFormComplete = (data: OfferFormData): boolean => {
  if (
    !data.validTo ||
    !data.plantCity ||
    !data.plantAddress ||
    !data.logisticsTolerancePct
  ) {
    return false;
  }
  if (!isVigenciaValid(data)) return false;
  const hasValidPriceTiers =
    data.priceTiers.length > 0 &&
    data.priceTiers.some((t) => t.sizeMin > 0 && t.sizeMax > 0 && t.price > 0);
  const hasValidQualityReqs = data.selectedQualityRequirementIds.length > 0;
  const advanceTerm = data.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const hasValidPaymentTerms =
    !!advanceTerm && (advanceTerm.percent ?? 0) > 0 && (advanceTerm.percent ?? 0) < 100;
  const customTerms = data.paymentTerms.filter((p) => p.termType === 'CUSTOM');
  const hasValidCustomTerms =
    customTerms.length === 0 ||
    customTerms.every((t) => (t.text ?? '').trim() !== '');
  const hasValidGuarantee = (() => {
    const n = Number(data.guaranteeClassAPct);
    return (
      data.guaranteeClassAPct !== '' &&
      !Number.isNaN(n) &&
      n >= GUARANTIA_CLASE_A_MIN &&
      n <= GUARANTIA_CLASE_A_MAX
    );
  })();
  const hasValidColaDirecta =
    data.productForm !== 'ENTERO' ||
    data.enteroAdjustmentsMode !== 'COLA_DIRECTA_TABLE' ||
    data.colaDirectaTiers.some((t) => t.price > 0);
  /** Descuentos por clase: obligatorio. Si Ajuste por clase está activado (ENTERO) o form COLA_DIRECTA, Clase B es obligatoria. */
  const adjustmentB = data.adjustments.find((a) => a.appliesToClass === 'B');
  const hasValidAdjustments =
    data.productForm !== 'ENTERO' &&
    data.productForm !== 'COLA_DIRECTA'
      ? true
      : data.productForm === 'COLA_DIRECTA'
        ? (adjustmentB?.amount ?? 0) > 0
        : data.enteroAdjustmentsMode === 'CLASS'
          ? (adjustmentB?.amount ?? 0) > 0
          : true;
  const hasValidAdditionalConditions =
    data.additionalConditions.length === 0 ||
    data.additionalConditions.every((s) => s.trim() !== '');
  return (
    hasValidPriceTiers &&
    hasValidQualityReqs &&
    hasValidPaymentTerms &&
    hasValidCustomTerms &&
    hasValidGuarantee &&
    hasValidColaDirecta &&
    hasValidAdjustments &&
    hasValidAdditionalConditions
  );
};

export const getIncompleteSections = (data: OfferFormData): string[] => {
  const sections: string[] = [];
  if (
    !data.validTo ||
    !data.plantCity ||
    !data.plantAddress ||
    !data.logisticsTolerancePct
  ) {
    sections.push(
      'Información General (vigencia hasta, ciudad, dirección, tolerancia logística)'
    );
  }
  if (data.validTo && !isVigenciaValid(data)) {
    sections.push(
      `Vigencia de la oferta (el período entre las dos fechas no puede superar ${VIGENCIA_MAX_DIAS} días)`
    );
  }
  const hasValidGuarantee = (() => {
    const n = Number(data.guaranteeClassAPct);
    return (
      data.guaranteeClassAPct !== '' &&
      !Number.isNaN(n) &&
      n >= GUARANTIA_CLASE_A_MIN &&
      n <= GUARANTIA_CLASE_A_MAX
    );
  })();
  if (!hasValidGuarantee) {
    sections.push(
      `Información General (garantía clase A obligatoria: entre ${GUARANTIA_CLASE_A_MIN}% y ${GUARANTIA_CLASE_A_MAX}%)`
    );
  }
  const hasValidPriceTiers =
    data.priceTiers.length > 0 &&
    data.priceTiers.some((t) => t.sizeMin > 0 && t.sizeMax > 0 && t.price > 0);
  if (!hasValidPriceTiers) {
    sections.push('Tabla de Precios (al menos una talla con precio válido)');
  }
  const hasValidQualityReqs = data.selectedQualityRequirementIds.length > 0;
  if (!hasValidQualityReqs) {
    sections.push('Requisitos de Calidad (seleccione al menos un requisito)');
  }
  const advanceTerm = data.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const hasValidPaymentTerms =
    !!advanceTerm && (advanceTerm.percent ?? 0) > 0 && (advanceTerm.percent ?? 0) < 100;
  if (!hasValidPaymentTerms) {
    sections.push('Términos de Pago (anticipo con porcentaje entre 1 y 99%)');
  }
  const customTerms = data.paymentTerms.filter((p) => p.termType === 'CUSTOM');
  const hasValidCustomTerms =
    customTerms.length === 0 ||
    customTerms.every((t) => (t.text ?? '').trim() !== '');
  if (!hasValidCustomTerms) {
    sections.push('Términos de Pago (los términos adicionales no pueden estar vacíos)');
  }
  if (
    data.productForm === 'ENTERO' &&
    data.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE' &&
    !data.colaDirectaTiers.some((t) => t.price > 0)
  ) {
    sections.push(
      'Descuentos por clase (Tablas de Cola Directa: al menos una talla con precio obligatoria)'
    );
  }
  const adjustmentB = data.adjustments.find((a) => a.appliesToClass === 'B');
  const needsClassB =
    (data.productForm === 'COLA_DIRECTA' && ((adjustmentB?.amount ?? 0) <= 0)) ||
    (data.productForm === 'ENTERO' &&
      data.enteroAdjustmentsMode === 'CLASS' &&
      (adjustmentB?.amount ?? 0) <= 0);
  if (needsClassB) {
    sections.push(
      'Descuentos por clase (Clase B es obligatoria cuando Ajuste por clase está activado)'
    );
  }
  if (
    data.additionalConditions.length > 0 &&
    data.additionalConditions.some((s) => s.trim() === '')
  ) {
    sections.push(
      'Condiciones adicionales (no puede haber items vacíos; complete o elimine las filas vacías)'
    );
  }
  return sections;
};

export const buildPreviewOffer = (
  data: OfferFormData,
  packingCompany: PackingCompany,
  productFormLabel: string
): Offer => {
  const advanceTerm = data.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const advancePercent = advanceTerm?.percent ?? 0;
  const paymentTerms = data.paymentTerms.map((t) => {
    if (t.termType === 'BALANCE') {
      return { ...t, percent: 100 - advancePercent };
    }
    return t;
  });
  const adjustmentsWithValue = data.adjustments.filter((a) => a.amount > 0);
  return {
    id: 'preview',
    offerCode: `${productFormLabel} - Vista previa`,
    packingCompany,
    productForm: data.productForm,
    currency: 'USD',
    priceUnit: data.priceUnit,
    validFrom: getTodayISO(),
    validTo: data.validTo,
    plantLocation: { city: data.plantCity, address: data.plantAddress },
    logisticsTolerancePct: Number(data.logisticsTolerancePct) || 0,
    status: 'PUBLISHED',
    priceTiers: data.priceTiers.filter((t) => t.isActive && t.price > 0),
    qualityRequirements: getQualityRequirementsFromSelected(
      data.selectedQualityRequirementIds
    ),
    classDefinitions: [],
    paymentTerms,
    guaranteeClassAPct:
      data.guaranteeClassAPct !== '' ? Number(data.guaranteeClassAPct) : undefined,
    adjustments: adjustmentsWithValue,
    enteroAdjustmentsMode:
      data.productForm === 'ENTERO' ? data.enteroAdjustmentsMode : undefined,
    colaDirectaPriceTiers:
      data.productForm === 'ENTERO' && data.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE'
        ? data.colaDirectaTiers.filter((t) => t.price > 0)
        : undefined,
    ventaLocalPrices:
      data.productForm === 'ENTERO' && data.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE'
        ? data.ventaLocalPrices
        : undefined,
    additionalConditions: data.additionalConditions.filter((s) => s.trim() !== ''),
    quantityRangeMin: data.quantityRangeMin,
    quantityRangeMax: data.quantityRangeMax,
  };
};

export const mergeAdjustments = (existing: Adjustment[]): Adjustment[] => {
  const byClass = Object.fromEntries(existing.map((a) => [a.appliesToClass, a]));
  return (['B', 'C'] as const).map(
    (cls) =>
      byClass[cls] ?? {
        type: 'CLASS_DISCOUNT' as const,
        appliesToClass: cls,
        amount: 0,
        unit: 'USD' as const,
      }
  );
};

export const mergePaymentTerms = (existing: PaymentTerm[]): PaymentTerm[] => {
  const advance =
    existing.find((p) => p.termType === 'ADVANCE') ?? {
      termType: 'ADVANCE' as const,
      percent: 30,
      dueInHours: 24,
      trigger: '',
    };
  const rawBalance = existing.find((p) => p.termType === 'BALANCE');
  const balance = rawBalance
    ? {
        ...rawBalance,
        dueInHours:
          rawBalance.dueInHours ?? (rawBalance.dueInDays ? rawBalance.dueInDays * 24 : 168),
        dueInDays: rawBalance.dueInDays ?? (rawBalance.dueInHours != null ? Math.floor(rawBalance.dueInHours / 24) : 7),
      }
    : { termType: 'BALANCE' as const, dueInDays: 7, trigger: '' };
  const custom = existing.filter(
    (p) => p.termType !== 'ADVANCE' && p.termType !== 'BALANCE'
  );
  return [
    advance,
    balance,
    ...custom.map((c) => ({ termType: 'CUSTOM' as const, text: c.text ?? '' })),
  ];
};

/** Construye OfferFormData inicial para un tipo de oferta, a partir de una oferta existente o vacía */
export const getInitialFormData = (
  formType: OfferFormType,
  existingOffer?: Offer
): OfferFormData => {
  if (existingOffer) {
    return {
      productForm: existingOffer.productForm,
      priceUnit: getPriceUnitForForm(formType),
      validFrom: getTodayISO(),
      validTo: getTodayISO(),
      plantCity: existingOffer.plantLocation.city,
      plantAddress: existingOffer.plantLocation.address,
      logisticsTolerancePct: String(existingOffer.logisticsTolerancePct),
      isVisible:
        existingOffer.status === 'PUBLISHED' && !isVigenciaExpired(existingOffer.validTo),
      priceTiers: mergePriceTiersWithTallas(formType, existingOffer.priceTiers),
      selectedQualityRequirementIds: getSelectedQualityIdsFromOffer(
        existingOffer.qualityRequirements
      ),
      adjustments: mergeAdjustments(existingOffer.adjustments),
      paymentTerms: mergePaymentTerms(existingOffer.paymentTerms),
      guaranteeClassAPct:
        existingOffer.guaranteeClassAPct != null
          ? String(existingOffer.guaranteeClassAPct)
          : '',
      enteroAdjustmentsMode: existingOffer.enteroAdjustmentsMode ?? 'CLASS',
      colaDirectaTiers:
        existingOffer.colaDirectaPriceTiers?.length
          ? mergePriceTiersWithTallas('COLA_DIRECTA', existingOffer.colaDirectaPriceTiers)
          : buildPriceTiersFromTallas('COLA_DIRECTA'),
      ventaLocalPrices: existingOffer.ventaLocalPrices ?? {
        quebrado: 0,
        rojo: 0,
        juvenil: 0,
      },
      additionalConditions: existingOffer.additionalConditions ?? [],
      quantityRangeMin: existingOffer.quantityRangeMin,
      quantityRangeMax: existingOffer.quantityRangeMax,
    };
  }
  return createEmptyOfferForm(formType);
};
