import type { OfferFormType } from './types';
import type { QualityRequirementOption } from './types';

/** Tallas estándar por tipo de producto (temporal: luego se cargarán desde BD) */
export const TALLAS_POR_PRODUCTO: Partial<Record<OfferFormType, string[]>> = {
  ENTERO: ['20/30', '30/40', '40/50', '50/60', '60/70', '70/80', '80/100', '100/120'],
  COLA_DIRECTA: ['16/20', '21/25', '26/30', '31/35', '36/40', '41/50', '51/60', '61/70', '71/90'],
};

/** Requisitos de calidad cargados desde BD (temporal: constante hasta conectar API) */
export const REQUISITOS_CALIDAD_BD: QualityRequirementOption[] = [
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

/** Días máximos permitidos entre fecha desde y hasta en la vigencia de la oferta */
export const VIGENCIA_MAX_DIAS = 10;

/** Límites del porcentaje de garantía clase A (temporal: se cargará desde BD) */
export const GUARANTIA_CLASE_A_MIN = 80;
export const GUARANTIA_CLASE_A_MAX = 100;

/** Límite de caracteres para todos los inputs de texto (string) */
export const STRING_INPUT_MAX_LENGTH = 100;

/** Límite para Condición/Trigger en términos de pago */
export const TRIGGER_MAX_LENGTH = 50;

/** Límite por item en condiciones adicionales */
export const ADDITIONAL_CONDITION_MAX_LENGTH = 100;

/** Estilo de label como subtítulo en FormRow */
export const FORM_ROW_SUBTITLE_LABEL =
  'block text-sm font-bold text-slate-600 uppercase tracking-wider mb-1.5';

export const VENTA_LOCAL_ROWS: { key: 'quebrado' | 'rojo' | 'juvenil'; label: string }[] = [
  { key: 'quebrado', label: 'Quebrado' },
  { key: 'rojo', label: 'Rojo' },
  { key: 'juvenil', label: 'Juvenil' },
];
