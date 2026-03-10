import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Offer } from '../../types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { page, form, typography } from '../../styles';

export const ProducerOffers: React.FC = () => {
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterUnit, setFilterUnit] = useState<string>('all');

  const publishedOffers = dummyOffers.filter((o) => o.status === 'PUBLISHED');

  const filteredOffers = publishedOffers.filter((offer) => {
    if (filterCompany !== 'all' && offer.packingCompany.id !== filterCompany) {
      return false;
    }
    if (filterProduct !== 'all' && offer.productForm !== filterProduct) {
      return false;
    }
    if (filterUnit !== 'all' && offer.priceUnit !== filterUnit) {
      return false;
    }
    return true;
  });

  const companies = Array.from(
    new Set(publishedOffers.map((o) => o.packingCompany.id))
  );

  const columns = [
    {
      header: 'Code',
      accessor: (offer: Offer) => (
        <Link to={`/producer/offers/${offer.id}`} className={typography.linkPrimary}>
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
    {
      header: 'Actions',
      accessor: (offer: Offer) => (
        <Link to={`/producer/offers/${offer.id}`} className={typography.linkPrimarySm}>
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className={page.title}>Available Offers</h1>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={form.label}>Packer</label>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className={form.selectFilter}
            >
              <option value="all">All</option>
              {companies.map((id) => {
                const company = publishedOffers.find((o) => o.packingCompany.id === id)
                  ?.packingCompany;
                return (
                  <option key={id} value={id}>
                    {company?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className={form.label}>Product</label>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className={form.selectFilter}
            >
              <option value="all">All</option>
              <option value="ENTERO">Whole</option>
              <option value="COLA_DIRECTA">Direct Tail</option>
              <option value="CAMARON_VIVO">Live Shrimp</option>
            </select>
          </div>
          <div>
            <label className={form.label}>Unit</label>
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className={form.selectFilter}
            >
              <option value="all">All</option>
              <option value="PER_LB">Per pound</option>
              <option value="PER_KG">Per kilogram</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <DataTable data={filteredOffers} columns={columns} />
      </Card>
    </div>
  );
};
