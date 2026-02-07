import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { dummyOffers } from '../../data/offers';
//import { dummySales } from '../../data/sales';
import { Card } from '../../components/Card';
import { FormRow } from '../../components/FormRow';
import { Money } from '../../components/Money';
import { Breadcrumbs } from '../../components/Breadcrumbs';
//import { useAuth } from '../../contexts/AuthContext';

export const ProducerNewSale: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  //const { user } = useAuth();
  const offerId = searchParams.get('offerId');
  const offer = dummyOffers.find((o) => o.id === offerId);

  const [sizeRange, setSizeRange] = useState<{ min: number; max: number } | null>(null);
  const [quantityLb, setQuantityLb] = useState<string>('');
  const [harvestDate, setHarvestDate] = useState<string>('');
  const [pickupCity, setPickupCity] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');

  useEffect(() => {
    if (!offer) {
      navigate('/producer/offers');
    }
  }, [offer, navigate]);

  if (!offer) return null;

  const availableTiers = offer.priceTiers.filter((t) => t.isActive);

  const calculateEstimatedPrice = () => {
    if (!sizeRange || !quantityLb) return 0;
    const tier = availableTiers.find(
      (t) => t.sizeMin === sizeRange.min && t.sizeMax === sizeRange.max
    );
    if (!tier) return 0;
    const basePrice = tier.price * parseFloat(quantityLb);
    return basePrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeRange || !quantityLb || !harvestDate || !pickupCity || !pickupAddress) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Create new sale (in real app, this would be an API call)
   /*
    const _newSale = {
      id: `sale-${Date.now()}`,
      offerId: offer.id,
      producerId: user?.id || '',
      packingCompanyId: offer.packingCompany.id,
      productForm: offer.productForm,
      sizeRangeSelected: sizeRange,
      quantityLb: parseFloat(quantityLb),
      pickupLocation: {
        city: pickupCity,
        address: pickupAddress,
      },
      deliveryPlant: offer.plantLocation,
      logisticsStatus: 'PENDING_PICKUP' as const,
      paymentStatus: 'PENDING' as const,
      createdAt: new Date().toISOString(),
      estimatedHarvestDate: harvestDate,
    };
*/
    // In a real app, this would be saved via API
    // For now, we'll just navigate to the sales list
    alert('Venta creada exitosamente (simulado)');
    navigate('/producer/sales');
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Ofertas', path: '/producer/offers' },
          { label: offer.offerCode, path: `/producer/offers/${offer.id}` },
          { label: 'Nueva Venta' },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Venta</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalles de la Venta
                </h2>

                <FormRow label="Oferta" required>
                  <input
                    type="text"
                    value={offer.offerCode}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </FormRow>

                <FormRow label="Talla" required>
                  <select
                    value={sizeRange ? `${sizeRange.min}-${sizeRange.max}` : ''}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-').map(Number);
                      setSizeRange({ min, max });
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Selecciona una talla</option>
                    {availableTiers.map((tier, idx) => (
                      <option key={idx} value={`${tier.sizeMin}-${tier.sizeMax}`}>
                        {tier.sizeMin}/{tier.sizeMax} -{' '}
                        <Money amount={tier.price} /> / {offer.priceUnit.replace('PER_', '')}
                      </option>
                    ))}
                  </select>
                </FormRow>

                <FormRow label="Cantidad (lb)" required>
                  <input
                    type="number"
                    value={quantityLb}
                    onChange={(e) => setQuantityLb(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                    step="0.01"
                    required
                  />
                </FormRow>

                <FormRow label="Fecha Estimada de Cosecha" required>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </FormRow>

                <FormRow label="Ciudad de Recolección" required>
                  <input
                    type="text"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Ej: Guayaquil"
                    required
                  />
                </FormRow>

                <FormRow label="Dirección de Recolección" required>
                  <textarea
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Dirección completa de la piscina"
                    required
                  />
                </FormRow>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumen
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Empacadora:</span>
                    <span className="font-medium">{offer.packingCompany.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Producto:</span>
                    <span className="font-medium">{offer.productForm}</span>
                  </div>
                  {sizeRange && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Talla:</span>
                      <span className="font-medium">
                        {sizeRange.min}/{sizeRange.max}
                      </span>
                    </div>
                  )}
                  {quantityLb && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cantidad:</span>
                      <span className="font-medium">{quantityLb} lb</span>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-base font-semibold">
                      <span>Precio Estimado:</span>
                      <Money amount={calculateEstimatedPrice()} />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-6 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Confirmar Venta
                </button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
