import React, { useState } from 'react';
import {
  Home, UploadCloud, LayoutGrid, Wallet, Gift, BarChart2, Heart, Users, Settings,
  Search, Bell, Activity, ArrowRight, ShieldCheck, Star, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navItems = [
    { label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { label: 'Upload Receipt', icon: <UploadCloud size={18} /> },
    { label: 'Properties', icon: <Home size={18} /> },
    { label: 'Wallet', icon: <Wallet size={18} /> },
    { label: 'Rewards', icon: <Gift size={18} /> },
    { label: 'AI Insights', icon: <BarChart2 size={18} /> },
    { label: 'Saved Homes', icon: <Heart size={18} /> },
    { label: 'Community', icon: <Users size={18} /> },
    { label: 'Settings', icon: <Settings size={18} /> },
  ];

  const receipts = [
    { title: 'Whole Foods', type: 'Groceries', amt: '₹4,820', yield: '+₹240' },
    { title: 'Indian Oil', type: 'Fuel', amt: '₹3,200', yield: '+₹160' },
    { title: 'Tata Power', type: 'Utilities', amt: '₹2,140', yield: '+₹107' },
    { title: 'Netflix', type: 'Subscriptions', amt: '₹549', yield: '+₹32' },
  ];

  const notifications = [
    { title: 'Credits applied', text: '₹12,480 added to your wallet' },
    { title: 'Builder verified', text: 'Avasa Developers passed trust audit' },
    { title: 'New match', text: '3 homes match your goal budget' },
    { title: 'Rewards', text: "You're 32% from Platinum tier" },
  ];

  const properties = [
    {
      img: '/property_skyline_residences.png',
      tag: 'New Launch',
      title: 'Skyline Residences',
      loc: 'Gurgaon, Sector 65',
      trust: 'Trust 96',
      rating: '4.8',
      price: '₹1.85 Cr',
      emi: 'EMI ₹1.42L / mo',
      credits: '₹4.2L applicable'
    },
    {
      img: '/property_azure_villa.png',
      tag: 'Premium',
      title: 'Azure Villa Estate',
      loc: 'Whitefield, Bengaluru',
      trust: 'Trust 98',
      rating: '4.9',
      price: '₹3.40 Cr',
      emi: 'EMI ₹2.61L / mo',
      credits: '₹6.8L applicable'
    },
    {
      img: '/property_altura_penthouse.png',
      tag: 'Featured',
      title: 'Altura Sky Penthouse',
      loc: 'Lower Parel, Mumbai',
      trust: 'Trust 99',
      rating: '4.95',
      price: '₹6.20 Cr',
      emi: 'EMI ₹4.76L / mo',
      credits: '₹12L applicable'
    }
  ];

  return (
    <div className="dashboard-portal">
      
      {/* ── Sidebar ── */}
      <aside className="db-sidebar">
        <div className="db-brand" onClick={() => navigate('/')}>
          <div className="logo-icon-wrapper" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
            <Home size={16} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div className="logo-text">
            <div className="logo-title" style={{ fontSize: '1rem' }}>FirstBuy <span className="logo-badge">AI</span></div>
            <div className="logo-subtitle" style={{ fontSize: '0.55rem' }}>Property × Fintech</div>
          </div>
        </div>

        <nav className="db-nav-list">
          {navItems.map((item, idx) => (
            <div 
              key={idx} 
              className={`db-nav-item ${activeTab === item.label ? 'active' : ''}`}
              onClick={() => setActiveTab(item.label)}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </nav>

        <div className="db-platinum-card">
          <h4>Go Platinum</h4>
          <p>Unlock 2x credits & premium listings.</p>
          <button className="btn-platinum">Upgrade</button>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <main className="db-main">
        
        {/* Topbar */}
        <header className="db-topbar">
          <div className="db-search-bar">
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Search properties, receipts, builders..." />
          </div>
          <div className="db-top-actions">
            <div className="db-icon-btn"><Bell size={18} /></div>
            <div className="db-avatar">N</div>
          </div>
        </header>

        <div className="db-welcome">
          <p style={{ color: 'var(--text-muted)' }}>Welcome back,</p>
          <h1>Nancy 👏</h1>
          <p>Here's your home-ownership journey this month.</p>
        </div>

        {/* Stats Row */}
        <div className="db-stats-row">
          <div className="db-stat-card">
            <div className="db-stat-top">
              <div className="db-stat-icon-wrapper" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}><Wallet size={16} /></div>
              <span className="db-stat-badge">+12.4%</span>
            </div>
            <div className="db-stat-val">₹3,82,450</div>
            <div className="db-stat-label">Property Credits</div>
          </div>
          
          <div className="db-stat-card">
            <div className="db-stat-top">
              <div className="db-stat-icon-wrapper" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}><Activity size={16} /></div>
              <span className="db-stat-badge negative">-3.1%</span>
            </div>
            <div className="db-stat-val">₹68,200</div>
            <div className="db-stat-label">Monthly Spending</div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-top">
              <div className="db-stat-icon-wrapper" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}><Home size={16} /></div>
              <span className="db-stat-badge">+4%</span>
            </div>
            <div className="db-stat-val">62%</div>
            <div className="db-stat-label">Home Goal Progress</div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-top">
              <div className="db-stat-icon-wrapper" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><LayoutGrid size={16} /></div>
              <span className="db-stat-badge negative">+0%</span>
            </div>
            <div className="db-stat-val">₹1.95 Cr</div>
            <div className="db-stat-label">Property Budget</div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-top">
              <div className="db-stat-icon-wrapper" style={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6' }}><Gift size={16} /></div>
              <span style={{ fontSize: '0.65rem' }}></span>
            </div>
            <div className="db-stat-val">+₹12,480</div>
            <div className="db-stat-label">Credit Growth - this month</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="db-charts-row">
          
          {/* Spending Analytics (Fake SVG Line Chart) */}
          <div className="db-chart-card">
            <div className="db-chart-header">
              <div>
                <h3 className="db-chart-title">Spending analytics</h3>
                <p className="db-chart-subtitle">8-month trend (₹ thousands)</p>
              </div>
              <span className="db-chart-action">Last updated • Today</span>
            </div>
            <div className="svg-chart-container">
              <div className="chart-grid-bg"></div>
              <div className="chart-y-axis">
                <span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
              </div>
              <div className="chart-x-axis">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              </div>
              <svg className="svg-line" viewBox="0 0 500 150" preserveAspectRatio="none">
                <path 
                  d="M0,100 C50,90 100,100 150,110 C200,100 250,70 300,70 C350,80 400,60 450,40 C500,20 500,20 500,20" 
                  fill="none" 
                  stroke="var(--accent-purple)" 
                  strokeWidth="2" 
                />
                <path 
                  d="M0,100 C50,90 100,100 150,110 C200,100 250,70 300,70 C350,80 400,60 450,40 C500,20 500,20 500,20 L500,150 L0,150 Z" 
                  fill="url(#grad)" 
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="line-hover-zones">
                {[
                  { x: 0, y: 66.6, val: '₹32k' },
                  { x: 14.28, y: 63.3, val: '₹38k' },
                  { x: 28.57, y: 72, val: '₹36k' },
                  { x: 42.85, y: 63.3, val: '₹44k' },
                  { x: 57.14, y: 46.6, val: '₹52k' },
                  { x: 71.42, y: 52, val: '₹48k' },
                  { x: 85.71, y: 33.3, val: '₹64k' },
                  { x: 100, y: 13.3, val: '₹80k' }
                ].map((point, i) => (
                  <div key={i} className="line-hover-zone" style={{ left: `${point.x}%` }}>
                    <div className="line-tooltip" style={{ top: `calc(${point.y}% - 25px)` }}>{point.val}</div>
                    <div className="line-dot" style={{ top: `calc(${point.y}% - 4px)` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Goal Progress (Donut Chart) */}
          <div className="db-chart-card">
            <div className="db-chart-header" style={{ marginBottom: '0.5rem' }}>
              <div>
                <h3 className="db-chart-title">Goal progress</h3>
                <p className="db-chart-subtitle">Toward your ₹2 Cr home</p>
              </div>
            </div>
            <div className="donut-container">
              <div className="donut-chart">
                <div className="donut-inner">
                  <span className="donut-val">62%</span>
                  <span className="donut-label">on track</span>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Projected completion: <span style={{ color: '#fff' }}>Mar 2027</span></div>
            </div>
          </div>

        </div>

        {/* Credits Earned Bar Chart */}
        <div className="db-chart-card">
          <div className="db-chart-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 className="db-chart-title">Credits earned</h3>
              <p className="db-chart-subtitle">₹ lakhs - 8 months</p>
            </div>
          </div>
          <div className="bar-chart-container">
            <div className="chart-grid-bg" style={{ left: '30px', bottom: '24px' }}></div>
            <div className="chart-y-axis" style={{ height: 'calc(100% - 24px)', paddingBottom: '0' }}>
              <span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
            </div>
            
            {/* Fake Bars with Tooltips */}
            {[20, 25, 28, 38, 45, 52, 65, 75].map((h, i) => {
              const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
              const values = ['₹1.2L', '₹1.5L', '₹1.8L', '₹2.4L', '₹3.1L', '₹4.2L', '₹5.5L', '₹6.8L'];
              return (
                <div key={i} className="bar-col">
                  <div className="bar-tooltip">{values[i]}</div>
                  <div className="bar-fill" style={{ height: `${h}%` }}></div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    {months[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Rows */}
        <div className="db-data-row">
          
          <div className="db-chart-card">
            <div className="db-chart-header">
              <h3 className="db-chart-title">Recent receipts</h3>
              <span className="db-chart-action">View all</span>
            </div>
            <div className="db-list">
              {receipts.map((r, i) => (
                <div key={i} className="db-list-item">
                  <div className="db-list-left">
                    <div className="db-list-icon"><Activity size={14} /></div>
                    <div>
                      <div className="db-list-title">{r.title}</div>
                      <div className="db-list-sub">{r.type}</div>
                    </div>
                  </div>
                  <div className="db-list-right">
                    <div className="db-list-amt">{r.amt}</div>
                    <div className="db-list-yield">{r.yield}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="db-chart-card">
            <div className="db-chart-header">
              <h3 className="db-chart-title">Notifications</h3>
              <span className="db-chart-action"><Bell size={14} /></span>
            </div>
            <div className="db-list">
              {notifications.map((n, i) => (
                <div key={i} className="db-list-item">
                  <div className="db-list-left">
                    <div className="db-list-icon dot"></div>
                    <div>
                      <div className="db-list-title">{n.title}</div>
                      <div className="db-list-sub">{n.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Properties Section */}
        <div style={{ marginTop: '0.5rem' }}>
          <div className="db-prop-header">
            <div>
              <h3 className="db-chart-title" style={{ fontSize: '1.1rem' }}>Recommended for you</h3>
              <p className="db-chart-subtitle">Based on your budget and credit applicability</p>
            </div>
            <span className="db-chart-action" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Browse all <ArrowRight size={12} /></span>
          </div>

          <div className="db-prop-grid">
            {properties.map((p, i) => (
              <div key={i} className="db-prop-card">
                <div className="db-prop-img-container">
                  <img src={p.img} alt={p.title} className="db-prop-img" />
                  <div className="db-prop-tag">{p.tag}</div>
                  <div className="db-prop-trust"><ShieldCheck size={12} /> {p.trust}</div>
                  <div className="db-prop-fav"><Heart size={14} /></div>
                </div>
                <div className="db-prop-body">
                  <div className="db-prop-title-row">
                    <span className="db-prop-title">{p.title}</span>
                    <span className="db-prop-rating"><Star size={10} fill="currentColor" stroke="none" /> {p.rating}</span>
                  </div>
                  <div className="db-prop-loc"><MapPin size={12} /> {p.loc}</div>
                  <div className="db-prop-price-row">
                    <div>
                      <div className="db-prop-price">{p.price}</div>
                      <div className="db-prop-emi">{p.emi}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'right' }}>CREDITS</div>
                      <div className="db-prop-credit-amt">{p.credits}</div>
                    </div>
                  </div>
                  <button className="db-prop-btn">View details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
