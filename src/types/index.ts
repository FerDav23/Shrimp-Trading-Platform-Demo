export type UserRole = 'PRODUCER' | 'PACKER' | 'LOGISTICS' | 'MANAGER';

export type ProductForm = 'ENTERO' | 'COLA_DIRECTA' | 'CAMARON_VIVO' | 'SOBRANTE' | 'COLA_SOBRANTE';
export type Currency = 'USD';
export type PriceUnit = 'PER_LB' | 'PER_KG';
export type OfferStatus = 'DRAFT' | 'PUBLISHED' | 'EXPIRED' | 'CANCELLED';
export type LogisticsStatus = 'PENDING_PICKUP' | 'IN_TRANSIT' | 'DELIVERED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
export type PaymentTermType = 'ADVANCE' | 'BALANCE' | 'CUSTOM';
export type AdjustmentType = 'CLASS_DISCOUNT';
export type SaleRequestStatus =
  | 'PENDING_ACCEPTANCE'       // Pendientes de Aceptar
  | 'CATCH_SETTLEMENT_PENDING' // Liquidación de Pesca pendiente
  | 'ADVANCE_PENDING'          // Anticipo Pendiente
  | 'BALANCE_PENDING'          // Saldo Restante Pendiente
  | 'SALE_COMPLETED'           // Venta Finalizada
  | 'REJECTED';                // Rechazada

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
  /** Solo para producto ENTERO: 'CLASS' = ajustes por clase A/B/C, 'COLA_DIRECTA_TABLE' = tabla de precios cola directa */
  enteroAdjustmentsMode?: 'CLASS' | 'COLA_DIRECTA_TABLE';
  /** Precios por talla cuando enteroAdjustmentsMode === 'COLA_DIRECTA_TABLE' (lo no entero se paga como cola directa) */
  colaDirectaPriceTiers?: PriceTier[];
  /** Solo ENTERO + COLA_DIRECTA_TABLE: precios venta local (Quebrado, Rojo, Juvenil) */
  ventaLocalPrices?: { quebrado: number; rojo: number; juvenil: number };
  /** Condiciones adicionales (cada item máx. 100 caracteres) */
  additionalConditions?: string[];
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

/** Información sobre la pesca que el productor quiere vender */
export interface CatchInfo {
  /** Fecha estimada de cosecha */
  estimatedHarvestDate: string;
  /** Ubicación de la pesca/piscina */
  harvestLocation: Location;
  /** Cantidad estimada en libras */
  estimatedQuantityLb: number;
  /** Rango de tallas esperado */
  sizeRange: { min: number; max: number };
  /** Información adicional sobre la pesca (calidad, condiciones, etc.) */
  notes?: string;
  /** Fotos o documentos adjuntos */
  attachments?: string[];
}

/** Línea del detalle de liquidación (talla/descripción, libras, precio). La clase es fija por tabla. */
export interface CatchSettlementLine {
  id: string;
  /** Ej: 31-35, 41-50, Quebrado, Rojo, Juvenil */
  sizeOrDesc: string;
  pounds: number;
  unitPrice: number;
}

/** Clases fijas para el detalle de liquidación (tres tablas) */
export const CATCH_SETTLEMENT_CLASSES = {
  COLA_DIRECTA_A: 'A COLA DIRECTA',
  COLA_DIRECTA_B: 'B COLA DIRECTA',
  VENTA_LOCAL: 'VENTA LOCAL',
} as const;

/** Liquidación de pesca: datos de ingreso, detalle por clase/talla (tres tablas) y resumen */
export interface CatchSettlement {
  /** Fecha de ingreso */
  entryDate: string;
  /** Número de lote */
  lotNumber: string;
  /** Guía de remisión */
  remissionGuide: string;
  /** Piscina */
  pond: string;
  /** Aguaje (periodo/código de cosecha) */
  aguaje: string;
  guiaMov?: string;
  guiaRemProp?: string;
  /** Líneas de la tabla A COLA DIRECTA */
  colaDirectaALines: CatchSettlementLine[];
  /** Líneas de la tabla B COLA DIRECTA */
  colaDirectaBLines: CatchSettlementLine[];
  /** Líneas de la tabla VENTA LOCAL */
  ventaLocalLines: CatchSettlementLine[];
  /** Libras remitidas referencial */
  remitidasReferencialLb: number;
  /** Basura cola directa (libras) */
  basuraColaDirectaLb: number;
}

/** Datos de una cuenta bancaria del productor para transferencias */
export interface ProducerBankAccount {
  /** Nombre del banco (ej. Banco Bolivariano, Banco Guayaquil) */
  bankName: string;
  /** Tipo de cuenta (ej. Cta. Ahorros, Cuenta de Ahorros) */
  accountType: string;
  /** Número de cuenta */
  accountNumber: string;
  /** Nombre del titular de la cuenta */
  accountHolderName: string;
  /** Cédula o identificación del titular */
  identification: string;
  /** Email del titular (opcional, no todos los bancos lo incluyen) */
  email?: string;
}

/** Solicitud de venta que un productor envía a un packer basada en una oferta */
export interface SaleRequest {
  id: string;
  /** ID de la oferta a la que responde esta solicitud */
  offerId: string;
  /** ID del productor que envía la solicitud */
  producerId: string;
  /** Nombre del productor */
  producerName: string;
  /** Cuentas bancarias del productor para transferencias (el packer elige a cuál transferir) */
  producerBankAccounts?: ProducerBankAccount[];
  /** ID del packer que recibe la solicitud */
  packingCompanyId: string;
  /** Forma del producto */
  productForm: ProductForm;
  /** Información sobre la pesca */
  catchInfo: CatchInfo;
  /** Estado de la solicitud */
  status: SaleRequestStatus;
  /** Fecha de creación de la solicitud */
  createdAt: string;
  /** Fecha de respuesta del packer (aceptación/rechazo) */
  respondedAt?: string;
  /** Comentarios del packer al responder */
  packerNotes?: string;
  /** Motivo del rechazo (cuando estado es REJECTED), seleccionado del dropdown al rechazar */
  rejectionReason?: string;
  /** ID de la venta creada si fue aceptada y convertida */
  saleId?: string;
  /** Liquidación de pesca registrada (cuando estado es CATCH_SETTLEMENT_PENDING) */
  catchSettlement?: CatchSettlement;
}
