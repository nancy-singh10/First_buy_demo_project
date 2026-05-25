import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CTA.css';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="container">
        <h2 className="cta-title">
          Your first home is<br />
          closer than you think.
        </h2>
        <p className="cta-subtitle">
          Start uploading receipts in under a minute. Watch your Property Credits grow.
        </p>
        <div className="cta-actions">
          <button className="btn-cta-primary" onClick={() => navigate('/dashboard')}>
            Create your account
          </button>
          <button className="btn-cta-secondary" onClick={() => navigate('/properties')}>
            Browse marketplace
          </button>
        </div>
      </div>
    </section>
  );
}
