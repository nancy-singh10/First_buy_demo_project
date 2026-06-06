import React, { useState, useEffect } from 'react';
import { Heart, MapPin, ShieldCheck, Star, Trash2, Home, ArrowRight, TrendingUp, Target, Wallet } from 'lucide-react';
import '../styles/SavedHomes.css';

const API = 'http://localhost:8000';

export default function SavedHomes({ onBrowse, user }) {
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

  // ── Formatting helpers ──
  const formatINR = (val) => {
    const num = parseFloat(val);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const userCredits = parseFloat(user?.total_credits || 0);

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

      {/* Wallet Balance Banner */}
      {saved.length > 0 && (
        <div className="sh-wallet-banner">
          <div className="sh-wallet-icon-wrap">
            <Wallet size={20} />
          </div>
          <div className="sh-wallet-info">
            <span className="sh-wallet-label">Your FirstBuy Credit Balance</span>
            <span className="sh-wallet-value">{formatINR(userCredits)}</span>
          </div>
          <div className="sh-wallet-hint">
            <TrendingUp size={14} />
            Every receipt moves you closer to your dream home
          </div>
        </div>
      )}

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

          // ── Progress Meter Calculations ──
          const homePrice = parseFloat(prop.price_in_inr) || 0;
          const downPaymentNeeded = parseFloat(prop.max_credit_discount_allowed) || 0;
          const progressPercent = downPaymentNeeded > 0
            ? Math.min((userCredits / downPaymentNeeded) * 100, 100)
            : 0;
          const remaining = Math.max(downPaymentNeeded - userCredits, 0);
          const isComplete = progressPercent >= 100;

          // Dynamic color based on progress
          const progressColor = isComplete ? '#10b981'
            : progressPercent >= 50 ? '#3b82f6'
            : progressPercent >= 20 ? '#8b5cf6'
            : '#f472b6';

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
                    <div className="sh-price">{formatINR(homePrice)}</div>
                    <div className="sh-credit-label">
                      Down payment via credits: {formatINR(downPaymentNeeded)}
                    </div>
                  </div>
                  <div className="sh-builder">{prop.builder_name}</div>
                </div>

                {/* ═══ HOME PROGRESS METER ═══ */}
                <div className="sh-progress-meter">
                  <div className="sh-progress-header">
                    <div className="sh-progress-title-row">
                      <Target size={14} color={progressColor} />
                      <span className="sh-progress-title">Home Progress Meter</span>
                    </div>
                    <span className="sh-progress-percent" style={{ color: progressColor }}>
                      {progressPercent.toFixed(1)}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="sh-progress-track">
                    <div
                      className="sh-progress-fill"
                      style={{
                        width: `${progressPercent}%`,
                        background: isComplete
                          ? 'linear-gradient(90deg, #10b981, #34d399)'
                          : `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`
                      }}
                    >
                      {progressPercent >= 8 && (
                        <div className="sh-progress-fill-glow" />
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="sh-progress-details">
                    <div className="sh-progress-detail">
                      <span className="sh-detail-label">Dream Home Price</span>
                      <span className="sh-detail-value">{formatINR(homePrice)}</span>
                    </div>
                    <div className="sh-progress-detail">
                      <span className="sh-detail-label">Down Payment Needed</span>
                      <span className="sh-detail-value" style={{ color: '#c084fc' }}>{formatINR(downPaymentNeeded)}</span>
                    </div>
                    <div className="sh-progress-detail">
                      <span className="sh-detail-label">Your Credit Balance</span>
                      <span className="sh-detail-value" style={{ color: '#34d399' }}>{formatINR(userCredits)}</span>
                    </div>
                    <div className="sh-progress-detail">
                      <span className="sh-detail-label">{isComplete ? '✅ Ready!' : 'Still Needed'}</span>
                      <span className="sh-detail-value" style={{ color: isComplete ? '#10b981' : '#f472b6' }}>
                        {isComplete ? 'Goal reached!' : formatINR(remaining)}
                      </span>
                    </div>
                  </div>

                  {/* Motivational tag */}
                  <div className="sh-progress-tag" style={{ borderColor: `${progressColor}33`, color: progressColor }}>
                    {isComplete
                      ? '🎉 You have enough credits for this down payment!'
                      : progressPercent >= 50
                        ? '🔥 You\'re over halfway there — keep going!'
                        : progressPercent >= 10
                          ? '📈 Great progress! Every receipt moves you closer.'
                          : '🚀 Start uploading receipts to build your progress!'}
                  </div>
                </div>
                {/* ═══ END PROGRESS METER ═══ */}

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
