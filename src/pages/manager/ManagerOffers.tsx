import React from 'react';
import { Link } from 'react-router-dom';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Offer } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ManagerOffers: React.FC = () => {
  const columns = [
    {
      header: 'Código',
      accessor: (offer: Offer) => (
        <Link
          to={`/packer/offers/${offer.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {offer.offerCode}
        </Link>
      ),
    },
    {
      header: 'Empacadora',
      accessor: (offer: Offer) => offer.packingCompany.name,
    },
    {
      header: 'Producto',
      accessor: (offer: Offer) => offer.productForm,
    },
    {
      header: 'Unidad',
      accessor: (offer: Offer) => offer.priceUnit.replace('PER_', '/'),
    },
    {
      header: 'Vigencia',
      accessor: (offer: Offer) =>
        `${format(new Date(offer.validFrom), 'dd MMM', { locale: es })} - ${format(new Date(offer.validTo), 'dd MMM yyyy', { locale: es })}`,
    },
    {
      header: 'Estado',
      accessor: (offer: Offer) => <StatusBadge status={offer.status} />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Todas las Ofertas</h1>
      <Card>
        <DataTable data={dummyOffers} columns={columns} />
      </Card>
    </div>
  );
};
