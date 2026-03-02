import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dummyOffers } from '../../data/offers';
import { OfferFormSection, getInitialFormData, getOfferLabel } from './offerForm';
import type { OfferFormType, OfferFormData } from './offerForm';

type TabId = OfferFormType | 'SUBIR_OFERTA';

const ACCEPTED_OFFER_FILES = '.doc,.docx,.pdf,.xls,.xlsx';

interface UploadedEntry {
  id: string;
  name: string;
  size: number;
  file: File;
}

export const PackerOffers: React.FC = () => {
  useAuth();
  const packerId = 'packer-rosasud';
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [activeTab, setActiveTab] = useState<TabId>('ENTERO');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedEntry[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newEntries: UploadedEntry[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      file,
    }));
    setUploadedFiles((prev) => [...prev, ...newEntries]);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mis Ofertas</h1>
        <div className="flex gap-2 flex-wrap">
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
          <button
            onClick={() => setActiveTab('SUBIR_OFERTA')}
            className={`px-4 py-2 font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'SUBIR_OFERTA'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Subir Oferta
          </button>
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
        {activeTab === 'SUBIR_OFERTA' && (
          <div className="flex justify-center">
            <div className="max-w-xl w-full mt-6">
              <section className="rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] p-3 shadow-sm">
                <h2 className="text-lg font-semibold text-white mb-2 pb-2 border-b border-white/30">
                  Subir documentos de oferta
                </h2>
                <p className="text-white/90 text-sm mb-3">
                  Word (.doc, .docx), PDF (.pdf) o Excel (.xls, .xlsx).
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_OFFER_FILES}
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 border-2 border-dashed border-white/60 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Seleccionar archivos
                </button>
              </section>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    Archivos subidos
                  </h3>
                  <ul className="space-y-2">
                    {uploadedFiles.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1 min-w-0">
                          <span
                            className="block text-gray-900 font-medium text-sm break-all"
                            style={{ color: '#111827' }}
                          >
                            {entry.name}
                          </span>
                          <span className="block text-gray-500 text-xs mt-0.5">
                            {(entry.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(entry.id)}
                          className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors"
                          title="Quitar archivo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
