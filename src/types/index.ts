export type UserRole = 'PRODUCER' | 'PACKER' | 'LOGISTICS' | 'MANAGER';

export type ProductForm = 'ENTERO' | 'COLA_DIRECTA' | 'CAMARON_VIVO';
export type Currency = 'USD';
export type PriceUnit = 'PER_LB' | 'PER_KG';
export type OfferStatus = 'DRAFT' | 'PUBLISHED' | 'EXPIRED' | 'CANCELLED';
export type LogisticsStatus = 'PENDING_PICKUP' | 'IN_TRANSIT' | 'DELIVERED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
export type PaymentTermType = 'ADVANCE' | 'BALANCE' | 'CUSTOM';
export type AdjustmentType = 'CLASS_DISCOUNT';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  ruc: string;
  email: string;
  phone: string;
  address?: string;
  docs?: string[];
  bankInfo?: string[];
}

export interface PackingCompany {
  id: string;
  name: string;
  ruc: string;
}

export interface Location {
  city: string;
  address: string;
}

export interface PriceTier {
  sizeMin: number;
  sizeMax: number;
  price: number;
  isActive: boolean;
}

export interface QualityRequirement {
  code: string;
  text: string;
}

export interface ClassDefinition {
  classCode: string;
  definitionText: string;
}

export interface PaymentTerm {
  termType: PaymentTermType;
  percent?: number;
  dueInHours?: number;
  dueInDays?: number;
  trigger?: string;
  text?: string;
}

export interface Adjustment {
  type: AdjustmentType;
  appliesToClass: string;
  amount: number;
  unit: 'USD' | 'PERCENT';
}

export interface Offer {
  id: string;
  offerCode: string;
  packingCompany: PackingCompany;
  productForm: ProductForm;
  currency: Currency;
  priceUnit: PriceUnit;
  validFrom: string;
  validTo: string;
  plantLocation: Location;
  logisticsTolerancePct: number;
  status: OfferStatus;
  priceTiers: PriceTier[];
  adjustments: Adjustment[];
  qualityRequirements: QualityRequirement[];
  classDefinitions: ClassDefinition[];
  paymentTerms: PaymentTerm[];
  guaranteeClassAPct?: number;
}

export interface Sale {
  id: string;
  offerId: string;
  producerId: string;
  packingCompanyId: string;
  productForm: ProductForm;
  sizeRangeSelected: { min: number; max: number };
  quantityLb: number;
  pickupLocation: Location;
  deliveryPlant: Location;
  logisticsStatus: LogisticsStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
  estimatedHarvestDate?: string;
}

export interface LogisticsSector {
  id: string;
  name: string;
  fixedPrice: number;
  pricePerLb: number;
}

export interface LogisticsPricing {
  sectors: LogisticsSector[];
}
