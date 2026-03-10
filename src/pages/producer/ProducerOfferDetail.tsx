import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dummyOffers } from '../../data/offers';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { OfferPreviewContent } from '../../components/OfferPreviewContent';
import { page, typography, button } from '../../styles';

export const ProducerOfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const offer = dummyOffers.find((o) => o.id === id);

  if (!offer) {
    return (
      <div>
        <p className={typography.body}>Offer not found</p>
        <Link to="/producer/offers" className={typography.linkPrimary}>Back to offers</Link>
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
          { label: 'Offers', path: '/producer/offers' },
          { label: offer.offerCode },
        ]}
      />
      <div className="mt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className={page.headerTitle}>{offer.offerCode}</h1>
            <p className={`${typography.body} mt-1`}>
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
              <h3 className={`${page.cardTitle} mb-4`}>Start Sale</h3>
              <p className={`${typography.body} mb-4`}>
                Complete the form to start a new sale with this offer.
              </p>
              <button onClick={handleStartSale} className={button.primaryFull}>
                Start Sale
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
