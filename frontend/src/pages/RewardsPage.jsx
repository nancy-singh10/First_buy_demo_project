import React from 'react';
import RewardsTiers from '../components/RewardsTiers';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function RewardsPage() {
  const navigate = useNavigate();
  const setCurrentView = (view) => {
    if (view === 'dashboard') navigate('/dashboard');
    else if (view === 'landing') navigate('/');
    else if (view === 'contact') navigate('/contact');
  };

  return (
    <>
      <main style={{ paddingTop: '80px', minHeight: '80vh', paddingBottom: '4rem' }}>
        <RewardsTiers />

        <div className="container" style={{ marginTop: '4rem' }}>
          <div className="section-title-wrapper" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge" style={{ margin: '0 auto 1rem auto' }}>
              <span className="badge-dot" style={{ background: '#3b82f6' }}></span>
              For Builders
            </div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Builder Reward Tiers</h2>
            <p className="section-subtitle">Unlock premium marketplace features by successfully booking properties.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: '#d97706', marginBottom: '0.5rem' }}>Bronze Builder</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Default Starting Tier</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>✓ Standard platform fee (5%)</li>
                <li>✓ Basic marketplace visibility</li>
              </ul>
            </div>
            
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Silver Builder</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>2+ Successful Bookings</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>✓ Reduced platform fee (4%)</li>
                <li>✓ "Verified Builder" badge</li>
              </ul>
            </div>

            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: '#facc15', marginBottom: '0.5rem' }}>Gold Builder</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>10+ Successful Bookings</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>✓ Reduced platform fee (2.5%)</li>
                <li>✓ Priority search placement</li>
                <li>✓ "Featured" property tags</li>
              </ul>
            </div>

            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
              <h3 style={{ color: '#c084fc', marginBottom: '0.5rem' }}>Platinum Builder</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>25+ Successful Bookings</p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>✓ 0% platform fee</li>
                <li>✓ Top marketplace visibility</li>
                <li>✓ Dedicated account manager</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
