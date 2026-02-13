import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { FormRow } from '../../components/FormRow';
import { Alert } from '../../components/Alert';
import {
  ProductForm,
  PriceTier,
  QualityRequirement,
  Adjustment,
  PaymentTerm,
  Offer,
  PackingCompany,
} from '../../types';
import { Modal } from '../../components/Modal';
import { OfferPreviewContent } from '../../components/OfferPreviewContent';

type OfferFormType = ProductForm;

/** Tallas estándar por tipo de producto (temporal: luego se cargarán desde BD) */
const TALLAS_POR_PRODUCTO: Partial<Record<OfferFormType, string[]>> = {
  ENTERO: ['20/30', '30/40', '40/50', '50/60', '60/70', '70/80', '80/100', '100/120'],
  COLA_DIRECTA: ['16/20', '21/25', '26/30', '31/35', '36/40', '41/50', '51/60', '61/70', '71/90'],
};

const parseTalla = (talla: string): { sizeMin: number; sizeMax: number } => {
  const [min, max] = talla.split('/').map(Number);
  return { sizeMin: min || 0, sizeMax: max || 0 };
};

const formatTalla = (sizeMin: number, sizeMax: number): string => `${sizeMin}/${sizeMax}`;

/** Construye priceTiers a partir de las tallas estándar del tipo de producto */
const buildPriceTiersFromTallas = (formType: OfferFormType): PriceTier[] => {
  const tallas = TALLAS_POR_PRODUCTO[formType] ?? [];
  return tallas.map((talla) => {
    const { sizeMin, sizeMax } = parseTalla(talla);
    return { sizeMin, sizeMax, price: 0, isActive: true };
  });
};

/** Fusiona precios existentes con la lista fija de tallas (mantiene precio por talla si coincide) */
const mergePriceTiersWithTallas = (formType: OfferFormType, existingTiers: PriceTier[]): PriceTier[] => {
  const baseTiers = buildPriceTiersFromTallas(formType);
  const byKey = new Map(existingTiers.map((t) => [`${t.sizeMin}/${t.sizeMax}`, t]));
  return baseTiers.map((tier) => {
    const key = formatTalla(tier.sizeMin, tier.sizeMax);
    const existing = byKey.get(key);
    return existing ? { ...tier, price: existing.price, isActive: existing.isActive } : tier;
  });
};

/** Requisito de calidad cargado desde BD (temporal: constante hasta conectar API) */
interface QualityRequirementOption {
  id: string;
  code: string;
  text: string;
}

const REQUISITOS_CALIDAD_BD: QualityRequirementOption[] = [
  { id: 'qc-1', code: 'NO_ARENA', text: 'Sin arena ni impurezas' },
  { id: 'qc-2', code: 'HEADLESS', text: 'Sin cabeza (headless)' },
  { id: 'qc-3', code: 'SIZE_CONSISTENT', text: 'Talla consistente según rango' },
  { id: 'qc-4', code: 'FRESH', text: 'Producto fresco, sin olor a amoníaco' },
  { id: 'qc-5', code: 'GLAZE_MAX', text: 'Glaseado máximo 10%' },
  { id: 'qc-6', code: 'BLACK_SPOT', text: 'Sin black spot superior al estándar' },
  { id: 'qc-7', code: 'PEELED_DEV', text: 'Pelado y desvenado' },
  { id: 'qc-8', code: 'IQF', text: 'Congelación individual (IQF)' },
  { id: 'qc-9', code: 'NET_WEIGHT', text: 'Peso neto según etiqueta (±5%)' },
  { id: 'qc-10', code: 'NO_BROKEN', text: 'Sin colas rotas o dañadas' },
  { id: 'qc-11', code: 'COLOR_STD', text: 'Color estándar del producto' },
  { id: 'qc-12', code: 'PACKAGING', text: 'Empaque en caja master sellada' },
  { id: 'qc-13', code: 'SHELF_LIFE', text: 'Vida útil mínima 12 meses' },
  { id: 'qc-14', code: 'CERT_ORIGIN', text: 'Certificado de origen disponible' },
  { id: 'qc-15', code: 'HACCP', text: 'Procesado en planta HACCP' },
  { id: 'qc-16', code: 'NO_SO2', text: 'Sin adición de sulfitos' },
  { id: 'qc-17', code: 'WILD', text: 'Origen silvestre (wild caught)' },
  { id: 'qc-18', code: 'FARMED', text: 'Origen de cultivo (farmed)' },
];

/** Convierte IDs seleccionados a QualityRequirement[] para la oferta */
const getQualityRequirementsFromSelected = (selectedIds: string[]): QualityRequirement[] => {
  return selectedIds
    .map((id) => REQUISITOS_CALIDAD_BD.find((r) => r.id === id))
    .filter((r): r is QualityRequirementOption => r != null)
    .map((r) => ({ code: r.code, text: r.text }));
};

/** Obtiene IDs seleccionados a partir de qualityRequirements de una oferta existente (por código) */
const getSelectedQualityIdsFromOffer = (qualityRequirements: QualityRequirement[]): string[] => {
  const codes = new Set(qualityRequirements.map((q) => q.code.trim()).filter(Boolean));
  return REQUISITOS_CALIDAD_BD.filter((r) => codes.has(r.code)).map((r) => r.id);
};

/** Modo de ajustes para oferta Entero: por clase (A/B/C) o tabla cola directa */
type EnteroAdjustmentsMode = 'CLASS' | 'COLA_DIRECTA_TABLE';

interface OfferFormData {
  productForm: ProductForm;
  priceUnit: 'PER_LB' | 'PER_KG';
  validFrom: string;
  validTo: string;
  plantCity: string;
  plantAddress: string;
  logisticsTolerancePct: string;
  isVisible: boolean;
  priceTiers: PriceTier[];
  selectedQualityRequirementIds: string[];
  adjustments: Adjustment[];
  paymentTerms: PaymentTerm[];
  guaranteeClassAPct: string;
  /** Solo para ENTERO: elegir ajuste por clase o tabla cola directa */
  enteroAdjustmentsMode: EnteroAdjustmentsMode;
  /** Precios por talla cola directa cuando enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE' */
  colaDirectaTiers: PriceTier[];
  /** Solo ENTERO + COLA_DIRECTA_TABLE: precios venta local (Quebrado, Rojo, Juvenil) */
  ventaLocalPrices: { quebrado: number; rojo: number; juvenil: number };
  /** Condiciones adicionales: items de texto (máx. 100 caracteres cada uno) */
  additionalConditions: string[];
}

/** Unidad de precio fija por tipo de producto: Entero = kg, Cola directa = libras */
const getPriceUnitForForm = (formType: OfferFormType): 'PER_LB' | 'PER_KG' =>
  formType === 'ENTERO' ? 'PER_KG' : 'PER_LB';

const getPriceUnitLabel = (formType: OfferFormType): string =>
  formType === 'ENTERO' ? 'Por kilogramo' : 'Por libra';

const getTodayISO = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Verifica si la fecha hasta es anterior a hoy (vigencia caducada) */
const isVigenciaExpired = (validTo: string): boolean => {
  if (!validTo) return false;
  const today = getTodayISO();
  return validTo < today;
};

const createEmptyOfferForm = (productForm: ProductForm): OfferFormData => ({
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
    { termType: 'BALANCE', dueInHours: 168, trigger: '' },
  ],
  enteroAdjustmentsMode: 'CLASS',
  colaDirectaTiers: buildPriceTiersFromTallas('COLA_DIRECTA'),
  ventaLocalPrices: { quebrado: 0, rojo: 0, juvenil: 0 },
  additionalConditions: [],
});

const getOfferLabel = (type: OfferFormType): string => {
  const labels: Partial<Record<OfferFormType, string>> = {
    ENTERO: 'Entero',
    COLA_DIRECTA: 'Cola Directa',
  };
  return labels[type] ?? type;
};

/** Días máximos permitidos entre fecha desde y hasta en la vigencia de la oferta */
const VIGENCIA_MAX_DIAS = 10;

/** Límite inferior del porcentaje de garantía clase A (temporal: se cargará desde BD) */
const GUARANTIA_CLASE_A_MIN = 80;
const GUARANTIA_CLASE_A_MAX = 100;

/** Límite de caracteres para todos los inputs de texto (string) */
const STRING_INPUT_MAX_LENGTH = 100;

/** Límite para Condición/Trigger en términos de pago */
const TRIGGER_MAX_LENGTH = 50;

/** Input numérico con decimales: solo dígitos y un ".", sin "-". Sin ceros a la izquierda en parte entera (07→7, 010→10) pero permite 0.2, 0.25, etc. */
const sanitizePositiveDecimalInput = (raw: string): string => {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  // Solo quitar ceros a la izquierda si hay más de un dígito (evita "07" pero mantiene "0" y "0." para escribir 0.2)
  const rawInt = parts[0] ?? '';
  const intPart = rawInt.length > 1 ? rawInt.replace(/^0+/, '') || '0' : (rawInt === '' ? '0' : rawInt);
  const decPart = parts.length > 1 ? parts.slice(1).join('').slice(0, 2) : '';
  if (parts.length > 1) return decPart === '' ? `${intPart}.` : `${intPart}.${decPart}`;
  return intPart;
};

/** Parsea a número positivo con decimales. Sin negativos; redondeado a 2 decimales. Opcional min/max. */
const toPositiveDecimal = (value: string, opts?: { min?: number; max?: number }): number => {
  const s = sanitizePositiveDecimalInput(value);
  const n = parseFloat(s);
  if (Number.isNaN(n) || n < 0) return opts?.min ?? 0;
  const min = opts?.min ?? 0;
  const max = opts?.max ?? Infinity;
  const clamped = Math.max(min, Math.min(max, n));
  return Math.round(clamped * 100) / 100;
};

/** En inputs de precios (decimales): permite "." pero no "-" ni "e"/"E". */
const blockNegativeAndExponentKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['-', 'e', 'E'].includes(e.key)) e.preventDefault();
};

/** Estilo de label como subtítulo en FormRow */
const FORM_ROW_SUBTITLE_LABEL = 'block text-sm font-bold text-slate-600 uppercase tracking-wider mb-1.5';

const getVigenciaDias = (validFrom: string, validTo: string): number | null => {
  if (!validFrom || !validTo) return null;
  const from = new Date(validFrom);
  const to = new Date(validTo);
  const diffMs = to.getTime() - from.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

const isVigenciaValid = (data: OfferFormData): boolean => {
  const from = getTodayISO();
  if (!data.validTo) return false;
  const dias = getVigenciaDias(from, data.validTo);
  if (dias == null || dias < 0) return false;
  return dias <= VIGENCIA_MAX_DIAS;
};

const isFormComplete = (data: OfferFormData): boolean => {
  if (
    !data.validTo ||
    !data.plantCity ||
    !data.plantAddress ||
    !data.logisticsTolerancePct
  ) {
    return false;
  }
  if (!isVigenciaValid(data)) return false;
  // Tabla de precios: al menos una talla con precio válido (> 0)
  const hasValidPriceTiers =
    data.priceTiers.length > 0 &&
    data.priceTiers.some(
      (t) => t.sizeMin > 0 && t.sizeMax > 0 && t.price > 0
    );
  // Requisitos de calidad: debe haber al menos uno seleccionado
  const hasValidQualityReqs = data.selectedQualityRequirementIds.length > 0;
  const advanceTerm = data.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const hasValidPaymentTerms = !!advanceTerm && (advanceTerm.percent ?? 0) > 0 && (advanceTerm.percent ?? 0) < 100;
  // Si hay términos adicionales (CUSTOM), ninguno puede estar vacío
  const customTerms = data.paymentTerms.filter((p) => p.termType === 'CUSTOM');
  const hasValidCustomTerms =
    customTerms.length === 0 ||
    customTerms.every((t) => (t.text ?? '').trim() !== '');
  const hasValidGuarantee = (() => {
    const n = Number(data.guaranteeClassAPct);
    return data.guaranteeClassAPct !== '' && !Number.isNaN(n) && n >= GUARANTIA_CLASE_A_MIN && n <= GUARANTIA_CLASE_A_MAX;
  })();
  // Si Ajustes por clase usa tabla Cola Directa, debe haber al menos un precio
  const hasValidColaDirecta =
    data.productForm !== 'ENTERO' ||
    data.enteroAdjustmentsMode !== 'COLA_DIRECTA_TABLE' ||
    data.colaDirectaTiers.some((t) => t.price > 0);
  // Condiciones adicionales: si hay items, ninguno puede estar vacío
  const hasValidAdditionalConditions =
    data.additionalConditions.length === 0 ||
    data.additionalConditions.every((s) => s.trim() !== '');
  return hasValidPriceTiers && hasValidQualityReqs && hasValidPaymentTerms && hasValidCustomTerms && hasValidGuarantee && hasValidColaDirecta && hasValidAdditionalConditions;
};

/** Devuelve las secciones que faltan completar para poder publicar la oferta */
const getIncompleteSections = (data: OfferFormData): string[] => {
  const sections: string[] = [];
  if (
    !data.validTo ||
    !data.plantCity ||
    !data.plantAddress ||
    !data.logisticsTolerancePct
  ) {
    sections.push('Información General (vigencia hasta, ciudad, dirección, tolerancia logística)');
  }
  if (data.validTo && !isVigenciaValid(data)) {
    sections.push(`Vigencia de la oferta (el período entre las dos fechas no puede superar ${VIGENCIA_MAX_DIAS} días)`);
  }
  const hasValidGuarantee = (() => {
    const n = Number(data.guaranteeClassAPct);
    return data.guaranteeClassAPct !== '' && !Number.isNaN(n) && n >= GUARANTIA_CLASE_A_MIN && n <= GUARANTIA_CLASE_A_MAX;
  })();
  if (!hasValidGuarantee) {
    sections.push(`Información General (garantía clase A obligatoria: entre ${GUARANTIA_CLASE_A_MIN}% y ${GUARANTIA_CLASE_A_MAX}%)`);
  }
  const hasValidPriceTiers =
    data.priceTiers.length > 0 &&
    data.priceTiers.some(
      (t) => t.sizeMin > 0 && t.sizeMax > 0 && t.price > 0
    );
  if (!hasValidPriceTiers) {
    sections.push('Tabla de Precios (al menos una talla con precio válido)');
  }
  const hasValidQualityReqs = data.selectedQualityRequirementIds.length > 0;
  if (!hasValidQualityReqs) {
    sections.push('Requisitos de Calidad (seleccione al menos un requisito)');
  }
  const advanceTerm = data.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const hasValidPaymentTerms = !!advanceTerm && (advanceTerm.percent ?? 0) > 0 && (advanceTerm.percent ?? 0) < 100;
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
    sections.push('Ajustes por clase (tabla Cola Directa: debe haber al menos un precio)');
  }
  if (
    data.additionalConditions.length > 0 &&
    data.additionalConditions.some((s) => s.trim() === '')
  ) {
    sections.push('Condiciones adicionales (no puede haber items vacíos; complete o elimine las filas vacías)');
  }
  return sections;
};

/** Construye un Offer para vista previa a partir del formulario y la empacadora */
const buildPreviewOffer = (
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
    qualityRequirements: getQualityRequirementsFromSelected(data.selectedQualityRequirementIds),
    classDefinitions: [],
    paymentTerms,
    guaranteeClassAPct:
      data.guaranteeClassAPct !== ''
        ? Number(data.guaranteeClassAPct)
        : undefined,
    adjustments: adjustmentsWithValue,
    enteroAdjustmentsMode: data.productForm === 'ENTERO' ? data.enteroAdjustmentsMode : undefined,
    colaDirectaPriceTiers:
      data.productForm === 'ENTERO' && data.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE'
        ? data.colaDirectaTiers.filter((t) => t.price > 0)
        : undefined,
    ventaLocalPrices:
      data.productForm === 'ENTERO' && data.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE'
        ? data.ventaLocalPrices
        : undefined,
    additionalConditions: data.additionalConditions.filter((s) => s.trim() !== ''),
  };
};

interface OfferFormSectionProps {
  formType: OfferFormType;
  data: OfferFormData;
  onChange: (data: OfferFormData) => void;
  packingCompany: PackingCompany;
}

const OfferFormSection: React.FC<OfferFormSectionProps> = ({
  formType,
  data,
  onChange,
  packingCompany,
}) => {
  const isLocked = data.isVisible;
  const [showPublishAlert, setShowPublishAlert] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [checklistAccepted, setChecklistAccepted] = useState(false);
  /** Valores numéricos incompletos mientras se escribe (ej. "0." para poder escribir 0.2) */
  const [incompleteNum, setIncompleteNum] = useState<Record<string, string>>({});
  const priceTableSectionRef = useRef<HTMLElement>(null);
  const qualitySectionRef = useRef<HTMLElement>(null);

  const setNumInput = (
    key: string,
    raw: string,
    apply: (n: number | undefined) => void,
    opts?: { max?: number; min?: number; emptyValue?: number | undefined }
  ) => {
    const s = sanitizePositiveDecimalInput(raw);
    if (s === '' || s.endsWith('.')) {
      setIncompleteNum((prev) => (s === '' ? (() => { const next = { ...prev }; delete next[key]; return next; })() : { ...prev, [key]: s }));
      apply(s === '' ? (opts?.emptyValue !== undefined ? opts.emptyValue : 0) : toPositiveDecimal(s, opts));
    } else {
      setIncompleteNum((prev) => { const next = { ...prev }; delete next[key]; return next; });
      apply(toPositiveDecimal(s, opts));
    }
  };
  const numDisplay = (key: string, n: number | undefined): string => incompleteNum[key] ?? (n !== undefined && n !== null ? String(n) : '');

  useLayoutEffect(() => {
    const syncQualityHeight = () => {
      const tableEl = priceTableSectionRef.current;
      const qualityEl = qualitySectionRef.current;
      if (tableEl && qualityEl) {
        qualityEl.style.height = `${tableEl.offsetHeight}px`;
      }
    };
    syncQualityHeight();
    const tableEl = priceTableSectionRef.current;
    if (!tableEl) return;
    const ro = new ResizeObserver(syncQualityHeight);
    ro.observe(tableEl);
    return () => ro.disconnect();
  }, [data.priceTiers.length]);

  // Desactivar automáticamente la oferta si la vigencia ha caducado
  useEffect(() => {
    if (data.isVisible && data.validTo && isVigenciaExpired(data.validTo)) {
      onChange({ ...data, isVisible: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.validTo, data.isVisible]);

  const handleEditAttempt = () => {
    if (isLocked) {
      alert(
        'No puede modificar una oferta visible. Debe despublicar la oferta (desactivar el switch) para poder editarla.'
      );
    }
  };

  const updateData = (updates: Partial<OfferFormData>) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, ...updates });
  };

  const handleVisibilityChange = (checked: boolean) => {
    if (checked && !isFormComplete(data)) {
      setShowPublishAlert(true);
      return;
    }
    if (checked && isFormComplete(data)) {
      setShowPublishAlert(false);
      setChecklistAccepted(false);
      setShowPublishModal(true);
      return;
    }
    setShowPublishAlert(false);
    setShowPublishModal(false);
    onChange({ ...data, isVisible: checked });
  };

  const handleConfirmPublish = () => {
    if (!checklistAccepted) return;
    onChange({ ...data, isVisible: true });
    setShowPublishModal(false);
    setChecklistAccepted(false);
  };

  // Price table: solo el precio es editable (tallas fijas)
  const updatePriceTier = (index: number, field: keyof PriceTier, value: number | boolean) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newTiers = [...data.priceTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onChange({ ...data, priceTiers: newTiers });
  };

  // Requisitos de calidad: marcar/desmarcar (solo los seleccionados se muestran en la oferta)
  const toggleQualityRequirement = (id: string) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const selected = data.selectedQualityRequirementIds.includes(id)
      ? data.selectedQualityRequirementIds.filter((x) => x !== id)
      : [...data.selectedQualityRequirementIds, id];
    onChange({ ...data, selectedQualityRequirementIds: selected });
  };

  // Adjustments handlers (solo amount y unit, clase A/B/C fijas)
  const updateAdjustment = (index: number, field: keyof Adjustment, value: string | number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newAdj = [...data.adjustments];
    newAdj[index] = { ...newAdj[index], [field]: value };
    onChange({ ...data, adjustments: newAdj });
  };

  const updateColaDirectaTier = (index: number, field: keyof PriceTier, value: number | boolean) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newTiers = [...data.colaDirectaTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onChange({ ...data, colaDirectaTiers: newTiers });
  };

  type VentaLocalKey = keyof OfferFormData['ventaLocalPrices'];
  const VENTA_LOCAL_ROWS: { key: VentaLocalKey; label: string }[] = [
    { key: 'quebrado', label: 'Quebrado' },
    { key: 'rojo', label: 'Rojo' },
    { key: 'juvenil', label: 'Juvenil' },
  ];
  const updateVentaLocalPrice = (key: VentaLocalKey, value: number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, ventaLocalPrices: { ...data.ventaLocalPrices, [key]: value } });
  };

  // Payment terms handlers
  const addPaymentTerm = () => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({
      ...data,
      paymentTerms: [
        ...data.paymentTerms,
        { termType: 'CUSTOM', text: '' },
      ],
    });
  };

  const removePaymentTerm = (index: number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    if (index < 2) return;
    const newTerms = data.paymentTerms.filter((_, i) => i !== index);
    onChange({ ...data, paymentTerms: newTerms });
  };

  const updatePaymentTerm = (index: number, field: keyof PaymentTerm, value: string | number | undefined) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newTerms = [...data.paymentTerms];
    newTerms[index] = { ...newTerms[index], [field]: value };
    onChange({ ...data, paymentTerms: newTerms });
  };

  const ADDITIONAL_CONDITION_MAX_LENGTH = 100;
  const addAdditionalCondition = () => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, additionalConditions: [...data.additionalConditions, ''] });
  };
  const updateAdditionalCondition = (index: number, value: string) => {
    if (isLocked) return;
    const trimmed = value.slice(0, ADDITIONAL_CONDITION_MAX_LENGTH);
    const newConditions = [...data.additionalConditions];
    newConditions[index] = trimmed;
    onChange({ ...data, additionalConditions: newConditions });
  };
  const removeAdditionalCondition = (index: number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, additionalConditions: data.additionalConditions.filter((_, i) => i !== index) });
  };

  const inputProps = isLocked ? { readOnly: true, className: 'w-full border border-sky-300 rounded-md px-3 py-2 bg-white/80 cursor-not-allowed text-slate-800' } : { className: 'w-full border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800' };

  return (
    <Card className="mt-2.5 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Oferta - {getOfferLabel(formType)}
        </h2>
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <span className="text-sm font-medium text-gray-700">Oferta publicada</span>
          <div className="relative inline-block">
            <input
              type="checkbox"
              checked={data.isVisible}
              onChange={(e) => handleVisibilityChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-600 transition-colors" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm border border-gray-200 transition-all peer-checked:left-6" />
          </div>
        </label>
      </div>

      {showPublishAlert && (
        <Alert
          variant="warning"
          title="No se puede publicar la oferta"
          description="Complete las siguientes secciones para activar el switch de oferta publicada:"
          items={getIncompleteSections(data)}
          onDismiss={() => setShowPublishAlert(false)}
          className="mb-6"
        />
      )}

      <Modal
        isOpen={showPublishModal}
        onClose={() => {
          setShowPublishModal(false);
          setChecklistAccepted(false);
        }}
        title="Vista previa antes de publicar"
        size="xl"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600 bg-sky-50 border border-sky-200 rounded-lg p-4">
            Esto es una vista previa de cómo el productor verá la oferta. Desplázate hacia abajo para revisar el contenido, acepta el checklist y pulsa Publicar para que la oferta pase a estado publicado.
          </p>

          <div className="max-h-[50vh] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
            <OfferPreviewContent
              offer={buildPreviewOffer(data, packingCompany, getOfferLabel(formType))}
            />
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-4">
            <p className="text-sm text-gray-700">
              Al publicar, usted confirma que la información de la oferta es correcta y que cumple con las condiciones de uso de la plataforma. (Aquí irán las condiciones de publicación de oferta.)
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checklistAccepted}
                onChange={(e) => setChecklistAccepted(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                Acepto las condiciones anteriores y deseo publicar esta oferta.
              </span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPublishModal(false);
                  setChecklistAccepted(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                disabled={!checklistAccepted}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publicar oferta
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Información General */}
      <section className="mb-8 p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-1 pb-3 border-b border-white/30">Información General</h3>
        <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Producto">
              <p className="py-2 text-slate-800">{getOfferLabel(formType)}</p>
            </FormRow>
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Unidad de Precio">
              <p className="py-2 text-slate-800">{getPriceUnitLabel(formType)}</p>
            </FormRow>
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Ciudad de la planta">
              <p className="py-2 text-slate-800">{data.plantCity || '-'}</p>
            </FormRow>
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Dirección de la planta">
              <p className="py-2 text-slate-800">{data.plantAddress || '-'}</p>
            </FormRow>
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Tolerancia Logística (%)">
              <p className="py-2 text-slate-800">{data.logisticsTolerancePct}%</p>
            </FormRow>
            <div />
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Porcentaje de Garantía clase A" required>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">
                  Porcentaje mínimo de rendimiento entero clase A que garantiza la oferta (entre {GUARANTIA_CLASE_A_MIN}% y {GUARANTIA_CLASE_A_MAX}%). Obligatorio.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={GUARANTIA_CLASE_A_MIN}
                    max={GUARANTIA_CLASE_A_MAX}
                    step="0.01"
                    value={data.guaranteeClassAPct}
                    onKeyDown={blockNegativeAndExponentKeys}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '') updateData({ guaranteeClassAPct: '' });
                      else updateData({ guaranteeClassAPct: sanitizePositiveDecimalInput(v) });
                    }}
                    readOnly={isLocked}
                    className="w-24 border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                    placeholder={`${GUARANTIA_CLASE_A_MIN}-${GUARANTIA_CLASE_A_MAX}`}
                  />
                  <span className="text-sm font-medium text-slate-700">%</span>
                </div>
                {data.guaranteeClassAPct !== '' && (() => {
                  const n = Number(data.guaranteeClassAPct);
                  if (Number.isNaN(n) || n < GUARANTIA_CLASE_A_MIN || n > GUARANTIA_CLASE_A_MAX) {
                    return (
                      <p className="text-sm text-red-600">
                        Debe estar entre {GUARANTIA_CLASE_A_MIN}% y {GUARANTIA_CLASE_A_MAX}%.
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
            </FormRow>
            <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vigencia de la oferta" required>
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Seleccione fecha de inicio y fin. El período no puede superar {VIGENCIA_MAX_DIAS} días.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Desde</label>
                    <input
                      type="date"
                      value={getTodayISO()}
                      readOnly
                      className="w-full border border-sky-300 rounded-md px-3 py-2 bg-slate-100 cursor-not-allowed text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Hasta</label>
                    <input
                      type="date"
                      value={data.validTo}
                      onChange={(e) => updateData({ validTo: e.target.value })}
                      {...inputProps}
                    />
                  </div>
                </div>
                {data.validTo && !isVigenciaValid(data) && (() => {
                  const dias = getVigenciaDias(getTodayISO(), data.validTo);
                  return (
                    <p className="text-sm text-red-600">
                      {dias != null && dias < 0
                        ? 'La fecha hasta debe ser posterior a la fecha desde.'
                        : `El período entre las fechas no puede superar ${VIGENCIA_MAX_DIAS} días.${dias != null && dias > 0 ? ` (Seleccionado: ${dias} días)` : ''}`}
                    </p>
                  );
                })()}
              </div>
            </FormRow>
            <div />
          </div>
        </div>
      </section>

      {/* Tabla de Precios + Requisitos de Calidad en grid horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 items-stretch">
        {/* Tabla de Precios (tallas fijas, solo el precio es editable) */}
        <section ref={priceTableSectionRef} className="p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm self-start">
          <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/30">Tabla de Precios</h3>
          <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-4">
              Las tallas son fijas por tipo de producto. Indique el precio (USD) para cada talla que desee ofrecer; debe haber al menos una con precio. Las tallas sin precio no se mostrarán al productor en la oferta.
            </p>
            <div className="overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden">
              <table className="min-w-full divide-y divide-sky-300/50">
                <thead className="bg-sky-500/25">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">Talla</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">
                      Precio (USD/{data.priceUnit === 'PER_KG' ? 'kg' : 'lb'})
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sky-200/50">
                  {data.priceTiers.map((tier, idx) => (
                    <tr key={idx} className="hover:bg-white/80">
                      <td className="px-4 py-2">
                        <span className="py-1 text-slate-800 font-medium">{formatTalla(tier.sizeMin, tier.sizeMax)}</span>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={numDisplay(`priceTier-${idx}`, tier.price)}
                          onKeyDown={blockNegativeAndExponentKeys}
                          onChange={(e) => setNumInput(`priceTier-${idx}`, e.target.value, (n) => updatePriceTier(idx, 'price', n ?? 0))}
                          onBlur={() => setIncompleteNum((prev) => { const next = { ...prev }; delete next[`priceTier-${idx}`]; return next; })}
                          readOnly={isLocked}
                          className="w-24 border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Requisitos de Calidad (cargados desde BD; solo los marcados se incluyen en la oferta) — altura igual a Tabla de Precios */}
        <section ref={qualitySectionRef} className="flex flex-col p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm min-h-0 overflow-hidden">
          <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/30 shrink-0">Requisitos de Calidad</h3>
          <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4 flex-1 min-h-0 flex flex-col">
            <p className="text-sm text-slate-600 mb-4 shrink-0">
              Los requisitos se cargan desde el catálogo. Marque con un check los que aplican a esta oferta; solo los requisitos marcados se mostrarán al productor en la oferta publicada.
            </p>
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 space-y-2 rounded-lg border border-sky-200/50 bg-white/30">
              {REQUISITOS_CALIDAD_BD.map((req) => {
                const isSelected = data.selectedQualityRequirementIds.includes(req.id);
                return (
                  <label
                    key={req.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50/80 border-sky-300' : 'bg-white/50 border-sky-200'
                    } ${isLocked ? 'cursor-not-allowed opacity-80' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleQualityRequirement(req.id)}
                      disabled={isLocked}
                      className="mt-1 rounded border-sky-300 text-sky-600 focus:ring-sky-400 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-800">{req.text}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Ajustes por Clase (solo Entero: elegir modo; Cola Directa: solo ajustes por clase) */}
      <section className="mb-8 p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-1 pb-3 border-b border-white/30">Ajustes por Clase</h3>
        <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4">
          {formType === 'ENTERO' ? (
            <>
              <p className="text-sm text-slate-600 mb-4">
                Elija cómo se pagará lo que no califique como entero: por descuento por clase (B, C) o por tabla de precios de cola directa (lo no entero se paga como cola directa según estas tallas).
              </p>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="enteroAdjustmentsMode"
                    checked={data.enteroAdjustmentsMode === 'CLASS'}
                    onChange={() => onChange({ ...data, enteroAdjustmentsMode: 'CLASS' })}
                    disabled={isLocked}
                    className="rounded border-sky-300 text-sky-600 focus:ring-sky-400"
                  />
                  <span className="text-slate-800">Ajuste por clase (B, C)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="enteroAdjustmentsMode"
                    checked={data.enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE'}
                    onChange={() => onChange({ ...data, enteroAdjustmentsMode: 'COLA_DIRECTA_TABLE' })}
                    disabled={isLocked}
                    className="rounded border-sky-300 text-sky-600 focus:ring-sky-400"
                  />
                  <span className="text-slate-800">Tablas de Cola Directa y Venta Local</span>
                </label>
              </div>
              {data.enteroAdjustmentsMode === 'CLASS' ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Moneda fija: USD. Defina el descuento por clase. Opcional.</p>
                  {data.adjustments.map((adj, idx) => (
                    <div key={adj.appliesToClass} className="flex flex-wrap items-center gap-4 p-4 bg-white/80 border border-sky-300/60 rounded-lg">
                      <div className="font-semibold text-slate-800 w-20">Clase {adj.appliesToClass}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Tipo de descuento:</span>
                        <select
                          value={adj.unit}
                          onChange={(e) => {
                          const newUnit = e.target.value as 'USD' | 'PERCENT';
                          const newAmount = newUnit === 'PERCENT' && (adj.amount ?? 0) > 100 ? 100 : adj.amount;
                          const newAdj = [...data.adjustments];
                          newAdj[idx] = { ...newAdj[idx], unit: newUnit, amount: newAmount ?? 0 };
                          onChange({ ...data, adjustments: newAdj });
                        }}
                          disabled={isLocked}
                          className="border border-sky-300 rounded-md px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                        >
                          <option value="USD">Dólar por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}</option>
                          <option value="PERCENT">Porcentaje por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Monto:</span>
                        <input
                          type="number"
                          min="0"
                          max={adj.unit === 'PERCENT' ? 100 : undefined}
                          step="0.01"
                          value={numDisplay(`adj-enter-${idx}`, adj.amount)}
                          onKeyDown={blockNegativeAndExponentKeys}
                          onChange={(e) => setNumInput(`adj-enter-${idx}`, e.target.value, (n) => updateAdjustment(idx, 'amount', n ?? 0), adj.unit === 'PERCENT' ? { max: 100 } : undefined)}
                          onBlur={() => setIncompleteNum((prev) => { const next = { ...prev }; delete next[`adj-enter-${idx}`]; return next; })}
                          readOnly={isLocked}
                          className="w-28 border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                        />
                        <span className="text-sm font-medium text-slate-700 w-16">{adj.unit === 'USD' ? 'USD' : '%'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full items-start">
                  <h4 className="text-base font-semibold text-slate-800">Cola Directa</h4>
                  <h4 className="text-base font-semibold text-slate-800">Venta Local</h4>
                  <p className="text-xs text-slate-500 min-w-0">Lo que no califique como entero se pagará como cola directa según los precios por talla (USD/lb). Indique el precio para cada talla que aplique.</p>
                  <p className="text-xs text-slate-500 min-w-0">Indique el precio (USD) para cada categoría.</p>
                  <div className="w-full overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden inline-block min-w-0">
                    <table className="w-full divide-y divide-sky-300/50 table-fixed">
                      <thead className="bg-sky-500/25">
                        <tr>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">Talla</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">Precio (USD/lb)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-sky-200/50">
                        {data.colaDirectaTiers.map((tier, idx) => (
                          <tr key={idx} className="hover:bg-white/80">
                            <td className="px-4 py-2">
                              <span className="py-1 text-slate-800">{formatTalla(tier.sizeMin, tier.sizeMax)}</span>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={numDisplay(`colaTier-${idx}`, tier.price)}
                                onKeyDown={blockNegativeAndExponentKeys}
                                onChange={(e) => setNumInput(`colaTier-${idx}`, e.target.value, (n) => updateColaDirectaTier(idx, 'price', n ?? 0))}
                                onBlur={() => setIncompleteNum((prev) => { const next = { ...prev }; delete next[`colaTier-${idx}`]; return next; })}
                                readOnly={isLocked}
                                className="w-24 border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="w-full overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden inline-block min-w-0">
                    <table className="w-full divide-y divide-sky-300/50 table-fixed">
                      <thead className="bg-sky-500/25">
                        <tr>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">Categoría</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">Precio (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-sky-200/50">
                        {VENTA_LOCAL_ROWS.map(({ key, label }) => (
                          <tr key={key} className="hover:bg-white/80">
                            <td className="px-4 py-2">
                              <span className="py-1 text-slate-800 font-medium">{label}</span>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={numDisplay(`ventaLocal-${key}`, data.ventaLocalPrices[key])}
                                onKeyDown={blockNegativeAndExponentKeys}
                                onChange={(e) => setNumInput(`ventaLocal-${key}`, e.target.value, (n) => updateVentaLocalPrice(key, n ?? 0))}
                                onBlur={() => setIncompleteNum((prev) => { const next = { ...prev }; delete next[`ventaLocal-${key}`]; return next; })}
                                readOnly={isLocked}
                                className="w-24 border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600 mb-4">
                Moneda fija: USD. Defina el descuento por clase (B, C). Los campos de esta sección no son obligatorios.
              </p>
              <div className="space-y-4">
                {data.adjustments.map((adj, idx) => (
                  <div key={adj.appliesToClass} className="flex flex-wrap items-center gap-4 p-4 bg-white/80 border border-sky-300/60 rounded-lg">
                    <div className="font-semibold text-slate-800 w-20">Clase {adj.appliesToClass}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Tipo de descuento:</span>
                      <select
                        value={adj.unit}
                        onChange={(e) => {
                        const newUnit = e.target.value as 'USD' | 'PERCENT';
                        const newAmount = newUnit === 'PERCENT' && (adj.amount ?? 0) > 100 ? 100 : adj.amount;
                        const newAdj = [...data.adjustments];
                        newAdj[idx] = { ...newAdj[idx], unit: newUnit, amount: newAmount ?? 0 };
                        onChange({ ...data, adjustments: newAdj });
                      }}
                        disabled={isLocked}
                        className="border border-sky-300 rounded-md px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                      >
                        <option value="USD">Dólar por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}</option>
                        <option value="PERCENT">Porcentaje por {data.priceUnit === 'PER_KG' ? 'kg' : 'libra'}</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Monto:</span>
                      <input
                        type="number"
                        min="0"
                        max={adj.unit === 'PERCENT' ? 100 : undefined}
                        step="0.01"
                        value={numDisplay(`adj-cola-${idx}`, adj.amount)}
                        onKeyDown={blockNegativeAndExponentKeys}
                        onChange={(e) => setNumInput(`adj-cola-${idx}`, e.target.value, (n) => updateAdjustment(idx, 'amount', n ?? 0), adj.unit === 'PERCENT' ? { max: 100 } : undefined)}
                        onBlur={() => setIncompleteNum((prev) => { const next = { ...prev }; delete next[`adj-cola-${idx}`]; return next; })}
                        readOnly={isLocked}
                        className="w-28 border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                      />
                      <span className="text-sm font-medium text-slate-700 w-16">{adj.unit === 'USD' ? 'USD' : '%'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Términos de Pago */}
      <section className="mb-8 p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/30">Términos de Pago</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.paymentTerms.map((term, idx) => {
              if (term.termType === 'ADVANCE') {
                return (
                  <div key="advance" className="border border-sky-300/60 rounded-lg p-4 bg-white/70">
                    <h4 className="font-semibold text-slate-800 mb-3">Anticipo (requerido)</h4>
                    <div className="space-y-4">
                      <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Porcentaje (%)" required>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={numDisplay('percent-adv', term.percent)}
                          onKeyDown={blockNegativeAndExponentKeys}
                          onChange={(e) => setNumInput('percent-adv', e.target.value, (n) => updatePaymentTerm(idx, 'percent', n ?? 0), { max: 100 })}
                          onBlur={() => setIncompleteNum((prev) => { const next = { ...prev }; delete next['percent-adv']; return next; })}
                          {...inputProps}
                        />
                      </FormRow>
                      <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vence en (horas)">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={numDisplay('dueInHours-adv', term.dueInHours)}
                          onKeyDown={blockNegativeAndExponentKeys}
                          onChange={(e) => setNumInput('dueInHours-adv', e.target.value, (n) => updatePaymentTerm(idx, 'dueInHours', n), { emptyValue: undefined })}
                          onBlur={() => setIncompleteNum((prev) => { const next = { ...prev }; delete next['dueInHours-adv']; return next; })}
                          placeholder="Ej: 24"
                          {...inputProps}
                        />
                      </FormRow>
                      <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Condición/Trigger">
                        <input
                          type="text"
                          value={term.trigger ?? ''}
                          maxLength={TRIGGER_MAX_LENGTH}
                          onChange={(e) => updatePaymentTerm(idx, 'trigger', e.target.value.slice(0, TRIGGER_MAX_LENGTH))}
                          placeholder="Ej: Confirmación de compra"
                          {...inputProps}
                        />
                      </FormRow>
                    </div>
                  </div>
                );
              }
              if (term.termType === 'BALANCE') {
                const advancePercent = data.paymentTerms.find((p) => p.termType === 'ADVANCE')?.percent ?? 0;
                const balancePercent = 100 - advancePercent;
                return (
                  <div key="balance" className="border border-sky-300/60 rounded-lg p-4 bg-white/70">
                    <h4 className="font-semibold text-slate-800 mb-3">Saldo restante (requerido)</h4>
                    <p className="text-sm text-slate-600 mb-3">Porcentaje: {balancePercent}% (lo faltante después del anticipo)</p>
                    <div className="space-y-4">
                      <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vence en (horas)">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={numDisplay('dueInHours-bal', term.dueInHours)}
                          onKeyDown={blockNegativeAndExponentKeys}
                          onChange={(e) => setNumInput('dueInHours-bal', e.target.value, (n) => updatePaymentTerm(idx, 'dueInHours', n), { emptyValue: undefined })}
                          onBlur={() => setIncompleteNum((prev) => { const next = { ...prev }; delete next['dueInHours-bal']; return next; })}
                          placeholder="Ej: 168 (7 días)"
                          {...inputProps}
                        />
                      </FormRow>
                      <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Condición/Trigger">
                        <input
                          type="text"
                          value={term.trigger ?? ''}
                          maxLength={TRIGGER_MAX_LENGTH}
                          onChange={(e) => updatePaymentTerm(idx, 'trigger', e.target.value.slice(0, TRIGGER_MAX_LENGTH))}
                          placeholder="Ej: Entrega en planta"
                          {...inputProps}
                        />
                      </FormRow>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          {data.paymentTerms.map((term, idx) => {
            if (term.termType === 'ADVANCE' || term.termType === 'BALANCE') return null;
            return (
              <div key={idx} className="border border-sky-300/60 rounded-lg p-4 bg-white/70">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-slate-800">Término opcional</h4>
                  {!isLocked && (
                    <button
                      type="button"
                      onClick={() => removePaymentTerm(idx)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Descripción (texto libre)">
                  <textarea
                    value={term.text ?? ''}
                    maxLength={STRING_INPUT_MAX_LENGTH}
                    onChange={(e) => updatePaymentTerm(idx, 'text', e.target.value.slice(0, STRING_INPUT_MAX_LENGTH))}
                    placeholder="Escriba cualquier término o condición adicional..."
                    readOnly={isLocked}
                    className="w-full border border-sky-300 rounded-md px-3 py-2 min-h-[80px] bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800 placeholder-slate-500"
                    rows={3}
                  />
                </FormRow>
              </div>
            );
          })}
        </div>
        {!isLocked && (
          <div className="mt-4 pt-4 border-t border-sky-400/40">
            <button
              type="button"
              onClick={addPaymentTerm}
              className="bg-white text-sky-700 border border-sky-300 hover:bg-sky-50 hover:text-sky-800 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            >
              + Añadir término opcional
            </button>
          </div>
        )}
      </section>

      {/* Condiciones adicionales */}
      <section className="mb-8 p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/30">Condiciones adicionales</h3>
        <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4">
          <p className="text-sm text-slate-600 mb-4">
            Items de texto (máximo {ADDITIONAL_CONDITION_MAX_LENGTH} caracteres por item). Añada las condiciones que apliquen a esta oferta.
          </p>
          <div className="overflow-x-auto rounded-lg border border-sky-300/40 overflow-hidden">
            <table className="min-w-full divide-y divide-sky-300/50">
              <thead className="bg-sky-500/25">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide w-12">#</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-800 uppercase tracking-wide">Condición</th>
                  {!isLocked && <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-800 uppercase tracking-wide w-24">Acción</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sky-200/50">
                {data.additionalConditions.length === 0 ? (
                  <tr>
                    <td colSpan={isLocked ? 2 : 3} className="px-4 py-6 text-center text-slate-500 text-sm">
                      No hay condiciones. Use el botón para añadir.
                    </td>
                  </tr>
                ) : (
                  data.additionalConditions.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/80">
                      <td className="px-4 py-2">
                        <span className="text-slate-800 font-medium">{idx + 1}</span>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateAdditionalCondition(idx, e.target.value)}
                          placeholder="Escriba la condición (máx. 100 caracteres)"
                          maxLength={ADDITIONAL_CONDITION_MAX_LENGTH}
                          readOnly={isLocked}
                          className="w-full border border-sky-300 rounded px-2 py-1.5 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800 placeholder-slate-400"
                        />
                        <span className="text-xs text-slate-500 mt-0.5 block">{item.length}/{ADDITIONAL_CONDITION_MAX_LENGTH}</span>
                      </td>
                      {!isLocked && (
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeAdditionalCondition(idx)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 text-sm font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!isLocked && (
            <div className="mt-4 pt-4 border-t border-sky-400/40">
              <button
                type="button"
                onClick={addAdditionalCondition}
                className="bg-white text-sky-700 border border-sky-300 hover:bg-sky-50 hover:text-sky-800 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              >
                + Añadir item
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="mt-6 pt-6 border-t border-sky-400/40">
        {showPublishAlert && (
          <Alert
            variant="warning"
            title="No se puede publicar la oferta"
            description="Complete las siguientes secciones para poder publicar la oferta:"
            items={getIncompleteSections(data)}
            onDismiss={() => setShowPublishAlert(false)}
            className="mb-4"
          />
        )}
        <button
          type="button"
          onClick={() => handleVisibilityChange(true)}
          className="bg-sky-600 text-white px-6 py-2.5 rounded-lg hover:bg-sky-700 font-medium disabled:opacity-50 shadow-sm transition-colors"
          disabled={isLocked}
        >
          Publicar oferta
        </button>
      </div>
    </Card>
  );
};

export const PackerOffers: React.FC = () => {
  useAuth();
  const packerId = 'packer-rosasud';

  const existingOffers = dummyOffers.filter((o) => o.packingCompany.id === packerId);
  const packingCompany =
    existingOffers[0]?.packingCompany ??
    dummyOffers.find((o) => o.packingCompany.id === packerId)?.packingCompany ?? {
      id: packerId,
      name: 'Mi Empresa',
      ruc: '',
    };

  const mergeAdjustments = (existing: Adjustment[]): Adjustment[] => {
    const byClass = Object.fromEntries(existing.map((a) => [a.appliesToClass, a]));
    return (['B', 'C'] as const).map((cls) =>
      byClass[cls] ?? { type: 'CLASS_DISCOUNT' as const, appliesToClass: cls, amount: 0, unit: 'USD' as const }
    );
  };

  const mergePaymentTerms = (existing: PaymentTerm[]): PaymentTerm[] => {
    const advance = existing.find((p) => p.termType === 'ADVANCE') ?? { termType: 'ADVANCE' as const, percent: 30, dueInHours: 24, trigger: '' };
    const rawBalance = existing.find((p) => p.termType === 'BALANCE');
    const balance = rawBalance
      ? { ...rawBalance, dueInHours: rawBalance.dueInHours ?? (rawBalance.dueInDays ? rawBalance.dueInDays * 24 : 168), dueInDays: undefined }
      : { termType: 'BALANCE' as const, dueInHours: 168, trigger: '' };
    const custom = existing.filter((p) => p.termType !== 'ADVANCE' && p.termType !== 'BALANCE');
    return [advance, balance, ...custom.map((c) => ({ termType: 'CUSTOM' as const, text: c.text ?? '' }))];
  };

  const getInitialFormData = (formType: OfferFormType): OfferFormData => {
    const existing = existingOffers.find((o) => o.productForm === formType);
    if (existing) {
      return {
        productForm: existing.productForm,
        priceUnit: getPriceUnitForForm(formType),
        validFrom: getTodayISO(),
        validTo: getTodayISO(),
        plantCity: existing.plantLocation.city,
        plantAddress: existing.plantLocation.address,
        logisticsTolerancePct: String(existing.logisticsTolerancePct),
        isVisible: existing.status === 'PUBLISHED' && !isVigenciaExpired(existing.validTo),
        priceTiers: mergePriceTiersWithTallas(formType, existing.priceTiers),
        selectedQualityRequirementIds: getSelectedQualityIdsFromOffer(existing.qualityRequirements),
        adjustments: mergeAdjustments(existing.adjustments),
        paymentTerms: mergePaymentTerms(existing.paymentTerms),
        guaranteeClassAPct: existing.guaranteeClassAPct != null ? String(existing.guaranteeClassAPct) : '',
        enteroAdjustmentsMode: existing.enteroAdjustmentsMode ?? 'CLASS',
        colaDirectaTiers: existing.colaDirectaPriceTiers?.length
          ? mergePriceTiersWithTallas('COLA_DIRECTA', existing.colaDirectaPriceTiers)
          : buildPriceTiersFromTallas('COLA_DIRECTA'),
        ventaLocalPrices: existing.ventaLocalPrices ?? { quebrado: 0, rojo: 0, juvenil: 0 },
        additionalConditions: existing.additionalConditions ?? [],
      };
    }
    return createEmptyOfferForm(formType);
  };

  const [formEntero, setFormEntero] = useState<OfferFormData>(() =>
    
    getInitialFormData('ENTERO')
  );
  const [formCola, setFormCola] = useState<OfferFormData>(() =>
    getInitialFormData('COLA_DIRECTA')
  );

  const [activeTab, setActiveTab] = useState<OfferFormType>('ENTERO');

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mis Ofertas</h1>
        <div className="flex gap-2">
          {(['ENTERO', 'COLA_DIRECTA'] as OfferFormType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {getOfferLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6">
      {activeTab === 'ENTERO' && (
        <OfferFormSection
          formType="ENTERO"
          data={formEntero}
          onChange={setFormEntero}
          packingCompany={packingCompany}
        />
      )}
      {activeTab === 'COLA_DIRECTA' && (
        <OfferFormSection
          formType="COLA_DIRECTA"
          data={formCola}
          onChange={setFormCola}
          packingCompany={packingCompany}
        />
      )}
      </div>
    </div>
  );
};
