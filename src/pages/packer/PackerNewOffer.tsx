import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { FormRow } from '../../components/FormRow';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const PackerNewOffer: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productForm: 'ENTERO',
    priceUnit: 'PER_LB',
    validFrom: '',
    validTo: '',
    logisticsTolerancePct: '10',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would create the offer
    alert('Oferta creada exitosamente (simulado)');
    navigate('/packer/offers');
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Mis Ofertas', path: '/packer/offers' },
          { label: 'Crear Oferta' },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Nueva Oferta</h1>
        <form onSubmit={handleSubmit}>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información General
            </h2>
            <FormRow label="Producto" required>
              <select
                value={formData.productForm}
                onChange={(e) =>
                  setFormData({ ...formData, productForm: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="ENTERO">Entero</option>
                <option value="COLA_DIRECTA">Cola Directa</option>
              </select>
            </FormRow>

            <FormRow label="Unidad de Precio" required>
              <select
                value={formData.priceUnit}
                onChange={(e) =>
                  setFormData({ ...formData, priceUnit: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="PER_LB">Por libra</option>
                <option value="PER_KG">Por kilogramo</option>
              </select>
            </FormRow>

            <div className="grid grid-cols-2 gap-4">
              <FormRow label="Válido desde" required>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </FormRow>
              <FormRow label="Válido hasta" required>
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) =>
                    setFormData({ ...formData, validTo: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </FormRow>
            </div>

            <FormRow label="Tolerancia Logística (%)" required>
              <input
                type="number"
                value={formData.logisticsTolerancePct}
                onChange={(e) =>
                  setFormData({ ...formData, logisticsTolerancePct: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="0"
                max="100"
                required
              />
            </FormRow>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-4">
                Nota: En una implementación completa, aquí se agregarían las tablas de
                precios, requisitos de calidad, términos de pago, etc.
              </p>
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Guardar como Borrador
              </button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};
