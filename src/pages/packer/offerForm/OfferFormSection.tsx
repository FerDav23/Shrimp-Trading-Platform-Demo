import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Card } from '../../../components/Card';
import { Alert } from '../../../components/Alert';
import { form, typography, button, offerSection, toggle } from '../../../styles';
import type { OfferFormSectionProps, OfferFormData, PriceTier, Adjustment } from './types';
import type { PaymentTerm } from '../../../types';
import {
  getOfferLabel,
  isVigenciaExpired,
  isFormComplete,
  getIncompleteSections,
  sanitizePositiveDecimalInput,
  sanitizePositiveIntegerInput,
  toPositiveDecimal,
  toPositiveInteger,
} from './utils';
import { ADDITIONAL_CONDITION_MAX_LENGTH } from './constants';
import { PublishPreviewModal } from './PublishPreviewModal';
import { OfferFormGeneralInfo } from './OfferFormGeneralInfo';
import { OfferFormPriceTable } from './OfferFormPriceTable';
import { OfferFormQualityRequirements } from './OfferFormQualityRequirements';
import { OfferFormAdjustments } from './OfferFormAdjustments';
import { OfferFormPaymentTerms } from './OfferFormPaymentTerms';
import { OfferFormAdditionalConditions } from './OfferFormAdditionalConditions';

export const OfferFormSection: React.FC<OfferFormSectionProps> = ({
  formType,
  data,
  onChange,
  packingCompany,
}) => {
  const isLocked = data.isVisible;
  const [showPublishAlert, setShowPublishAlert] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [checklistAccepted, setChecklistAccepted] = useState(false);
  const [incompleteNum, setIncompleteNum] = useState<Record<string, string>>({});
  const priceTableSectionRef = useRef<HTMLElement>(null);
  const qualitySectionRef = useRef<HTMLElement>(null);

  const setNumInput = (
    key: string,
    raw: string,
    apply: (n: number | undefined) => void,
    opts?: { max?: number; min?: number; emptyValue?: number; integerOnly?: boolean }
  ) => {
    const integerOnly = opts?.integerOnly ?? false;
    const s = integerOnly ? sanitizePositiveIntegerInput(raw) : sanitizePositiveDecimalInput(raw);
    const isIncomplete = integerOnly ? false : (s === '' || s.endsWith('.'));
    if (integerOnly ? s === '' : isIncomplete) {
      setIncompleteNum((prev) =>
        s === ''
          ? (() => {
              const next = { ...prev };
              delete next[key];
              return next;
            })()
          : { ...prev, [key]: s }
      );
      apply(
        s === ''
          ? (opts?.emptyValue !== undefined ? opts.emptyValue : (integerOnly ? undefined : 0))
          : integerOnly
            ? toPositiveInteger(s, opts)
            : toPositiveDecimal(s, opts)
      );
    } else {
      setIncompleteNum((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      apply(integerOnly ? toPositiveInteger(s, opts) : toPositiveDecimal(s, opts));
    }
  };

  const numDisplay = (key: string, n: number | undefined): string =>
    incompleteNum[key] ?? (n !== undefined && n !== null ? String(n) : '');

  const setIncompleteNumBlur = (key: string) => {
    setIncompleteNum((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  useLayoutEffect(() => {
    const syncQualityHeight = () => {
      const tableEl = priceTableSectionRef.current;
      const qualityEl = qualitySectionRef.current;
      if (tableEl && qualityEl) {
        qualityEl.style.height = `${tableEl.offsetHeight}px`;
      }
    };
    syncQualityHeight();
    const tableEl = priceTableSectionRef.current;
    if (!tableEl) return;
    const ro = new ResizeObserver(syncQualityHeight);
    ro.observe(tableEl);
    return () => ro.disconnect();
  }, [data.priceTiers.length]);

  useEffect(() => {
    if (data.isVisible && data.validTo && isVigenciaExpired(data.validTo)) {
      onChange({ ...data, isVisible: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.validTo, data.isVisible]);

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
      setShowPublishAlert(true);
      return;
    }
    if (checked && isFormComplete(data)) {
      setShowPublishAlert(false);
      setChecklistAccepted(false);
      setShowPublishModal(true);
      return;
    }
    setShowPublishAlert(false);
    setShowPublishModal(false);
    onChange({ ...data, isVisible: checked });
  };

  const handleConfirmPublish = () => {
    if (!checklistAccepted) return;
    onChange({ ...data, isVisible: true });
    setShowPublishModal(false);
    setChecklistAccepted(false);
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

  const toggleQualityRequirement = (id: string) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const selected = data.selectedQualityRequirementIds.includes(id)
      ? data.selectedQualityRequirementIds.filter((x) => x !== id)
      : [...data.selectedQualityRequirementIds, id];
    onChange({ ...data, selectedQualityRequirementIds: selected });
  };

  const updateAdjustment = (index: number, field: keyof Adjustment, value: string | number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newAdj = [...data.adjustments];
    newAdj[index] = { ...newAdj[index], [field]: value };
    onChange({ ...data, adjustments: newAdj });
  };

  const updateColaDirectaTier = (index: number, field: keyof PriceTier, value: number | boolean) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newTiers = [...data.colaDirectaTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onChange({ ...data, colaDirectaTiers: newTiers });
  };

  type VentaLocalKey = keyof OfferFormData['ventaLocalPrices'];
  const updateVentaLocalPrice = (key: VentaLocalKey, value: number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, ventaLocalPrices: { ...data.ventaLocalPrices, [key]: value } });
  };

  const addPaymentTerm = () => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({
      ...data,
      paymentTerms: [...data.paymentTerms, { termType: 'CUSTOM', text: '' }],
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

  const updatePaymentTerm = (
    index: number,
    field: keyof PaymentTerm,
    value: string | number | undefined
  ) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    const newTerms = [...data.paymentTerms];
    newTerms[index] = { ...newTerms[index], [field]: value };
    onChange({ ...data, paymentTerms: newTerms });
  };

  const addAdditionalCondition = () => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({ ...data, additionalConditions: [...data.additionalConditions, ''] });
  };

  const updateAdditionalCondition = (index: number, value: string) => {
    if (isLocked) return;
    const trimmed = value.slice(0, ADDITIONAL_CONDITION_MAX_LENGTH);
    const newConditions = [...data.additionalConditions];
    newConditions[index] = trimmed;
    onChange({ ...data, additionalConditions: newConditions });
  };

  const removeAdditionalCondition = (index: number) => {
    if (isLocked) {
      handleEditAttempt();
      return;
    }
    onChange({
      ...data,
      additionalConditions: data.additionalConditions.filter((_, i) => i !== index),
    });
  };

  const inputProps = isLocked
    ? {
        readOnly: true,
        className: `w-full ${form.inputReadonly}`,
      }
    : {
        className: `w-full ${form.input}`,
      };

  return (
    <Card className="mt-1 mb-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className={typography.pageTitle}>
          Oferta - {getOfferLabel(formType)}
        </h2>
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <span className={form.label}>Oferta publicada</span>
          <div className="relative inline-block">
            <input
              type="checkbox"
              checked={data.isVisible}
              onChange={(e) => handleVisibilityChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className={toggle.track} />
            <div className={toggle.knob} />
          </div>
        </label>
      </div>

      {showPublishAlert && (
        <Alert
          variant="warning"
          title="No se puede publicar la oferta"
          description="Complete las siguientes secciones para activar el switch de oferta publicada:"
          items={getIncompleteSections(data)}
          onDismiss={() => setShowPublishAlert(false)}
          className="mb-3"
        />
      )}

      <PublishPreviewModal
        isOpen={showPublishModal}
        onClose={() => {
          setShowPublishModal(false);
          setChecklistAccepted(false);
        }}
        checklistAccepted={checklistAccepted}
        onChecklistChange={setChecklistAccepted}
        onConfirmPublish={handleConfirmPublish}
        data={data}
        formType={formType}
        packingCompany={packingCompany}
      />

      <OfferFormGeneralInfo
        formType={formType}
        data={data}
        isLocked={isLocked}
        updateData={updateData}
        inputProps={inputProps}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 items-stretch">
        <OfferFormPriceTable
          data={data}
          isLocked={isLocked}
          updatePriceTier={updatePriceTier}
          numDisplay={numDisplay}
          setNumInput={setNumInput}
          setIncompleteNumBlur={setIncompleteNumBlur}
          sectionRef={priceTableSectionRef}
        />
        <OfferFormQualityRequirements
          data={data}
          isLocked={isLocked}
          toggleQualityRequirement={toggleQualityRequirement}
          sectionRef={qualitySectionRef}
        />
      </div>

      <OfferFormAdjustments
        formType={formType}
        data={data}
        isLocked={isLocked}
        onChange={onChange}
        updateAdjustment={updateAdjustment}
        updateColaDirectaTier={updateColaDirectaTier}
        updateVentaLocalPrice={updateVentaLocalPrice}
        numDisplay={numDisplay}
        setNumInput={setNumInput}
        setIncompleteNumBlur={setIncompleteNumBlur}
      />

      <OfferFormPaymentTerms
        data={data}
        isLocked={isLocked}
        addPaymentTerm={addPaymentTerm}
        removePaymentTerm={removePaymentTerm}
        updatePaymentTerm={updatePaymentTerm}
        numDisplay={numDisplay}
        setNumInput={setNumInput}
        setIncompleteNumBlur={setIncompleteNumBlur}
        inputProps={inputProps}
      />

      <OfferFormAdditionalConditions
        data={data}
        isLocked={isLocked}
        addAdditionalCondition={addAdditionalCondition}
        updateAdditionalCondition={updateAdditionalCondition}
        removeAdditionalCondition={removeAdditionalCondition}
        updateData={updateData}
        numDisplay={numDisplay}
        setNumInput={setNumInput}
        setIncompleteNumBlur={setIncompleteNumBlur}
      />

      <div className={offerSection.footerPublish}>
        {showPublishAlert && (
          <Alert
            variant="warning"
            title="No se puede publicar la oferta"
            description="Complete las siguientes secciones para poder publicar la oferta:"
            items={getIncompleteSections(data)}
            onDismiss={() => setShowPublishAlert(false)}
            className="mb-2"
          />
        )}
        <button
          type="button"
          onClick={() => handleVisibilityChange(true)}
          className={button.primarySky}
          disabled={isLocked}
        >
          Publicar oferta
        </button>
      </div>
    </Card>
  );
};
