import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dummyOffers } from '../../data/offers';
import { page } from '../../styles';
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
      <div className={page.header}>
        <h1 className={page.title}>Mis Ofertas</h1>
        <div className="flex gap-2 flex-wrap">
          {(['ENTERO', 'COLA_DIRECTA'] as OfferFormType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${page.tab} ${activeTab === tab ? page.tabActive : page.tabInactive}`}
            >
              {getOfferLabel(tab)}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('SUBIR_OFERTA')}
            className={`${page.tab} ${activeTab === 'SUBIR_OFERTA' ? page.tabActive : page.tabInactive}`}
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
              <section className={page.uploadSection}>
                <h2 className={page.uploadTitle}>
                  Subir documentos de oferta
                </h2>
                <p className={page.uploadText}>
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
                  className={page.uploadButton}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Seleccionar archivos
                </button>
              </section>

              {uploadedFiles.length > 0 && (
                <div className={page.fileListContainer}>
                  <h3 className={page.fileListTitle}>
                    Archivos subidos
                  </h3>
                  <ul className="space-y-2">
                    {uploadedFiles.map((entry) => (
                      <li
                        key={entry.id}
                        className={page.fileListItem}
                      >
                        <div className="flex-1 min-w-0">
                          <span className={page.fileListName}>
                            {entry.name}
                          </span>
                          <span className={page.fileListSize}>
                            {(entry.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(entry.id)}
                          className={page.fileListRemove}
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
