import React, { useState } from 'react';
import { Star, X, Plus } from 'lucide-react';
import '../styles/Reviews.css';

export default function Reviews() {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Ananya R.',
      role: 'Bought a 3BHK in Bengaluru',
      stars: 5,
      quote: 'From upload to handover — flawless. The credit calculator alone shaved ₹4.1L off my registration.'
    },
    {
      id: 2,
      name: 'Vikram S.',
      role: 'First-time owner, Mumbai',
      stars: 5,
      quote: 'Builder trust scores were the deciding factor. Pulled out of a deal that later went sour. Saved my life.'
    },
    {
      id: 3,
      name: 'Sneha K.',
      role: 'Doctor, Hyderabad',
      stars: 4,
      quote: "Wish I'd known about FirstBuy earlier. The AI Insights page is unreasonably good."
    },
    {
      id: 4,
      name: 'Aman D.',
      role: 'Architect, Pune',
      stars: 5,
      quote: 'Looks like a luxury fintech app, behaves like a kind friend. That balance is rare.'
    },
    {
      id: 5,
      name: 'Tara M.',
      role: 'Founder, Delhi',
      stars: 5,
      quote: 'I have used every property platform in India. This is the only one I open every morning.'
    },
    {
      id: 6,
      name: 'Karan V.',
      role: 'Consultant, Gurgaon',
      stars: 4,
      quote: 'Genuinely useful. The home goal planner kept me grounded — and patient.'
    }
  ]);

  // Modal form states
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [newStars, setNewStars] = useState(5);

  const handleWriteReviewSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newQuote) return;

    const newReview = {
      id: Date.now(),
      name: newName,
      role: newRole || 'Verified User',
      stars: newStars,
      quote: newQuote
    };

    setReviews(prev => [newReview, ...prev]);
    setShowModal(false);
    
    // Clear inputs
    setNewName('');
    setNewRole('');
    setNewQuote('');
    setNewStars(5);
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
          {reviews.map((rev) => (
            <div key={rev.id} className="review-card glass-card">
              <div className="review-card-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < rev.stars ? 'currentColor' : 'none'}
                    stroke={i < rev.stars ? 'none' : 'currentColor'}
                  />
                ))}
              </div>
              <blockquote className="review-card-quote">
                "{rev.quote}"
              </blockquote>
              <div className="review-card-profile">
                <div className="profile-avatar">{getInitials(rev.name)}</div>
                <div className="profile-info">
                  <span className="profile-name">{rev.name}</span>
                  <span className="profile-role">{rev.role}</span>
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
              <div className="form-group-col">
                <label>Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya R."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-input-text"
                />
              </div>

              <div className="form-group-col">
                <label>Context / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bought a 3BHK in Gurgaon"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="form-input-text"
                />
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
