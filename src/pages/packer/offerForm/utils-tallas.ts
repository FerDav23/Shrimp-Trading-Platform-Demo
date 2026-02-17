import type { PriceTier } from '../../../types';
import type { OfferFormType } from './types';
import { TALLAS_POR_PRODUCTO } from './constants';

export const parseTalla = (talla: string): { sizeMin: number; sizeMax: number } => {
  const [min, max] = talla.split('/').map(Number);
  return { sizeMin: min || 0, sizeMax: max || 0 };
};

export const formatTalla = (sizeMin: number, sizeMax: number): string =>
  `${sizeMin}/${sizeMax}`;

/** Construye priceTiers a partir de las tallas estándar del tipo de producto */
export const buildPriceTiersFromTallas = (formType: OfferFormType): PriceTier[] => {
  const tallas = TALLAS_POR_PRODUCTO[formType] ?? [];
  return tallas.map((talla) => {
    const { sizeMin, sizeMax } = parseTalla(talla);
    return { sizeMin, sizeMax, price: 0, isActive: true };
  });
};
