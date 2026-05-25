import React from 'react';
import { Scan, Calculator, Building, BarChart3, ShieldCheck, Target, ArrowRight } from 'lucide-react';
import '../styles/Capabilities.css';

export default function Capabilities() {
  const capabilities = [
    {
      icon: <Scan size={24} />,
      title: 'Smart Receipt Scanner',
      desc: 'OCR-powered scanner reads receipts instantly and auto-categorises every expense.',
    },
    {
      icon: <Calculator size={24} />,
      title: 'AI Affordability Engine',
      desc: 'Predicts your real buying power across cities, banks and property types.',
    },
    {
      icon: <Building size={24} />,
      title: 'Property Marketplace',
      desc: 'Curated listings from verified, rated builders with transparent EMIs.',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Financial Insights',
      desc: 'Beautiful dashboards turn your spending into actionable saving moves.',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Builder Trust Score',
      desc: 'Independent trust scoring on every developer — delivery, quality, disputes.',
    },
    {
      icon: <Target size={24} />,
      title: 'Home Goal Planner',
      desc: 'Timeline predictions that show exactly when your dream home is in reach.',
    }
  ];

  return (
    <section className="capabilities-section">
      <div className="container">
        
        <div className="section-tag-wrapper" style={{ justifyContent: 'center' }}>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge-dot purple"></span>
            CAPABILITIES
          </div>
        </div>

        <div className="section-title-wrapper" style={{ textAlign: 'center', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title">
            A premium toolkit<br />
            <span className="text-gradient">for first-time owners.</span>
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Tools designed with the precision of a private bank and the warmth of a friend who's bought a home before.
          </p>
        </div>

        <div className="capabilities-grid">
          {capabilities.map((cap, i) => (
            <div key={i} className="cap-card">
              <div className="cap-icon-wrapper">
                {cap.icon}
              </div>
              <h3 className="cap-title">{cap.title}</h3>
              <p className="cap-desc">{cap.desc}</p>
              <a href="#learn-more" className="cap-link">
                Learn more <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
