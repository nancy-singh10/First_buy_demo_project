import React from 'react';
import { ShieldCheck, MapPin, BedDouble, ArrowRight } from 'lucide-react';
import '../styles/MarketplacePreview.css';

export default function MarketplacePreview({ setCurrentView }) {
  const listings = [
    {
      id: 'prop-1',
      title: 'Skyline Residences',
      builder: 'DLF Group',
      location: 'Sec 54, Gurgaon',
      trust: 98,
      price: '₹1.85 Cr',
      specs: '3 BHK',
      tag: 'Builder Verified'
    },
    {
      id: 'prop-2',
      title: 'Emerald Meadows',
      builder: 'Godrej Properties',
      location: 'Whitefield, Bangalore',
      trust: 96,
      price: '₹1.20 Cr',
      specs: '2 & 3 BHK',
      tag: 'Hot Listing'
    },
    {
      id: 'prop-3',
      title: 'Royal Horizon',
      builder: 'Lodha Group',
      location: 'Worli, Mumbai',
      trust: 99,
      price: '₹4.50 Cr',
      specs: '4 BHK',
      tag: 'Ultra Luxury'
    }
  ];

  return (
    <section id="properties" className="marketplace-section">
      <div className="container">
        
        {/* Marketplace Section Header */}
        <div className="marketplace-header">
          <div className="marketplace-titles">
            <div className="badge" style={{ alignSelf: 'flex-start' }}>
              <span className="badge-dot blue"></span>
              Marketplace
            </div>
            <h2 className="marketplace-title text-gradient">
              Hand-picked homes,<br />transparent trust.
            </h2>
            <p className="marketplace-desc">
              Every listing is independently rated. Every builder is verified.
            </p>
          </div>
          
          <button className="btn-outline" onClick={() => setCurrentView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            View all listings <ArrowRight size={16} />
          </button>
        </div>

        {/* Listings Grid */}
        <div className="properties-grid">
          {listings.map((prop) => (
            <div key={prop.id} className="property-card glass-card">
              
              {/* Header Image Placement */}
              <div className="property-image-wrapper">
                <span className="property-card-tag">{prop.tag}</span>
                <div className="property-image-placeholder">
                  {/* Styled Architectural Wireframe drawing using divs */}
                  <div className="property-arch-drawing">
                    <div className="arch-pillar short"></div>
                    <div className="arch-pillar tall" style={{ background: 'linear-gradient(to top, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.1))' }}></div>
                    <div className="arch-pillar medium"></div>
                  </div>
                </div>
              </div>

              {/* Body Details */}
              <div className="property-details">
                <div className="property-row-1">
                  <span className="property-builder-name">{prop.builder}</span>
                  <span className="property-trust-rating">
                    <ShieldCheck size={12} />
                    {prop.trust} Trust
                  </span>
                </div>
                
                <h3 className="property-card-title">{prop.title}</h3>
                
                <div className="property-card-loc" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="var(--text-muted)" />
                  {prop.location}
                </div>

                <div className="property-specs">
                  <div className="property-spec-item">
                    <BedDouble size={14} />
                    <span>{prop.specs}</span>
                  </div>
                  <div className="property-spec-item">
                    <span>📍 Prime Spot</span>
                  </div>
                </div>

                <div className="property-row-footer">
                  <div className="property-price">{prop.price}</div>
                  <button className="btn-card-view" onClick={() => setCurrentView('dashboard')}>
                    Unlock Offer
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
