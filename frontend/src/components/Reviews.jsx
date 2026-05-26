import React, { useState, useEffect } from 'react';
import { Star, X, Plus } from 'lucide-react';
import '../styles/Reviews.css';

export default function Reviews() {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews and properties on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revRes, propRes] = await Promise.all([
          fetch('http://localhost:8000/api/reviews/'),
          fetch('http://localhost:8000/api/properties/')
        ]);
        if (revRes.ok) {
          const data = await revRes.json();
          // Map backend fields to frontend props
          setReviews(data.results || data);
        }
        if (propRes.ok) {
          const pData = await propRes.json();
          setProperties(pData.results || pData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Modal form states
  const [newPropertyId, setNewPropertyId] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [errorMsg, setErrorMsg] = useState('');

  const handleWriteReviewSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newPropertyId || !newQuote) {
      setErrorMsg('Please select a property and write a review.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setErrorMsg('You must be logged in to write a review.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property: newPropertyId,
          rating: newStars,
          comment: newQuote
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || Object.values(data).flat().join(', ') || 'Failed to submit review');
      }

      const createdReview = await res.json();
      setReviews(prev => [createdReview, ...prev]);
      setShowModal(false);
      setNewQuote('');
      setNewStars(5);
      setNewPropertyId('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-tag-wrapper">
          <div className="badge">
            <span className="badge-dot"></span>
            Reviews
          </div>
        </div>

        <div className="section-title-wrapper" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">Trusted by future homeowners.</h2>
        </div>

        {/* Rating Breakdown block */}
        <div className="reviews-summary-row glass-card" style={{ padding: '2.5rem', background: 'rgba(13, 11, 35, 0.45)' }}>
          <div className="reviews-score-card">
            <div className="reviews-score-num">4.9</div>
            <div className="reviews-stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" stroke="none" />
              ))}
            </div>
            <div className="reviews-score-sub">12,480 verified reviews</div>
          </div>

          <div className="reviews-dist-list">
            {[
              { star: 5, pct: 88 },
              { star: 4, pct: 8 },
              { star: 3, pct: 2 },
              { star: 2, pct: 1 },
              { star: 1, pct: 1 }
            ].map((row) => (
              <div key={row.star} className="dist-bar-item">
                <span className="dist-label">{row.star}</span>
                <div className="dist-bar-bg">
                  <div className="dist-bar-fill" style={{ width: `${row.pct}%` }}></div>
                </div>
                <span className="dist-pct">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write a review button row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Write a review
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="reviews-grid">
          {reviews.length === 0 && <p style={{ color: '#fff' }}>No reviews yet. Be the first!</p>}
          {reviews.map((rev) => (
            <div key={rev.id} className="review-card glass-card">
              <div className="review-card-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < rev.rating ? 'currentColor' : 'none'}
                    stroke={i < rev.rating ? 'none' : 'currentColor'}
                  />
                ))}
              </div>
              <blockquote className="review-card-quote">
                "{rev.comment}"
              </blockquote>
              <div className="review-card-profile">
                <div className="profile-avatar">{getInitials(rev.user_name)}</div>
                <div className="profile-info">
                  <span className="profile-name">{rev.user_name}</span>
                  <span className="profile-role">Reviewed: {rev.property_title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Modal Form overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title">Share your experience</h3>
              <div className="modal-close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </div>
            </div>

            <form onSubmit={handleWriteReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {errorMsg && (
                <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                  {errorMsg}
                </div>
              )}

              <div className="form-group-col">
                <label>Select Property</label>
                <select 
                  className="form-input-text" 
                  value={newPropertyId} 
                  onChange={(e) => setNewPropertyId(e.target.value)}
                  required
                >
                  <option value="">-- Choose a property --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group-col">
                <label>Rating</label>
                <div className="star-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`star-icon ${star <= newStars ? 'filled' : ''}`}
                      fill={star <= newStars ? 'currentColor' : 'none'}
                      onClick={() => setNewStars(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group-col">
                <label>Review description</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell us how FirstBuy AI helped you..."
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  className="form-textarea-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
