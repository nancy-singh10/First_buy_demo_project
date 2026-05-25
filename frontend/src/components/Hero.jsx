import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, ShieldCheck, ArrowRight } from 'lucide-react';
import '../styles/Hero.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero-section">
      <div className="container hero-grid">
        {/* Left Side: Copy and Actions */}
        <div className="hero-content">
          <div className="beta-badge">
            <span className="beta-dot"></span>
            Now in private beta — backed by Series A investors
          </div>
          
          <h1 className="hero-title">
            <span className="grad-1">Turn everyday</span>
            <br />
            <span className="grad-2">spending into</span>
            <br />
            <span className="grad-1">home ownership.</span>
          </h1>
          
          <p className="hero-description">
            Upload your bills, earn Property Credits, and move toward owning your home — guided by AI that understands your money like you do.
          </p>
          
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Start earning credits <ArrowRight size={16} />
            </button>
            <button className="btn-outline" onClick={() => navigate('/properties')}>
              Explore properties
            </button>
            <button className="btn-link-play" onClick={() => navigate('/dashboard')}>
              <div className="play-icon-wrapper">
                <Play size={12} fill="currentColor" />
              </div>
              Watch demo
            </button>
          </div>
          
          <div className="hero-tags">
            <div className="tag-badge">
              <Sparkles size={12} color="#a855f7" /> AI Powered
            </div>
            <div className="tag-badge">
              <ShieldCheck size={12} color="#3b82f6" /> Verified Builders
            </div>
            <div className="tag-badge">
              <span>🎁</span> Earn Rewards
            </div>
            <div className="tag-badge">
              <span>🏠</span> Marketplace
            </div>
          </div>
        </div>

        {/* Right Side: Hologram Showcase */}
        <div className="hero-showcase">
          <div className="showcase-container">
            {/* Top-Left Floating Info Card */}
            <div className="credits-float-card">
              <div className="credits-label">Credits Earned</div>
              <div className="credits-value">+₹12,480</div>
              <div className="credits-subtitle">From 7 receipts this month</div>
            </div>

            {/* Hologram Core Container */}
            <div className="hologram-visual">
              {/* Spinning Rings */}
              <div className="holo-orbit"></div>
              <div className="holo-orbit-2"></div>
              <div className="holo-glow-ring"></div>

              {/* CSS 3D Villa */}
              <div className="css-villa">
                <div className="villa-base"></div>
                <div className="villa-glass-room">
                  <div className="villa-light"></div>
                </div>
                <div className="villa-pool"></div>

                {/* Floating holographic screens */}
                <div className="holo-screen-1">
                  <div style={{ color: '#818cf8', fontWeight: 'bold' }}>OCR Scan</div>
                  <div style={{ color: '#10b981', fontSize: '0.4rem' }}>✓ verified</div>
                  <div style={{ color: '#fff', fontSize: '0.35rem' }}>Rent receipt</div>
                </div>
                <div className="holo-screen-2">
                  <div style={{ color: '#a855f7', fontWeight: 'bold' }}>Credit Yield</div>
                  <div style={{ color: '#fff', fontSize: '0.4rem' }}>₹4,500 Cr</div>
                  <div style={{ color: '#3b82f6', fontSize: '0.35rem' }}>+1.5x Multiplier</div>
                </div>
              </div>
            </div>

            {/* Bottom-Right Floating Info Card */}
            <div className="builder-popover">
              <div className="builder-status">
                <ShieldCheck size={12} />
                Builder verified • Trust 98
              </div>
              <div className="builder-name">Skyline Residences</div>
              <div className="builder-price">₹1.85 Cr - 3 BHK - Gurgaon</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
