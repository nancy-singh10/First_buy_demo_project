import React from 'react';
import { Target, ShieldCheck, Trophy, Crown, ArrowRight, CheckCircle2 } from 'lucide-react';
import '../styles/RewardsTiers.css'; // Reuse existing styles where possible

export default function BuilderRewards({ properties, user }) {
  // Calculate total bookings for this builder
  const myProperties = properties.filter(p => p.builder === user.id);
  const totalBookings = myProperties.filter(p => p.status === 'booked').length;
  
  // Calculate next tier requirements
  const tiers = [
    { id: 'bronze', name: 'Bronze', req: 0, icon: <Target size={24} color="#d97706" /> },
    { id: 'silver', name: 'Silver', req: 2, icon: <ShieldCheck size={24} color="#94a3b8" /> },
    { id: 'gold', name: 'Gold', req: 10, icon: <Trophy size={24} color="#facc15" /> },
    { id: 'platinum', name: 'Platinum', req: 25, icon: <Crown size={24} color="#c084fc" /> }
  ];

  const currentTierIndex = tiers.findIndex(t => t.id === user.tier) || 0;
  const currentTier = tiers[currentTierIndex];
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  
  const progressPercent = nextTier ? Math.min(100, Math.max(0, ((totalBookings - currentTier.req) / (nextTier.req - currentTier.req)) * 100)) : 100;

  return (
    <div className="rewards-page" style={{ padding: '0 1rem' }}>
      <div className="rewards-header">
        <div>
          <h2 className="rewards-title">Builder Program</h2>
          <p className="rewards-subtitle">Unlock powerful marketplace tools by successfully booking properties.</p>
        </div>
        <div className="current-tier-badge" style={{ 
          background: user.tier === 'platinum' ? 'rgba(168, 85, 247, 0.15)' : 
                      user.tier === 'gold' ? 'rgba(234, 179, 8, 0.15)' : 
                      user.tier === 'silver' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(217, 119, 6, 0.15)',
          color: user.tier === 'platinum' ? '#c084fc' : 
                 user.tier === 'gold' ? '#facc15' : 
                 user.tier === 'silver' ? '#cbd5e1' : '#d97706',
          border: `1px solid ${user.tier === 'platinum' ? '#c084fc' : user.tier === 'gold' ? '#facc15' : user.tier === 'silver' ? '#cbd5e1' : '#d97706'}`
        }}>
          {currentTier.icon}
          <span>{currentTier.name} Builder</span>
        </div>
      </div>

      <div className="progress-section glass-card" style={{ marginBottom: '3rem' }}>
        <div className="progress-header">
          <h3>Booking Milestone Progress</h3>
          <span className="points-display">{totalBookings} / {nextTier ? nextTier.req : 'MAX'} Bookings</span>
        </div>
        
        <div className="progress-track">
          <div className="progress-fill" style={{ 
            width: `${progressPercent}%`,
            background: user.tier === 'platinum' ? 'linear-gradient(90deg, #c084fc, #a855f7)' : 
                        user.tier === 'gold' ? 'linear-gradient(90deg, #facc15, #eab308)' : 
                        user.tier === 'silver' ? 'linear-gradient(90deg, #cbd5e1, #94a3b8)' : 'linear-gradient(90deg, #d97706, #b45309)'
          }}></div>
        </div>
        
        {nextTier && (
          <p className="progress-text" style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
            Get <strong>{nextTier.req - totalBookings} more bookings</strong> to unlock {nextTier.name} Tier!
          </p>
        )}
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>Tier Benefits Overview</h3>
      <div className="tiers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        
        <div className={`tier-card glass-card ${user.tier === 'bronze' ? 'active-tier' : ''}`} style={{ opacity: user.tier !== 'bronze' && currentTierIndex > 0 ? 0.6 : 1 }}>
          <div className="tier-icon-wrapper" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}><Target size={28} /></div>
          <h4>Bronze Builder</h4>
          <p className="tier-req">Default Tier</p>
          <ul className="tier-benefits">
            <li><CheckCircle2 size={14} color="#10b981" /> Standard platform fee (5%)</li>
            <li><CheckCircle2 size={14} color="#10b981" /> Basic marketplace visibility</li>
          </ul>
        </div>

        <div className={`tier-card glass-card ${user.tier === 'silver' ? 'active-tier' : ''}`} style={{ opacity: user.tier !== 'silver' && currentTierIndex > 1 ? 0.6 : 1 }}>
          <div className="tier-icon-wrapper" style={{ background: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' }}><ShieldCheck size={28} /></div>
          <h4>Silver Builder</h4>
          <p className="tier-req">2+ Bookings</p>
          <ul className="tier-benefits">
            <li><CheckCircle2 size={14} color="#10b981" /> Reduced platform fee (4%)</li>
            <li><CheckCircle2 size={14} color="#10b981" /> "Verified" badge on listings</li>
          </ul>
        </div>

        <div className={`tier-card glass-card ${user.tier === 'gold' ? 'active-tier' : ''}`} style={{ opacity: user.tier !== 'gold' && currentTierIndex > 2 ? 0.6 : 1 }}>
          <div className="tier-icon-wrapper" style={{ background: 'rgba(250, 204, 21, 0.1)', color: '#facc15' }}><Trophy size={28} /></div>
          <h4>Gold Builder</h4>
          <p className="tier-req">10+ Bookings</p>
          <ul className="tier-benefits">
            <li><CheckCircle2 size={14} color="#10b981" /> Reduced platform fee (2.5%)</li>
            <li><CheckCircle2 size={14} color="#10b981" /> Priority search placement</li>
            <li><CheckCircle2 size={14} color="#10b981" /> "Featured" tag on properties</li>
          </ul>
        </div>

        <div className={`tier-card glass-card ${user.tier === 'platinum' ? 'active-tier' : ''}`}>
          <div className="tier-icon-wrapper" style={{ background: 'rgba(192, 132, 252, 0.1)', color: '#c084fc' }}><Crown size={28} /></div>
          <h4>Platinum Builder</h4>
          <p className="tier-req">25+ Bookings</p>
          <ul className="tier-benefits">
            <li><CheckCircle2 size={14} color="#10b981" /> 0% platform fee</li>
            <li><CheckCircle2 size={14} color="#10b981" /> Top marketplace visibility</li>
            <li><CheckCircle2 size={14} color="#10b981" /> Dedicated account manager</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
