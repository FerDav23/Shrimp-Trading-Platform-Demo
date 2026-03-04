import type { ProducerBankAccount } from '../types';

/** Cuentas bancarias de la empacadora (mismas para todas las solicitudes) */
export const PACKER_BANK_ACCOUNTS: ProducerBankAccount[] = [
  {
    bankName: 'Banco Guayaquil',
    accountType: 'Cta. Corriente',
    accountNumber: '0009876543',
    accountHolderName: 'Grupo FJ',
    identification: '0998765432001',
    email: 'pagos@grupo-fj.com',
  },
  {
    bankName: 'Banco Pichincha',
    accountType: 'Cta. Ahorros',
    accountNumber: '2100123456',
    accountHolderName: 'Grupo FJ',
    identification: '0998765432001',
    email: 'tesoreria@grupo-fj.com',
  },
];

