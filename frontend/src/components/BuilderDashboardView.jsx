import React from 'react';
import { Building, Tag, DollarSign, ShieldCheck, Activity, Users, Star } from 'lucide-react';
import '../styles/Dashboard.css'; // Uses existing styles

export default function BuilderDashboardView({ properties, setActiveTab, user }) {
  // Filter properties belonging to this builder
  const myProperties = properties.filter(p => p.builder === user.id);
  
  const activeListingsCount = myProperties.filter(p => p.status === 'available').length;
  const bookedProperties = myProperties.filter(p => p.status === 'booked');
  const bookedCount = bookedProperties.length;
  
  // Total Revenue (value of booked properties)
  const totalRevenue = bookedProperties.reduce((sum, p) => sum + Number(p.price_in_inr), 0);
  
  // Total Portfolio Value (available + booked)
  const portfolioValue = myProperties.reduce((sum, p) => sum + Number(p.price_in_inr), 0);
  
  const avgTrustScore = myProperties.length > 0 
    ? (myProperties.reduce((sum, p) => sum + Number(p.trust_score), 0) / myProperties.length).toFixed(1)
    : 'N/A';

  const formatINR = (amount) => {
    const num = parseFloat(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <>
      <div className="db-stats-row">
        <div className="db-stat-card">
          <div className="db-stat-top">
            <div className="db-stat-icon-wrapper" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}><Building size={16} /></div>
          </div>
          <div className="db-stat-val">{activeListingsCount}</div>
          <div className="db-stat-label">Active Listings</div>
        </div>

        <div className="db-stat-card">
          <div className="db-stat-top">
            <div className="db-stat-icon-wrapper" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}><Tag size={16} /></div>
          </div>
          <div className="db-stat-val">{bookedCount}</div>
          <div className="db-stat-label">Total Bookings</div>
        </div>

        <div className="db-stat-card">
          <div className="db-stat-top">
            <div className="db-stat-icon-wrapper" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><DollarSign size={16} /></div>
          </div>
          <div className="db-stat-val">{formatINR(totalRevenue)}</div>
          <div className="db-stat-label">Total Revenue</div>
        </div>

        <div className="db-stat-card">
          <div className="db-stat-top">
            <div className="db-stat-icon-wrapper" style={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6' }}><Activity size={16} /></div>
          </div>
          <div className="db-stat-val">{formatINR(portfolioValue)}</div>
          <div className="db-stat-label">Portfolio Value</div>
        </div>
        
        <div className="db-stat-card">
          <div className="db-stat-top">
            <div className="db-stat-icon-wrapper" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}><ShieldCheck size={16} /></div>
          </div>
          <div className="db-stat-val">{avgTrustScore}</div>
          <div className="db-stat-label">Avg Trust Score</div>
        </div>
      </div>

      <div className="db-charts-row">
        {/* Inventory Status (Donut Chart) */}
        <div className="db-chart-card">
          <div className="db-chart-header" style={{ marginBottom: '0.5rem' }}>
            <div>
              <h3 className="db-chart-title">Inventory Status</h3>
              <p className="db-chart-subtitle">Available vs Booked properties</p>
            </div>
          </div>
          <div className="donut-container">
            <div className="donut-chart" style={{
              background: `conic-gradient(var(--accent-purple) 0% ${(bookedCount / (myProperties.length || 1)) * 100}%, rgba(255,255,255,0.05) ${(bookedCount / (myProperties.length || 1)) * 100}% 100%)`
            }}>
              <div className="donut-inner">
                <span className="donut-val">{bookedCount}/{myProperties.length}</span>
                <span className="donut-label">Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Analytics (Simulated) */}
        <div className="db-chart-card">
          <div className="db-chart-header">
            <div>
              <h3 className="db-chart-title">Listing Engagement</h3>
              <p className="db-chart-subtitle">Property views over time (simulated)</p>
            </div>
          </div>
          <div className="svg-chart-container">
            <div className="chart-grid-bg"></div>
            <div className="chart-y-axis">
              <span>5k</span><span>4k</span><span>3k</span><span>2k</span><span>1k</span>
            </div>
            <div className="chart-x-axis">
              <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            </div>
            <svg className="svg-line" viewBox="0 0 500 150" preserveAspectRatio="none">
              <path d="M0,130 C100,120 150,80 250,90 C350,100 400,40 500,20" fill="none" stroke="#60a5fa" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Bookings & Manage */}
      <div className="db-data-row">
        <div className="db-chart-card" style={{ flex: 2 }}>
          <div className="db-chart-header">
            <h3 className="db-chart-title">Recent Bookings</h3>
            <span className="db-chart-action" onClick={() => setActiveTab('My Listings')}>View all</span>
          </div>
          <div className="db-list">
            {bookedProperties.length === 0 && <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>No properties booked yet.</div>}
            {bookedProperties.slice(0, 5).map(p => (
              <div key={p.id} className="db-list-item" style={{ alignItems: 'flex-start' }}>
                <div className="db-list-left">
                  <div className="db-list-icon"><Users size={14} /></div>
                  <div>
                    <div className="db-list-title">{p.title}</div>
                    <div className="db-list-sub" style={{ marginBottom: '4px' }}>{p.location}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ color: '#fff', marginBottom: '2px' }}>Buyer: {p.buyer_name || 'Unknown User'}</div>
                      {p.buyer_email && <div>{p.buyer_email}</div>}
                      {p.buyer_phone && <div>{p.buyer_phone}</div>}
                    </div>
                  </div>
                </div>
                <div className="db-list-right">
                  <div className="db-list-amt">{formatINR(p.price_in_inr)}</div>
                  <div className="db-list-yield" style={{ color: '#10b981', padding: 0 }}>Booked</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="db-chart-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <h3 className="db-chart-title">Manage Your Properties</h3>
          <p className="db-chart-subtitle">Add new listings or update existing ones.</p>
          <button className="btn-primary" onClick={() => setActiveTab('Add Property')} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>
            List New Property
          </button>
          <button className="btn-outline" onClick={() => setActiveTab('My Listings')} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            View My Listings
          </button>
        </div>
      </div>
    </>
  );
}
