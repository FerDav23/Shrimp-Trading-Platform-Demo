import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { Offer } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
      header: 'Código',
      accessor: (offer: Offer) => (
        <Link to={`/producer/offers/${offer.id}`} className={typography.linkPrimary}>
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
    {
      header: 'Acciones',
      accessor: (offer: Offer) => (
        <Link to={`/producer/offers/${offer.id}`} className={typography.linkPrimarySm}>
          Ver
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className={page.title}>Ofertas Disponibles</h1>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={form.label}>Empacadora</label>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className={form.selectFilter}
            >
              <option value="all">Todas</option>
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
            <label className={form.label}>Producto</label>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className={form.selectFilter}
            >
              <option value="all">Todos</option>
              <option value="ENTERO">Entero</option>
              <option value="COLA_DIRECTA">Cola Directa</option>
              <option value="CAMARON_VIVO">Camarón Vivo</option>
            </select>
          </div>
          <div>
            <label className={form.label}>Unidad</label>
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className={form.selectFilter}
            >
              <option value="all">Todas</option>
              <option value="PER_LB">Por libra</option>
              <option value="PER_KG">Por kilogramo</option>
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
