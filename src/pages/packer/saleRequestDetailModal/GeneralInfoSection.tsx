import React from 'react';
import { FormRow } from '../../../components/FormRow';
import { StatusBadge } from '../../../components/StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SaleRequest } from '../../../types';
import { getProductFormLabel, getStatusLabel } from './utils';
import { CollapsibleSection } from './CollapsibleSection';
interface GeneralInfoSectionProps {
  request: SaleRequest;
  expanded: boolean;
  onToggle: () => void;
  linkedOffer: { id: string; offerCode: string } | null;
  onOpenOfferModal: () => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  request,
  expanded,
  onToggle,
  linkedOffer,
  onOpenOfferModal,
}) => (
  <CollapsibleSection title="Información General" expanded={expanded} onToggle={onToggle}>
    <div className="px-6 pb-6">
      <div className="bg-white border border-sky-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="ID Solicitud">
            <p className="py-2 text-sm text-gray-900 font-medium">#{request.id.split('-')[1]}</p>
          </FormRow>
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Estado">
            <div className="py-2">
              <StatusBadge status={request.status} label={getStatusLabel(request.status)} />
            </div>
          </FormRow>
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Productor">
            <p className="py-2 text-sm text-gray-900">{request.producerName}</p>
          </FormRow>
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Producto">
            <p className="py-2 text-sm text-gray-900">{getProductFormLabel(request.productForm)}</p>
          </FormRow>
          <FormRow labelClassName="text-sm font-medium text-gray-700" label="Fecha de Solicitud">
            <p className="py-2 text-sm text-gray-900">
              {format(new Date(request.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
            </p>
          </FormRow>
          {request.respondedAt && (
            <FormRow labelClassName="text-sm font-medium text-gray-700" label="Fecha de Respuesta">
              <p className="py-2 text-sm text-gray-900">
                {format(new Date(request.respondedAt), 'dd MMM yyyy, HH:mm', { locale: es })}
              </p>
            </FormRow>
          )}
          <div className="md:col-span-2 mt-2">
            <FormRow labelClassName="text-sm font-medium text-gray-700" label="Oferta vinculada">
              <div className="flex items-center gap-2 py-2">
                {linkedOffer ? (
                  <>
                    <span className="text-sm text-gray-900 font-medium">{linkedOffer.offerCode}</span>
                    <button
                      type="button"
                      onClick={onOpenOfferModal}
                      className="text-sm px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium transition-colors"
                    >
                      Ver oferta
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Oferta no encontrada</span>
                )}
              </div>
            </FormRow>
          </div>
        </div>
      </div>
    </div>
  </CollapsibleSection>
);
