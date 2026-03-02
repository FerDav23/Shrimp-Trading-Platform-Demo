import React from 'react';
import { FormRow } from '../../../components/FormRow';
import type { OfferFormData, OfferFormType } from './types';
import { offerSection, form } from '../../../styles';
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
  <section className={offerSection.container}>
    <h3 className={offerSection.title}>
      Información General
    </h3>
    <div className={offerSection.inner}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Producto">
          <p className={'py-1 ' + offerSection.textBold}>{getOfferLabel(formType)}</p>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Unidad de Precio">
          <p className={'py-1 ' + offerSection.textBold}>{getPriceUnitLabel(formType)}</p>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Ciudad de la planta">
          <p className={'py-1 ' + offerSection.textBold}>{data.plantCity || '-'}</p>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Dirección de la planta">
          <p className={'py-1 ' + offerSection.textBold}>{data.plantAddress || '-'}</p>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Tolerancia Logística (%)">
          <p className={'py-1 ' + offerSection.textBold}>{data.logisticsTolerancePct}%</p>
        </FormRow>
        <div />
        <FormRow
          labelClassName={FORM_ROW_SUBTITLE_LABEL}
          label="Porcentaje de Garantía clase A"
          required
        >
          <div className="space-y-0.5">
            <p className={offerSection.textMuted}>
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
                className={form.inputW24}
                placeholder={`${GUARANTIA_CLASE_A_MIN}-${GUARANTIA_CLASE_A_MAX}`}
              />
              <span className={offerSection.textMedium}>%</span>
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
                    <p className={offerSection.textError}>
                      Debe estar entre {GUARANTIA_CLASE_A_MIN}% y {GUARANTIA_CLASE_A_MAX}%.
                    </p>
                  );
                }
                return null;
              })()}
          </div>
        </FormRow>
        <FormRow labelClassName={FORM_ROW_SUBTITLE_LABEL} label="Vigencia de la oferta" required>
          <div className="space-y-1.5">
            <p className={offerSection.textMuted}>
              Seleccione fecha de inicio y fin. El período no puede superar {VIGENCIA_MAX_DIAS} días.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className={offerSection.labelSmall}>Desde</label>
                <input
                  type="date"
                  value={getTodayISO()}
                  readOnly
                  className={offerSection.inputReadonly}
                />
              </div>
              <div>
                <label className={offerSection.labelSmall}>Hasta</label>
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
                  <p className={offerSection.textError}>
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
