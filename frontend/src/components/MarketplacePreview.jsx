import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, BedDouble, ArrowRight, ChevronDown, Calculator } from 'lucide-react';
import UnitConverter from './UnitConverter';
import '../styles/MarketplacePreview.css';

export default function MarketplacePreview({ setCurrentView }) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    price_range: ''
  });
  const [showConverter, setShowConverter] = useState(false);

  const fetchProperties = async () => {
    try {
      const query = new URLSearchParams();
      if (searchParams.keyword) query.append('keyword', searchParams.keyword);
      if (searchParams.location) query.append('location', searchParams.location);
      if (searchParams.price_range) query.append('price_range', searchParams.price_range);

      const res = await fetch(`http://localhost:8000/api/properties/?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.results || data);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
    const token = localStorage.getItem('access_token');
    if (token) {
      fetch('http://localhost:8000/api/auth/me/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => setCurrentUser(data))
      .catch(err => console.error('Error fetching user:', err));
    }
  }, []); // Run once on mount

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleBookClick = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('signin');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8000/api/properties/${propertyId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProperties(properties.filter(p => p.id !== propertyId));
      } else {
        alert('Failed to delete property.');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  const formatINR = (amount) => {
    const num = parseFloat(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <section id="properties" className="marketplace-section" style={{ paddingBottom: '4rem' }}>
      <div className="container">

        {/* Marketplace Section Header */}
        <div className="marketplace-header" style={{ marginBottom: '2rem' }}>
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
        </div>

        {/* Sleek Inline Search Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '0.75rem',
          marginBottom: '3.5rem',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Search Properties */}
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '0.75rem 1.25rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <input 
                type="text" 
                placeholder="Search keywords..." 
                value={searchParams.keyword}
                onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                style={{
                  background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem', width: '100%', outline: 'none'
                }}
              />
            </div>

            {/* Location */}
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '0.75rem 1.25rem', border: '1px solid rgba(255,255,255,0.04)' }}>
              <MapPin size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
              <input 
                type="text" 
                placeholder="City, neighborhood..." 
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                style={{
                  background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem', width: '100%', outline: 'none'
                }}
              />
            </div>

            {/* Price Range */}
            <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '0.75rem 1.25rem', border: '1px solid rgba(255,255,255,0.04)', position: 'relative' }}>
              <select 
                value={searchParams.price_range}
                onChange={(e) => setSearchParams({ ...searchParams, price_range: e.target.value })}
                style={{
                  appearance: 'none', background: 'transparent', border: 'none', color: searchParams.price_range ? '#fff' : 'var(--text-muted)', 
                  fontSize: '0.95rem', width: '100%', outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="" style={{ color: '#000' }}>Any Price</option>
                <option value="under_1cr" style={{ color: '#000' }}>Under ₹1 Cr</option>
                <option value="1cr_to_3cr" style={{ color: '#000' }}>₹1 Cr to ₹3 Cr</option>
                <option value="above_3cr" style={{ color: '#000' }}>Above ₹3 Cr</option>
              </select>
              <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '1.25rem', pointerEvents: 'none' }} />
            </div>

            <button type="submit" style={{
              background: 'var(--gradient-primary)', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '16px',
              fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'box-shadow 0.2s', flex: '0 1 auto'
            }}
            onMouseOver={(e) => e.target.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)'}
            onMouseOut={(e) => e.target.style.boxShadow = 'none'}
            >
              Search
            </button>
            
            {/* Unit Converter Button */}
            <button type="button" onClick={() => setShowConverter(true)} style={{
              background: 'rgba(255,255,255,0.05)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '0.75rem', borderRadius: '16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            title="Unit Converter"
            >
              <Calculator size={20} />
            </button>
          </form>
        </div>

        {showConverter && <UnitConverter onClose={() => setShowConverter(false)} />}

        {/* Listings Grid */}
        <div className="properties-grid">
          {properties.filter(p => p.status === 'available').length === 0 ? (
            <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', padding: '2rem 0' }}>
              No available properties found matching your criteria.
            </div>
          ) : (
            properties.filter(p => p.status === 'available').sort((a, b) => {
              const tierValues = { 'platinum': 4, 'gold': 3, 'silver': 2, 'bronze': 1 };
              const tierA = tierValues[a.builder_tier] || 0;
              const tierB = tierValues[b.builder_tier] || 0;
              return tierB - tierA; // Sort descending
            }).map((prop) => {
              const fallbackImg = prop.title.includes('Skyline') ? '/property_skyline_residences.png' :
                                  prop.title.includes('Azure')   ? '/property_azure_villa.png' :
                                  '/property_altura_penthouse.png';
              
              // We'll use the trust score and price from DB
              return (
                <div key={prop.id} className="property-card glass-card">
                  
                  {/* Header Image Placement */}
                  <div className="property-image-wrapper">
                    <span className="property-card-tag" style={{
                      background: prop.builder_tier === 'platinum' ? 'rgba(192, 132, 252, 0.9)' :
                                  prop.builder_tier === 'gold' ? 'rgba(250, 204, 21, 0.9)' :
                                  prop.builder_tier === 'silver' ? 'rgba(148, 163, 184, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                      color: prop.builder_tier === 'platinum' ? '#fff' :
                             prop.builder_tier === 'gold' ? '#000' :
                             prop.builder_tier === 'silver' ? '#000' : '#fff',
                      fontWeight: 600
                    }}>
                      {prop.builder_tier === 'platinum' ? 'Premium Listing' : 
                       prop.builder_tier === 'gold' ? 'Featured' :
                       prop.builder_tier === 'silver' ? 'Verified Builder' : 'New Listing'}
                    </span>
                    <div className="property-image-placeholder" style={{
                      backgroundImage: `url(${prop.images?.[0]?.image || fallbackImg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}>
                      {/* If no image exists we can just show the architectural drawing fallback */}
                      {(!prop.images || prop.images.length === 0) && !fallbackImg && (
                        <div className="property-arch-drawing">
                          <div className="arch-pillar short"></div>
                          <div className="arch-pillar tall" style={{ background: 'linear-gradient(to top, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.1))' }}></div>
                          <div className="arch-pillar medium"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="property-details">
                    <div className="property-row-1">
                      <span className="property-builder-name">{prop.builder_name || 'Verified Builder'}</span>
                      <span className="property-trust-rating">
                        <ShieldCheck size={12} />
                        {prop.trust_score} Trust
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
                        <span>Featured</span>
                      </div>
                      <div className="property-spec-item">
                        <span>📍 Prime Spot</span>
                      </div>
                    </div>

                    <div className="property-pricing-box" style={{ marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real Price</span>
                        <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>{formatINR(prop.price_in_inr)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#a855f7' }}>Discount Credit (2.5%)</span>
                        <span style={{ fontSize: '0.85rem', color: '#a855f7', fontWeight: 600 }}>- {formatINR(prop.price_in_inr * 0.025)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Final Price</span>
                        <span className="property-price" style={{ margin: 0, fontSize: '1.1rem' }}>{formatINR(prop.price_in_inr * 0.975)}</span>
                      </div>
                    </div>

                    <div className="property-row-footer" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0, display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {currentUser && currentUser.role === 'builder' && prop.builder === currentUser.id ? (
                        <button className="btn-card-view" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', width: '100%' }} onClick={() => handleDeleteProperty(prop.id)}>
                          Delete
                        </button>
                      ) : (
                        <>
                          <button className="btn-card-view" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', flex: 1, padding: '0.5rem' }} onClick={() => navigate(`/properties/${prop.id}`)}>
                            Details
                          </button>
                          <button className="btn-card-view" style={{ flex: 1, padding: '0.5rem' }} onClick={handleBookClick}>
                            Book Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
