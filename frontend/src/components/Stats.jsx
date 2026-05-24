import React from 'react';
import '../styles/Stats.css';

export default function Stats() {
  const stats = [
    { number: '50K+', label: 'Active users' },
    { number: '₹100Cr+', label: 'Property rewards' },
    { number: '200+', label: 'Verified builders' },
    { number: '15K+', label: 'Listed properties' },
  ];

  return (
    <div className="stats-bar container">
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stats-item">
            <div className="stats-number">{stat.number}</div>
            <div className="stats-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
