import { Offer } from '../types';

export const dummyOffers: Offer[] = [
  {
    id: 'offer-1',
    offerCode: 'ROS-ENT-2024-001',
    packingCompany: {
      id: 'packer-rosasud',
      name: 'ROSASUD S.A.S.',
      ruc: '0998765432001',
    },
    productForm: 'ENTERO',
    currency: 'USD',
    priceUnit: 'PER_LB',
    validFrom: '2024-01-15',
    validTo: '2024-03-31',
    plantLocation: {
      city: 'Durán',
      address: 'Planta Tambo, Km 8 Vía Durán-Tambo',
    },
    logisticsTolerancePct: 10,
    status: 'PUBLISHED',
    priceTiers: [
      { sizeMin: 10, sizeMax: 15, price: 4.50, isActive: true },
      { sizeMin: 16, sizeMax: 20, price: 4.20, isActive: true },
      { sizeMin: 21, sizeMax: 25, price: 3.90, isActive: true },
      { sizeMin: 26, sizeMax: 30, price: 3.60, isActive: true },
      { sizeMin: 31, sizeMax: 40, price: 3.30, isActive: true },
      { sizeMin: 41, sizeMax: 50, price: 3.00, isActive: true },
    ],
    adjustments: [
      {
        type: 'CLASS_DISCOUNT',
        appliesToClass: 'B',
        amount: 1.00,
        unit: 'USD',
      },
    ],
    qualityRequirements: [
      { code: 'NO_ARENA', text: 'NO ARENA' },
      { code: 'NO_MELANOSIS', text: 'NO MELANOSIS' },
      { code: 'FRESCO', text: 'Producto fresco, máximo 24 horas post-cosecha' },
      { code: 'TEMP_CONTROL', text: 'Transporte con control de temperatura' },
    ],
    classDefinitions: [
      { classCode: 'A', definitionText: 'Clase A: Producto premium, sin defectos' },
      { classCode: 'B', definitionText: 'Clase B: Producto con defectos menores aceptables' },
    ],
    paymentTerms: [
      {
        termType: 'ADVANCE',
        percent: 30,
        dueInHours: 24,
        trigger: 'Confirmación de compra',
      },
      {
        termType: 'BALANCE',
        percent: 70,
        dueInDays: 7,
        trigger: 'Entrega en planta',
      },
    ],
  },
  {
    id: 'offer-2',
    offerCode: 'ROS-ENT-2024-002',
    packingCompany: {
      id: 'packer-rosasud',
      name: 'ROSASUD S.A.S.',
      ruc: '0998765432001',
    },
    productForm: 'ENTERO',
    currency: 'USD',
    priceUnit: 'PER_KG',
    validFrom: '2024-02-01',
    validTo: '2024-04-30',
    plantLocation: {
      city: 'Durán',
      address: 'Planta Tambo, Km 8 Vía Durán-Tambo',
    },
    logisticsTolerancePct: 8,
    status: 'PUBLISHED',
    priceTiers: [
      { sizeMin: 20, sizeMax: 30, price: 9.80, isActive: true },
      { sizeMin: 31, sizeMax: 40, price: 9.20, isActive: true },
      { sizeMin: 41, sizeMax: 50, price: 8.60, isActive: true },
      { sizeMin: 51, sizeMax: 60, price: 8.00, isActive: true },
    ],
    adjustments: [
      {
        type: 'CLASS_DISCOUNT',
        appliesToClass: 'B',
        amount: 2.20,
        unit: 'USD',
      },
    ],
    qualityRequirements: [
      { code: 'NO_ARENA', text: 'NO ARENA' },
      { code: 'NO_MELANOSIS', text: 'NO MELANOSIS' },
      { code: 'FRESCO', text: 'Producto fresco, máximo 18 horas post-cosecha' },
    ],
    classDefinitions: [
      { classCode: 'A', definitionText: 'Clase A: Producto premium' },
      { classCode: 'B', definitionText: 'Clase B: Descuento aplicado' },
    ],
    paymentTerms: [
      {
        termType: 'ADVANCE',
        percent: 40,
        dueInHours: 48,
        trigger: 'Confirmación de compra',
      },
      {
        termType: 'BALANCE',
        percent: 60,
        dueInDays: 5,
        trigger: 'Entrega en planta',
      },
    ],
  },
  {
    id: 'offer-3',
    offerCode: 'ROS-COLA-2024-001',
    packingCompany: {
      id: 'packer-rosasud',
      name: 'ROSASUD S.A.S.',
      ruc: '0998765432001',
    },
    productForm: 'COLA_DIRECTA',
    currency: 'USD',
    priceUnit: 'PER_LB',
    validFrom: '2024-01-20',
    validTo: '2024-03-15',
    plantLocation: {
      city: 'Durán',
      address: 'Planta Tambo, Km 8 Vía Durán-Tambo',
    },
    logisticsTolerancePct: 12,
    status: 'PUBLISHED',
    priceTiers: [
      { sizeMin: 15, sizeMax: 20, price: 3.80, isActive: true },
      { sizeMin: 21, sizeMax: 25, price: 3.50, isActive: true },
      { sizeMin: 26, sizeMax: 30, price: 3.20, isActive: true },
      { sizeMin: 31, sizeMax: 40, price: 2.90, isActive: true },
    ],
    adjustments: [
      {
        type: 'CLASS_DISCOUNT',
        appliesToClass: 'B',
        amount: 0.80,
        unit: 'USD',
      },
    ],
    qualityRequirements: [
      { code: 'NO_ARENA', text: 'NO ARENA' },
      { code: 'FRESCO', text: 'Cola directa fresca, máximo 20 horas post-cosecha' },
    ],
    classDefinitions: [
      { classCode: 'A', definitionText: 'Clase A: Cola directa premium' },
      { classCode: 'B', definitionText: 'Clase B: Descuento aplicado' },
    ],
    paymentTerms: [
      {
        termType: 'ADVANCE',
        percent: 25,
        dueInHours: 24,
        trigger: 'Confirmación de compra',
      },
      {
        termType: 'BALANCE',
        percent: 75,
        dueInDays: 10,
        trigger: 'Entrega en planta',
      },
    ],
  },
  {
    id: 'offer-4',
    offerCode: 'ACUA-ENT-2024-001',
    packingCompany: {
      id: 'packer-acuamar',
      name: 'ACUAMAR S.A.',
      ruc: '0995566778001',
    },
    productForm: 'ENTERO',
    currency: 'USD',
    priceUnit: 'PER_LB',
    validFrom: '2024-02-10',
    validTo: '2024-05-31',
    plantLocation: {
      city: 'Guayaquil',
      address: 'Zona Industrial, Km 12 Vía a Daule',
    },
    logisticsTolerancePct: 10,
    status: 'PUBLISHED',
    priceTiers: [
      { sizeMin: 10, sizeMax: 15, price: 4.60, isActive: true },
      { sizeMin: 16, sizeMax: 20, price: 4.30, isActive: true },
      { sizeMin: 21, sizeMax: 25, price: 4.00, isActive: true },
      { sizeMin: 26, sizeMax: 30, price: 3.70, isActive: true },
      { sizeMin: 31, sizeMax: 40, price: 3.40, isActive: true },
    ],
    adjustments: [
      {
        type: 'CLASS_DISCOUNT',
        appliesToClass: 'B',
        amount: 1.20,
        unit: 'USD',
      },
    ],
    qualityRequirements: [
      { code: 'NO_ARENA', text: 'NO ARENA' },
      { code: 'NO_MELANOSIS', text: 'NO MELANOSIS' },
      { code: 'FRESCO', text: 'Producto fresco, máximo 22 horas post-cosecha' },
    ],
    classDefinitions: [
      { classCode: 'A', definitionText: 'Clase A: Producto premium' },
      { classCode: 'B', definitionText: 'Clase B: Descuento aplicado' },
    ],
    paymentTerms: [
      {
        termType: 'ADVANCE',
        percent: 35,
        dueInHours: 36,
        trigger: 'Confirmación de compra',
      },
      {
        termType: 'BALANCE',
        percent: 65,
        dueInDays: 7,
        trigger: 'Entrega en planta',
      },
    ],
  },
  {
    id: 'offer-5',
    offerCode: 'ACUA-COLA-2024-001',
    packingCompany: {
      id: 'packer-acuamar',
      name: 'ACUAMAR S.A.',
      ruc: '0995566778001',
    },
    productForm: 'COLA_DIRECTA',
    currency: 'USD',
    priceUnit: 'PER_KG',
    validFrom: '2024-02-15',
    validTo: '2024-04-30',
    plantLocation: {
      city: 'Guayaquil',
      address: 'Zona Industrial, Km 12 Vía a Daule',
    },
    logisticsTolerancePct: 10,
    status: 'PUBLISHED',
    priceTiers: [
      { sizeMin: 20, sizeMax: 30, price: 8.50, isActive: true },
      { sizeMin: 31, sizeMax: 40, price: 8.00, isActive: true },
      { sizeMin: 41, sizeMax: 50, price: 7.50, isActive: true },
    ],
    adjustments: [
      {
        type: 'CLASS_DISCOUNT',
        appliesToClass: 'B',
        amount: 1.80,
        unit: 'USD',
      },
    ],
    qualityRequirements: [
      { code: 'NO_ARENA', text: 'NO ARENA' },
      { code: 'FRESCO', text: 'Cola directa fresca, máximo 18 horas post-cosecha' },
    ],
    classDefinitions: [
      { classCode: 'A', definitionText: 'Clase A: Cola directa premium' },
      { classCode: 'B', definitionText: 'Clase B: Descuento aplicado' },
    ],
    paymentTerms: [
      {
        termType: 'ADVANCE',
        percent: 30,
        dueInHours: 24,
        trigger: 'Confirmación de compra',
      },
      {
        termType: 'BALANCE',
        percent: 70,
        dueInDays: 8,
        trigger: 'Entrega en planta',
      },
    ],
  },
];
