import React from 'react';
import { FormRow } from '../../../components/FormRow';
import type { OfferFormData, OfferFormType } from './types';
import {
  FORM_ROW_SUBTITLE_LABEL,
  GUARANTIA_CLASE_A_MIN,
  GUARANTIA_CLASE_A_MAX,
  VIGENCIA_MAX_DIAS,
} from './constants';
import {
  getOfferLabel,
  getPriceUnitLabel,
  getTodayISO,
  isVigenciaValid,
  getVigenciaDias,
  sanitizePositiveDecimalInput,
  blockNegativeAndExponentKeys,
} from './utils';

interface OfferFormGeneralInfoProps {
  formType: OfferFormType;
  data: OfferFormData;
  isLocked: boolean;
  updateData: (updates: Partial<OfferFormData>) => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export const OfferFormGeneralInfo: React.FC<OfferFormGeneralInfoProps> = ({
  formType,
  data,
  isLocked,
  updateData,
  inputProps,
}) => (
  <section className="mb-8 p-6 rounded-xl border-2 border-sky-400/60 bg-[#4aa3e0] shadow-sm">
    <h3 className="text-lg font-semibold text-white mb-1 pb-3 border-b border-white/30">
      Información General
    </h3>
    <div className="bg-white/70 border border-sky-300/60 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Producto">
          <p className="py-2 text-slate-800">{getOfferLabel(formType)}</p>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Unidad de Precio">
          <p className="py-2 text-slate-800">{getPriceUnitLabel(formType)}</p>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Ciudad de la planta">
          <p className="py-2 text-slate-800">{data.plantCity || '-'}</p>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Dirección de la planta">
          <p className="py-2 text-slate-800">{data.plantAddress || '-'}</p>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Tolerancia Logística (%)">
          <p className="py-2 text-slate-800">{data.logisticsTolerancePct}%</p>
        </FormRow>
        <div />
        <FormRow
          labelClassName={FORM_ROW_SUBTITLE_LABEL}
          label="Porcentaje de Garantía clase A"
          required
        >
          <div className="space-y-1">
            <p className="text-xs text-slate-500">
              Porcentaje mínimo de rendimiento entero clase A que garantiza la oferta (entre{' '}
              {GUARANTIA_CLASE_A_MIN}% y {GUARANTIA_CLASE_A_MAX}%). Obligatorio.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={GUARANTIA_CLASE_A_MIN}
                max={GUARANTIA_CLASE_A_MAX}
                step="0.01"
                value={data.guaranteeClassAPct}
                onKeyDown={blockNegativeAndExponentKeys}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') updateData({ guaranteeClassAPct: '' });
                  else updateData({ guaranteeClassAPct: sanitizePositiveDecimalInput(v) });
                }}
                readOnly={isLocked}
                className="w-24 border border-sky-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-slate-800"
                placeholder={`${GUARANTIA_CLASE_A_MIN}-${GUARANTIA_CLASE_A_MAX}`}
              />
              <span className="text-sm font-medium text-slate-700">%</span>
            </div>
            {data.guaranteeClassAPct !== '' &&
              (() => {
                const n = Number(data.guaranteeClassAPct);
                if (
                  Number.isNaN(n) ||
                  n < GUARANTIA_CLASE_A_MIN ||
                  n > GUARANTIA_CLASE_A_MAX
                ) {
                  return (
                    <p className="text-sm text-red-600">
                      Debe estar entre {GUARANTIA_CLASE_A_MIN}% y {GUARANTIA_CLASE_A_MAX}%.
                    </p>
                  );
                }
                return null;
              })()}
          </div>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vigencia de la oferta" required>
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Seleccione fecha de inicio y fin. El período no puede superar {VIGENCIA_MAX_DIAS} días.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Desde</label>
                <input
                  type="date"
                  value={getTodayISO()}
                  readOnly
                  className="w-full border border-sky-300 rounded-md px-3 py-2 bg-slate-100 cursor-not-allowed text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Hasta</label>
                <input
                  type="date"
                  value={data.validTo}
                  onChange={(e) => updateData({ validTo: e.target.value })}
                  {...inputProps}
                />
              </div>
            </div>
            {data.validTo && !isVigenciaValid(data) &&
              (() => {
                const dias = getVigenciaDias(getTodayISO(), data.validTo);
                return (
                  <p className="text-sm text-red-600">
                    {dias != null && dias < 0
                      ? 'La fecha hasta debe ser posterior a la fecha desde.'
                      : `El período entre las fechas no puede superar ${VIGENCIA_MAX_DIAS} días.${dias != null && dias > 0 ? ` (Seleccionado: ${dias} días)` : ''}`}
                  </p>
                );
              })()}
          </div>
        </FormRow>
        <div />
      </div>
    </div>
  </section>
);
