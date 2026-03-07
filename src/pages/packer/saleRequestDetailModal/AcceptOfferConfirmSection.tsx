import React from 'react';
import { saleRequestDetail, form, button, detailActions } from '../../../styles';

interface AcceptOfferConfirmSectionProps {
  termsAccepted: boolean;
  onTermsAcceptedChange: (value: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AcceptOfferConfirmSection: React.FC<AcceptOfferConfirmSectionProps> = ({
  termsAccepted,
  onTermsAcceptedChange,
  onConfirm,
  onCancel,
}) => (
  <div className={saleRequestDetail.sectionCard}>
    <h3 className="text-base font-semibold text-gray-900 mb-3">
      Confirmar aceptación de la oferta
    </h3>
    <div className="space-y-4">
      <p className="text-sm text-gray-700 leading-relaxed">
        Al aceptar la oferta, el grupo FJ procederá a calcular el costo de la logística.
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">
        Una vez cotizada la logística se le enviará el valor estimado de la compra de la pesca más
        la logística de mover la pesca.
      </p>
      <div className="pt-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsAcceptedChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
          />
          <span className={`text-sm ${form.label}`}>
            Acepto los términos y condiciones de la solicitud de compra (se estipularán más a
            detalle en el proceso).
          </span>
        </label>
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" onClick={onCancel} className={button.cancelOutline}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!termsAccepted}
          className={
            termsAccepted
              ? detailActions.accept
              : 'px-4 py-2 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed'
          }
        >
          Confirmar solicitud de compra
        </button>
      </div>
    </div>
  </div>
);
