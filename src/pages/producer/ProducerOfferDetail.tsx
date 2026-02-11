import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { OfferPreviewContent } from '../../components/OfferPreviewContent';

export const ProducerOfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const offer = dummyOffers.find((o) => o.id === id);

  if (!offer) {
    return (
      <div>
        <p>Oferta no encontrada</p>
        <Link to="/producer/offers">Volver a ofertas</Link>
      </div>
    );
  }

  const handleStartSale = () => {
    navigate(`/producer/sales/new?offerId=${offer.id}`);
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Ofertas', path: '/producer/offers' },
          { label: offer.offerCode },
        ]}
      />
      <div className="mt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{offer.offerCode}</h1>
            <p className="text-gray-600 mt-1">
              {offer.packingCompany.name} - {offer.productForm}
            </p>
          </div>
          <StatusBadge status={offer.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OfferPreviewContent offer={offer} />
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Iniciar Venta
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Completa el formulario para iniciar una nueva venta con esta oferta.
              </p>
              <button
                onClick={handleStartSale}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Iniciar Venta
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
