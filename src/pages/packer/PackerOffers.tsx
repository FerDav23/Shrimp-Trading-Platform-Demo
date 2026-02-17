import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dummyOffers } from '../../data/offers';
import { OfferFormSection, getInitialFormData, getOfferLabel } from './offerForm';
import type { OfferFormType, OfferFormData } from './offerForm';

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

  const getFormDataForTab = (formType: OfferFormType): OfferFormData => {
    const existing = existingOffers.find((o) => o.productForm === formType);
    return getInitialFormData(formType, existing);
  };

  const [formEntero, setFormEntero] = useState<OfferFormData>(() =>
    getFormDataForTab('ENTERO')
  );
  const [formCola, setFormCola] = useState<OfferFormData>(() =>
    getFormDataForTab('COLA_DIRECTA')
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
