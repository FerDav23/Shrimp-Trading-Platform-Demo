import { LogisticsPricing } from '../types';

export const dummyLogisticsPricing: LogisticsPricing = {
  sectors: [
    {
      id: 'sector-1',
      name: 'Guayaquil - Durán',
      fixedPrice: 50,
      pricePerLb: 0.05,
    },
    {
      id: 'sector-2',
      name: 'Guayaquil - Zona Industrial',
      fixedPrice: 40,
      pricePerLb: 0.04,
    },
    {
      id: 'sector-3',
      name: 'Daule - Durán',
      fixedPrice: 60,
      pricePerLb: 0.06,
    },
    {
      id: 'sector-4',
      name: 'Samborondón - Durán',
      fixedPrice: 45,
      pricePerLb: 0.045,
    },
    {
      id: 'sector-5',
      name: 'Nobol - Guayaquil',
      fixedPrice: 80,
      pricePerLb: 0.08,
    },
  ],
};

export const dummyTrucks = [
  { id: 'truck-1', plate: 'ABC-1234', driver: 'Carlos Mendoza', capacity: 5000 },
  { id: 'truck-2', plate: 'XYZ-5678', driver: 'Luis Rodríguez', capacity: 5000 },
  { id: 'truck-3', plate: 'DEF-9012', driver: 'Miguel Torres', capacity: 3000 },
];
