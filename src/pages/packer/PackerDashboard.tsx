import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dummyOffers } from '../../data/offers';
import { dummySales } from '../../data/sales';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const PackerDashboard: React.FC = () => {
  useAuth();
  const myOffers = dummyOffers.filter(
    (o) => o.packingCompany.id === 'packer-rosasud'
  );
  const publishedOffers = myOffers.filter((o) => o.status === 'PUBLISHED');
  const draftOffers = myOffers.filter((o) => o.status === 'DRAFT');
  const mySales = dummySales.filter(
    (s) => s.packingCompanyId === 'packer-rosasud'
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Ofertas Publicadas</div>
          <div className="text-3xl font-bold text-green-600">{publishedOffers.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Borradores</div>
          <div className="text-3xl font-bold text-yellow-600">{draftOffers.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Ventas Recibidas</div>
          <div className="text-3xl font-bold text-blue-600">{mySales.length}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mis Ofertas</h2>
            <Link
              to="/packer/offers"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {myOffers.slice(0, 3).map((offer) => (
              <div
                key={offer.id}
                className="border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/packer/offers/${offer.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {offer.offerCode}
                    </Link>
                    <p className="text-sm text-gray-600">{offer.productForm}</p>
                  </div>
                  <StatusBadge status={offer.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ventas Recientes</h2>
            <Link
              to="/packer/sales"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {mySales.slice(0, 3).map((sale) => (
              <div
                key={sale.id}
                className="border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/packer/sales/${sale.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      Venta #{sale.id.split('-')[1]}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {sale.quantityLb} lb - {sale.productForm}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(sale.createdAt), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <StatusBadge status={sale.logisticsStatus} />
                    <StatusBadge status={sale.paymentStatus} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
