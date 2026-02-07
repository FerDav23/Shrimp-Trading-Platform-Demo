import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { Money } from '../../components/Money';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const PackerOfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const offer = dummyOffers.find((o) => o.id === id);
  if (!offer) {
    return (
      <div>
        <p>Oferta no encontrada</p>
        <Link to="/packer/offers">Volver a ofertas</Link>
      </div>
    );
  }

  const handlePublish = () => {
    // In real app, this would update the offer status
    alert('Oferta publicada exitosamente (simulado)');
    navigate('/packer/offers');
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Mis Ofertas', path: '/packer/offers' },
          { label: offer.offerCode },
        ]}
      />
      <div className="mt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{offer.offerCode}</h1>
            <p className="text-gray-600 mt-1">{offer.productForm}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={offer.status} />
            {offer.status === 'DRAFT' && (
              <button
                onClick={handlePublish}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
              >
                Publicar
              </button>
            )}
          </div>
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información General
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Producto:</span>
              <span className="ml-2 font-medium">{offer.productForm}</span>
            </div>
            <div>
              <span className="text-gray-600">Unidad:</span>
              <span className="ml-2 font-medium">
                {offer.priceUnit.replace('PER_', '/')}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Vigencia:</span>
              <span className="ml-2 font-medium">
                {format(new Date(offer.validFrom), 'dd MMM yyyy', { locale: es })} -{' '}
                {format(new Date(offer.validTo), 'dd MMM yyyy', { locale: es })}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Tolerancia Logística:</span>
              <span className="ml-2 font-medium">{offer.logisticsTolerancePct}%</span>
            </div>
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tabla de Precios
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Talla
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offer.priceTiers.map((tier, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {tier.sizeMin}/{tier.sizeMax}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <Money amount={tier.price} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {tier.isActive ? (
                        <span className="text-green-600">Activo</span>
                      ) : (
                        <span className="text-gray-400">Inactivo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Requisitos de Calidad
          </h2>
          <ul className="space-y-2">
            {offer.qualityRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-sm text-gray-700">{req.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
