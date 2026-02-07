import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { FormRow } from '../../components/FormRow';
import {
  ProductForm,
  PriceTier,
  QualityRequirement,
  Adjustment,
  PaymentTerm,
} from '../../types';

type OfferFormType = 'ENTERO' | 'COLA_DIRECTA' | 'CAMARON_VIVO';

interface OfferFormData {
  productForm: ProductForm;
  priceUnit: 'PER_LB' | 'PER_KG';
  validFrom: string;
  validTo: string;
  plantCity: string;
  plantAddress: string;
  logisticsTolerancePct: string;
  isVisible: boolean;
  priceTiers: PriceTier[];
  qualityRequirements: QualityRequirement[];
  adjustments: Adjustment[];
  paymentTerms: PaymentTerm[];
  guaranteeClassAPct: string;
}

const createEmptyOfferForm = (productForm: ProductForm): OfferFormData => ({
  productForm,
  priceUnit: 'PER_LB',
  validFrom: '',
  validTo: '',
  plantCity: '',
  plantAddress: '',
  logisticsTolerancePct: '10',
  isVisible: false,
  priceTiers: [{ sizeMin: 0, sizeMax: 0, price: 0, isActive: true }],
  qualityRequirements: [{ code: '', text: '' }],
  adjustments: [
    { type: 'CLASS_DISCOUNT', appliesToClass: 'A', amount: 0, unit: 'USD' },
    { type: 'CLASS_DISCOUNT', appliesToClass: 'B', amount: 0, unit: 'USD' },
    { type: 'CLASS_DISCOUNT', appliesToClass: 'C', amount: 0, unit: 'USD' },
  ],
  guaranteeClassAPct: '',
  paymentTerms: [
    { termType: 'ADVANCE', percent: 30, dueInHours: 24, trigger: '' },
    { termType: 'BALANCE', dueInHours: 168, trigger: '' },
  ],
});

const getOfferLabel = (type: OfferFormType): string => {
  const labels: Record<OfferFormType, string> = {
    ENTERO: 'Entero',
    COLA_DIRECTA: 'Cola Directa',
    CAMARON_VIVO: 'Camarón Vivo',
  };
  return labels[type];
};

const isFormComplete = (data: OfferFormData): boolean => {
  if (
    !data.validFrom ||
    !data.validTo ||
    !data.plantCity ||
    !data.plantAddress ||
    !data.logisticsTolerancePct
  ) {
    return false;
  }
  const hasValidPriceTiers = data.priceTiers.some(
    (t) => t.sizeMin > 0 && t.sizeMax > 0 && t.price > 0
  );
  const hasValidQualityReqs = data.qualityRequirements.some(
    (q) => q.code.trim() !== '' && q.text.trim() !== ''
  );
  const advanceTerm = data.paymentTerms.find((p) => p.termType === 'ADVANCE');
  const hasValidPaymentTerms = !!advanceTerm && (advanceTerm.percent ?? 0) > 0 && (advanceTerm.percent ?? 0) < 100;
  return hasValidPriceTiers && hasValidQualityReqs && hasValidPaymentTerms;
};

interface OfferFormSectionProps {
  formType: OfferFormType;
  data: OfferFormData;
  onChange: (data: OfferFormData) => void;
}

const OfferFormSection: React.FC<OfferFormSectionProps> = ({
  formType,
  data,
  onChange,
}) => {
  const isLocked = data.isVisible;

  const handleEditAttempt = () => {
    if (isLocked) {
      alert(
        'No puede modificar una oferta visible. Debe despublicar la oferta (desactivar el switch) para poder editarla.'
      );
    }
  };

  const updateData = (updates: Partial<OfferFormData>) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, ...updates });
  };

  const handleVisibilityChange = (checked: boolean) => {
    if (checked && !isFormComplete(data)) {
      alert(
        'Debe completar todos los campos (información general, tabla de precios con al menos un item válido, requisitos de calidad, y términos de pago) para hacer la oferta visible.'
      );
      return;
    }
    onChange({ ...data, isVisible: checked });
  };

  // Price table handlers
  const addPriceTier = () => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, priceTiers: [...data.priceTiers, { sizeMin: 0, sizeMax: 0, price: 0, isActive: true }] });
  };

  const removePriceTier = (index: number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    if (data.priceTiers.length <= 1) return;
    const newTiers = data.priceTiers.filter((_, i) => i !== index);
    onChange({ ...data, priceTiers: newTiers });
  };

  const updatePriceTier = (index: number, field: keyof PriceTier, value: number | boolean) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newTiers = [...data.priceTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onChange({ ...data, priceTiers: newTiers });
  };

  // Quality requirements handlers
  const addQualityReq = () => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, qualityRequirements: [...data.qualityRequirements, { code: '', text: '' }] });
  };

  const removeQualityReq = (index: number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    if (data.qualityRequirements.length <= 1) return;
    const newReqs = data.qualityRequirements.filter((_, i) => i !== index);
    onChange({ ...data, qualityRequirements: newReqs });
  };

  const updateQualityReq = (index: number, field: keyof QualityRequirement, value: string) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newReqs = [...data.qualityRequirements];
    newReqs[index] = { ...newReqs[index], [field]: value };
    onChange({ ...data, qualityRequirements: newReqs });
  };

  // Adjustments handlers (solo amount y unit, clase A/B/C fijas)
  const updateAdjustment = (index: number, field: keyof Adjustment, value: string | number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newAdj = [...data.adjustments];
    newAdj[index] = { ...newAdj[index], [field]: value };
    onChange({ ...data, adjustments: newAdj });
  };

  // Payment terms handlers
  const addPaymentTerm = () => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({
      ...data,
      paymentTerms: [
        ...data.paymentTerms,
        { termType: 'CUSTOM', text: '' },
      ],
    });
  };

  const removePaymentTerm = (index: number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    if (index < 2) return;
    const newTerms = data.paymentTerms.filter((_, i) => i !== index);
    onChange({ ...data, paymentTerms: newTerms });
  };

  const updatePaymentTerm = (index: number, field: keyof PaymentTerm, value: string | number | undefined) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newTerms = [...data.paymentTerms];
    newTerms[index] = { ...newTerms[index], [field]: value };
    onChange({ ...data, paymentTerms: newTerms });
  };

  const inputProps = isLocked ? { readOnly: true, className: 'w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed' } : { className: 'w-full border border-gray-300 rounded-md px-3 py-2' };

  return (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Oferta - {getOfferLabel(formType)}
        </h2>
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <span className="text-sm font-medium text-gray-700">Oferta publicada</span>
          <div className="relative inline-block">
            <input
              type="checkbox"
              checked={data.isVisible}
              onChange={(e) => handleVisibilityChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-600 transition-colors" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm border border-gray-200 transition-all peer-checked:left-6" />
          </div>
        </label>
      </div>

      {/* Información General */}
      <section className="mb-8 p-6 rounded-lg border border-gray-200 bg-sky-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 pb-3 border-b border-gray-200">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormRow label="Producto">
            <p className="py-2 text-gray-900">{getOfferLabel(formType)}</p>
          </FormRow>
          <FormRow label="Unidad de Precio">
            <p className="py-2 text-gray-900">{data.priceUnit === 'PER_LB' ? 'Por libra' : 'Por kilogramo'}</p>
          </FormRow>
          <FormRow label="Válido desde" required>
            <input
              type="date"
              value={data.validFrom}
              onChange={(e) => updateData({ validFrom: e.target.value })}
              {...inputProps}
            />
          </FormRow>
          <FormRow label="Válido hasta" required>
            <input
              type="date"
              value={data.validTo}
              onChange={(e) => updateData({ validTo: e.target.value })}
              {...inputProps}
            />
          </FormRow>
          <FormRow label="Ciudad de la planta">
            <p className="py-2 text-gray-900">{data.plantCity || '-'}</p>
          </FormRow>
          <FormRow label="Dirección de la planta">
            <p className="py-2 text-gray-900">{data.plantAddress || '-'}</p>
          </FormRow>
          <FormRow label="Tolerancia Logística (%)">
            <p className="py-2 text-gray-900">{data.logisticsTolerancePct}%</p>
          </FormRow>
        </div>
      </section>

      {/* Tabla de Precios */}
      <section className="mb-8 p-6 rounded-lg border border-gray-200 bg-sky-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Tabla de Precios</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Talla Min</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Talla Max</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio (USD)</th>
                {!isLocked && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.priceTiers.map((tier, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={tier.sizeMin || ''}
                      onChange={(e) => updatePriceTier(idx, 'sizeMin', Number(e.target.value) || 0)}
                      readOnly={isLocked}
                      className="w-20 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={tier.sizeMax || ''}
                      onChange={(e) => updatePriceTier(idx, 'sizeMax', Number(e.target.value) || 0)}
                      readOnly={isLocked}
                      className="w-20 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={tier.price || ''}
                      onChange={(e) => updatePriceTier(idx, 'price', Number(e.target.value) || 0)}
                      readOnly={isLocked}
                      className="w-24 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  {!isLocked && (
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removePriceTier(idx)}
                        disabled={data.priceTiers.length <= 1}
                        className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLocked && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={addPriceTier}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Añadir fila de precio
            </button>
          </div>
        )}
      </section>

      {/* Requisitos de Calidad */}
      <section className="mb-8 p-6 rounded-lg border border-gray-200 bg-sky-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Requisitos de Calidad</h3>
        <div className="space-y-3">
          {data.qualityRequirements.map((req, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={req.code}
                onChange={(e) => updateQualityReq(idx, 'code', e.target.value)}
                placeholder="Código (ej: NO_ARENA)"
                readOnly={isLocked}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                value={req.text}
                onChange={(e) => updateQualityReq(idx, 'text', e.target.value)}
                placeholder="Descripción"
                readOnly={isLocked}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => removeQualityReq(idx)}
                  disabled={data.qualityRequirements.length <= 1}
                  className="text-red-600 hover:text-red-700 text-sm px-2 disabled:opacity-50"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
        {!isLocked && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={addQualityReq}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Añadir requisito
            </button>
          </div>
        )}
      </section>

      {/* Ajustes por Clase */}
      <section className="mb-8 p-6 rounded-lg border border-gray-200 bg-sky-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 pb-3 border-b border-gray-200">Ajustes por Clase</h3>
        <p className="text-sm text-gray-500 mb-4">Moneda fija: USD. Defina el descuento por clase (A, B, C).</p>
        <FormRow label="Porcentaje de Garantía para la clase A" className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.guaranteeClassAPct}
              onChange={(e) => updateData({ guaranteeClassAPct: e.target.value })}
              readOnly={isLocked}
              className="w-28 border border-gray-300 rounded px-3 py-2"
              placeholder="Ej: 95"
            />
            <span className="text-sm font-medium text-gray-600">%</span>
          </div>
        </FormRow>
        <div className="space-y-4">
          {data.adjustments.map((adj, idx) => (
            <div key={adj.appliesToClass} className="flex flex-wrap items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900 w-20">Clase {adj.appliesToClass}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tipo de descuento:</span>
                <select
                  value={adj.unit}
                  onChange={(e) => updateAdjustment(idx, 'unit', e.target.value as 'USD' | 'PERCENT')}
                  disabled={isLocked}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="USD">Dólar por libra</option>
                  <option value="PERCENT">Porcentaje por libra</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Monto:</span>
                <input
                  type="number"
                  step="0.01"
                  value={adj.amount || ''}
                  onChange={(e) => updateAdjustment(idx, 'amount', Number(e.target.value) || 0)}
                  readOnly={isLocked}
                  className="w-28 border border-gray-300 rounded px-3 py-2"
                />
                <span className="text-sm font-medium text-gray-600 w-16">
                  {adj.unit === 'USD' ? 'USD' : '%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Términos de Pago */}
      <section className="mb-8 p-6 rounded-lg border border-gray-200 bg-sky-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Términos de Pago</h3>
        <div className="space-y-4">
          {data.paymentTerms.map((term, idx) => {
            if (term.termType === 'ADVANCE') {
              return (
                <div key="advance" className="border border-gray-200 rounded p-4 bg-gray-50/50">
                  <h4 className="font-medium text-gray-900 mb-3">Anticipo (requerido)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormRow label="Porcentaje (%)" required>
                      <input
                        type="number"
                        value={term.percent ?? ''}
                        onChange={(e) => updatePaymentTerm(idx, 'percent', Number(e.target.value) || 0)}
                        min="0"
                        max="100"
                        {...inputProps}
                      />
                    </FormRow>
                    <FormRow label="Vence en (horas)">
                      <input
                        type="number"
                        value={term.dueInHours ?? ''}
                        onChange={(e) => updatePaymentTerm(idx, 'dueInHours', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Ej: 24"
                        {...inputProps}
                      />
                    </FormRow>
                    <FormRow label="Condición/Trigger" className="md:col-span-2">
                      <input
                        type="text"
                        value={term.trigger ?? ''}
                        onChange={(e) => updatePaymentTerm(idx, 'trigger', e.target.value)}
                        placeholder="Ej: Confirmación de compra"
                        {...inputProps}
                      />
                    </FormRow>
                  </div>
                </div>
              );
            }
            if (term.termType === 'BALANCE') {
              const advancePercent = data.paymentTerms.find((p) => p.termType === 'ADVANCE')?.percent ?? 0;
              const balancePercent = 100 - advancePercent;
              return (
                <div key="balance" className="border border-gray-200 rounded p-4 bg-gray-50/50">
                  <h4 className="font-medium text-gray-900 mb-3">Saldo restante (requerido)</h4>
                  <p className="text-sm text-gray-600 mb-3">Porcentaje: {balancePercent}% (lo faltante después del anticipo)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormRow label="Vence en (horas)">
                      <input
                        type="number"
                        value={term.dueInHours ?? ''}
                        onChange={(e) => updatePaymentTerm(idx, 'dueInHours', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Ej: 168 (7 días)"
                        {...inputProps}
                      />
                    </FormRow>
                    <FormRow label="Condición/Trigger" className="md:col-span-2">
                      <input
                        type="text"
                        value={term.trigger ?? ''}
                        onChange={(e) => updatePaymentTerm(idx, 'trigger', e.target.value)}
                        placeholder="Ej: Entrega en planta"
                        {...inputProps}
                      />
                    </FormRow>
                  </div>
                </div>
              );
            }
            return (
              <div key={idx} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">Término opcional</h4>
                  {!isLocked && (
                    <button
                      type="button"
                      onClick={() => removePaymentTerm(idx)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <FormRow label="Descripción (texto libre)">
                  <textarea
                    value={term.text ?? ''}
                    onChange={(e) => updatePaymentTerm(idx, 'text', e.target.value)}
                    placeholder="Escriba cualquier término o condición adicional..."
                    readOnly={isLocked}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
                    rows={3}
                  />
                </FormRow>
              </div>
            );
          })}
        </div>
        {!isLocked && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={addPaymentTerm}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Añadir término opcional
            </button>
          </div>
        )}
      </section>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => alert('Oferta guardada (simulado)')}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 font-medium disabled:opacity-50"
          disabled={isLocked}
        >
          Guardar cambios
        </button>
      </div>
    </Card>
  );
};

export const PackerOffers: React.FC = () => {
  useAuth();
  const packerId = 'packer-rosasud';

  const existingOffers = dummyOffers.filter((o) => o.packingCompany.id === packerId);

  const mergeAdjustments = (existing: Adjustment[]): Adjustment[] => {
    const byClass = Object.fromEntries(existing.map((a) => [a.appliesToClass, a]));
    return (['A', 'B', 'C'] as const).map((cls) =>
      byClass[cls] ?? { type: 'CLASS_DISCOUNT' as const, appliesToClass: cls, amount: 0, unit: 'USD' as const }
    );
  };

  const mergePaymentTerms = (existing: PaymentTerm[]): PaymentTerm[] => {
    const advance = existing.find((p) => p.termType === 'ADVANCE') ?? { termType: 'ADVANCE' as const, percent: 30, dueInHours: 24, trigger: '' };
    const rawBalance = existing.find((p) => p.termType === 'BALANCE');
    const balance = rawBalance
      ? { ...rawBalance, dueInHours: rawBalance.dueInHours ?? (rawBalance.dueInDays ? rawBalance.dueInDays * 24 : 168), dueInDays: undefined }
      : { termType: 'BALANCE' as const, dueInHours: 168, trigger: '' };
    const custom = existing.filter((p) => p.termType !== 'ADVANCE' && p.termType !== 'BALANCE');
    return [advance, balance, ...custom.map((c) => ({ termType: 'CUSTOM' as const, text: c.text ?? '' }))];
  };

  const getInitialFormData = (formType: OfferFormType): OfferFormData => {
    const existing = existingOffers.find((o) => o.productForm === formType);
    if (existing) {
      return {
        productForm: existing.productForm,
        priceUnit: existing.priceUnit,
        validFrom: existing.validFrom,
        validTo: existing.validTo,
        plantCity: existing.plantLocation.city,
        plantAddress: existing.plantLocation.address,
        logisticsTolerancePct: String(existing.logisticsTolerancePct),
        isVisible: existing.status === 'PUBLISHED',
        priceTiers: existing.priceTiers,
        qualityRequirements: existing.qualityRequirements,
        adjustments: mergeAdjustments(existing.adjustments),
        paymentTerms: mergePaymentTerms(existing.paymentTerms),
        guaranteeClassAPct: existing.guaranteeClassAPct != null ? String(existing.guaranteeClassAPct) : '',
      };
    }
    return createEmptyOfferForm(formType);
  };

  const [formEntero, setFormEntero] = useState<OfferFormData>(() =>
    getInitialFormData('ENTERO')
  );
  const [formCola, setFormCola] = useState<OfferFormData>(() =>
    getInitialFormData('COLA_DIRECTA')
  );
  const [formVivo, setFormVivo] = useState<OfferFormData>(() =>
    getInitialFormData('CAMARON_VIVO')
  );

  const [activeTab, setActiveTab] = useState<OfferFormType>('ENTERO');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Ofertas</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['ENTERO', 'COLA_DIRECTA', 'CAMARON_VIVO'] as OfferFormType[]).map((tab) => (
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

      {activeTab === 'ENTERO' && (
        <OfferFormSection
          formType="ENTERO"
          data={formEntero}
          onChange={setFormEntero}
        />
      )}
      {activeTab === 'COLA_DIRECTA' && (
        <OfferFormSection
          formType="COLA_DIRECTA"
          data={formCola}
          onChange={setFormCola}
        />
      )}
      {activeTab === 'CAMARON_VIVO' && (
        <OfferFormSection
          formType="CAMARON_VIVO"
          data={formVivo}
          onChange={setFormVivo}
        />
      )}
    </div>
  );
};
