import React from 'react';
import { Link } from 'react-router-dom';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Offer } from '../../types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { page, typography } from '../../styles';

export const ManagerOffers: React.FC = () => {
  const columns = [
    {
      header: 'Code',
      accessor: (offer: Offer) => (
        <Link to={`/packer/offers/${offer.id}`} className={typography.linkPrimary}>
          {offer.offerCode}
        </Link>
      ),
    },
    {
      header: 'Packer',
      accessor: (offer: Offer) => offer.packingCompany.name,
    },
    {
      header: 'Product',
      accessor: (offer: Offer) => offer.productForm,
    },
    {
      header: 'Unit',
      accessor: (offer: Offer) => offer.priceUnit.replace('PER_', '/'),
    },
    {
      header: 'Valid',
      accessor: (offer: Offer) =>
        `${format(new Date(offer.validFrom), 'dd MMM', { locale: enUS })} - ${format(new Date(offer.validTo), 'dd MMM yyyy', { locale: enUS })}`,
    },
    {
      header: 'Status',
      accessor: (offer: Offer) => <StatusBadge status={offer.status} />,
    },
  ];

  return (
    <div>
      <h1 className={page.title}>All Offers</h1>
      <Card>
        <DataTable data={dummyOffers} columns={columns} />
      </Card>
    </div>
  );
};
