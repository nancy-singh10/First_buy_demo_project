import React, { useState, useEffect } from 'react';
import { Heart, MapPin, ShieldCheck, Star, Trash2, Home, ArrowRight } from 'lucide-react';
import '../styles/SavedHomes.css';

const API = 'http://localhost:8000';

export default function SavedHomes({ onBrowse }) {
  const [saved, setSaved]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res   = await fetch(`${API}/api/properties/saved/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.results || data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSaved(); }, []);

  /* Toggle unsave from this view */
  const handleUnsave = async (propertyId) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${API}/api/properties/${propertyId}/save/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(prev => prev.filter(s => s.property !== propertyId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="sh-loading">
      <div className="sh-spinner" />
      <span>Loading saved homes…</span>
    </div>
  );

  return (
    <div className="sh-root">

      {/* Header */}
      <div className="sh-header">
        <div>
          <h2 className="sh-title"><Heart size={22} color="#f472b6" fill="#f472b6" /> Saved Homes</h2>
          <p className="sh-subtitle">{saved.length} {saved.length === 1 ? 'property' : 'properties'} in your wishlist</p>
        </div>
        <button className="sh-browse-btn" onClick={onBrowse}>
          Browse more <ArrowRight size={14} />
        </button>
      </div>

      {/* Empty state */}
      {saved.length === 0 && (
        <div className="sh-empty">
          <Heart size={52} color="#f472b6" opacity={0.25} />
          <h3>No saved homes yet</h3>
          <p>Click the ♡ heart icon on any property card to save it here.</p>
          <button className="sh-browse-btn" onClick={onBrowse}>Browse Properties</button>
        </div>
      )}

      {/* Property grid */}
      <div className="sh-grid">
        {saved.map(({ id, property_detail: prop, saved_at, property: propId }) => {
          if (!prop) return null;

          const fallbackImg = prop.title.includes('Skyline') ? '/property_skyline_residences.png' :
                              prop.title.includes('Azure')   ? '/property_azure_villa.png' :
                              '/property_altura_penthouse.png';

          const primaryImg = prop.images?.find(i => i.is_primary)?.image
            || prop.images?.[0]?.image || fallbackImg;
          const imgSrc = primaryImg
            ? (primaryImg.startsWith('http') ? primaryImg : `${API}${primaryImg}`)
            : null;

          return (
            <div key={id} className="sh-card">
              {/* Image */}
              <div className="sh-img-wrap">
                {imgSrc ? (
                  <img src={imgSrc} alt={prop.title} className="sh-img" />
                ) : (
                  <div className="sh-img-placeholder"><Home size={32} opacity={0.3} /></div>
                )}
                <div className="sh-trust-badge">
                  <ShieldCheck size={11} /> Trust {prop.trust_score}
                </div>
                {/* Unsave button */}
                <button
                  className="sh-unsave-btn"
                  title="Remove from saved"
                  onClick={() => handleUnsave(prop.id)}
                >
                  <Heart size={15} fill="#f472b6" color="#f472b6" />
                </button>
              </div>

              {/* Body */}
              <div className="sh-body">
                <div className="sh-prop-title">{prop.title}</div>
                <div className="sh-prop-loc"><MapPin size={12} /> {prop.location}</div>

                <div className="sh-price-row">
                  <div>
                    <div className="sh-price">₹{parseFloat(prop.price_in_inr).toLocaleString('en-IN')}</div>
                    <div className="sh-credit-label">
                      Up to ₹{parseFloat(prop.max_credit_discount_allowed).toLocaleString('en-IN')} via credits
                    </div>
                  </div>
                  <div className="sh-builder">{prop.builder_name}</div>
                </div>

                <div className="sh-saved-on">
                  Saved on {new Date(saved_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>

                <button
                  className="sh-remove-btn"
                  onClick={() => handleUnsave(prop.id)}
                >
                  <Trash2 size={13} /> Remove from wishlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
