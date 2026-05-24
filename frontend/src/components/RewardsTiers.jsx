import React, { useState } from 'react';
import { Award, ShieldAlert, CheckCircle2, Lock, Flame, Compass, BadgeCheck } from 'lucide-react';
import '../styles/RewardsTiers.css';

export default function RewardsTiers() {
  const [selectedTierIdx, setSelectedTierIdx] = useState(2); // Default to Gold

  const tiers = [
    {
      name: 'Bronze',
      multiplier: '1x credit rate',
      feature: 'Basic insights',
      progress: 100,
      credits: '₹50,000',
      statusText: 'Tier Completed',
      iconClass: 'bronze'
    },
    {
      name: 'Silver',
      multiplier: '1.25x credits',
      feature: 'Priority OCR',
      progress: 100,
      credits: '₹1,50,000',
      statusText: 'Tier Completed',
      iconClass: 'silver'
    },
    {
      name: 'Gold',
      multiplier: '1.5x credits',
      feature: 'Concierge support',
      progress: 68,
      credits: '₹3,82,450',
      statusText: '68% to Platinum — keep going.',
      iconClass: 'gold'
    },
    {
      name: 'Platinum',
      multiplier: '2x credits',
      feature: 'Builder pre-launch access',
      progress: 0,
      credits: 'LOCKED',
      statusText: 'Locked — Need ₹5,00,000 to unlock',
      iconClass: 'platinum'
    }
  ];

  const badges = [
    { name: 'Smart Saver', status: 'Earned', icon: <Flame size={20} /> },
    { name: 'Future Homeowner', status: 'Earned', icon: <Compass size={20} /> },
    { name: 'Elite Investor', status: 'Locked', icon: <Award size={20} /> },
    { name: 'Goal Crusher', status: 'Locked', icon: <BadgeCheck size={20} /> }
  ];

  const activeTier = tiers[selectedTierIdx];

  return (
    <section id="rewards" className="rewards-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-tag-wrapper">
          <div className="badge">
            <span className="badge-dot"></span>
            Rewards
          </div>
        </div>

        <div className="section-title-wrapper">
          <h2 className="section-title">The more you spend smartly,<br />the closer your home gets.</h2>
          <p className="section-subtitle">
            Climb tiers, unlock multipliers, and collect badges that matter.
          </p>
        </div>

        {/* Current Tier Tracker Box */}
        <div className="active-tier-tracker">
          <div className="tier-tracker-left">
            <div className="tier-tracker-header">
              <div className={`tier-badge-icon ${activeTier.iconClass}`}>
                <Award size={24} />
              </div>
              <div>
                <h3 className="tier-tracker-name">{activeTier.name}</h3>
                <span className="tier-tracker-next">{activeTier.statusText}</span>
              </div>
            </div>

            <div className="tier-progress-container">
              <div className="tier-progress-bar-bg">
                <div
                  className="tier-progress-bar-fill"
                  style={{ width: `${activeTier.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="tier-tracker-right">
            <div className="tier-credits-label">Lifetime Credits</div>
            <div className="tier-credits-value">
              {activeTier.name === 'Platinum' ? '₹5,00,000 (Goal)' : activeTier.credits}
            </div>
          </div>
        </div>

        {/* Tiers Grid selector */}
        <div className="tiers-grid">
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              className={`tier-card glass-card ${selectedTierIdx === idx ? 'active' : ''}`}
              onClick={() => setSelectedTierIdx(idx)}
            >
              <div className="tier-card-header">
                <div style={{ color: selectedTierIdx === idx ? 'var(--accent-purple)' : 'var(--text-muted)' }}>
                  {tier.progress === 100 ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : tier.progress > 0 ? (
                    <Flame size={16} color="#fde047" />
                  ) : (
                    <Lock size={16} color="var(--text-muted)" />
                  )}
                </div>
                <h4 className="tier-card-title">{tier.name}</h4>
              </div>

              <ul className="tier-card-bullets">
                <li className="tier-card-bullet-item">
                  <span className="tier-bullet-dot"></span>
                  {tier.multiplier}
                </li>
                <li className="tier-card-bullet-item">
                  <span className="tier-bullet-dot"></span>
                  {tier.feature}
                </li>
              </ul>

              <div className="tier-card-progress-bar-bg">
                <div
                  className="tier-card-progress-bar-fill"
                  style={{ width: `${tier.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges Sub-section */}
        <div className="badges-header">
          <h3 className="badges-title">Your badges</h3>
        </div>

        <div className="badges-grid">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`badge-card ${badge.status === 'Locked' ? 'locked' : ''}`}
            >
              <div className="badge-card-icon">
                {badge.status === 'Locked' ? <Lock size={18} /> : badge.icon}
              </div>
              <div className="badge-card-info">
                <span className="badge-card-title">{badge.name}</span>
                <span className="badge-card-status">{badge.status}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
