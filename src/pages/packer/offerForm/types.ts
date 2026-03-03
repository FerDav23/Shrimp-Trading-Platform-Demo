import type {
  ProductForm,
  PriceTier,
  QualityRequirement,
  Adjustment,
  PaymentTerm,
  Offer,
  PackingCompany,
} from '../../../types';

export type OfferFormType = ProductForm;

/** Modo de ajustes para oferta Entero: por clase (A/B/C) o tabla cola directa */
export type EnteroAdjustmentsMode = 'CLASS' | 'COLA_DIRECTA_TABLE';

export interface QualityRequirementOption {
  id: string;
  code: string;
  text: string;
}

export interface OfferFormData {
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
  enteroAdjustmentsMode: EnteroAdjustmentsMode;
  colaDirectaTiers: PriceTier[];
  ventaLocalPrices: { quebrado: number; rojo: number; juvenil: number };
  additionalConditions: string[];
  /** Rango opcional de cantidad de pesca a comprar (mínimo y/o máximo) */
  quantityRangeMin?: number;
  quantityRangeMax?: number;
}

export interface OfferFormSectionProps {
  formType: OfferFormType;
  data: OfferFormData;
  onChange: (data: OfferFormData) => void;
  packingCompany: PackingCompany;
}

export type { PriceTier, Adjustment, PaymentTerm, Offer, PackingCompany, QualityRequirement };
