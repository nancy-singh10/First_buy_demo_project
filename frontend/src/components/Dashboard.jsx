import React, { useState, useEffect } from 'react';
import CustomLogo from './CustomLogo';
import {
  Home, UploadCloud, LayoutGrid, Wallet, Gift, BarChart2, Heart, Users, Settings,
  Search, Bell, Activity, ArrowRight, ShieldCheck, Star, MapPin, PlusCircle, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import ReceiptUpload from './ReceiptUpload';
import ProfileSettings from './ProfileSettings';
import AdminQueue from './AdminQueue';
import SavedHomes from './SavedHomes';
import WalletView from './WalletView';
import AddProperty from './AddProperty';
import MarketplacePreview from './MarketplacePreview';
import BuilderDashboardView from './BuilderDashboardView';
import BuilderRewards from './BuilderRewards';
import RewardsTiers from './RewardsTiers';
import AdminDashboardView from './AdminDashboardView';
import FamilyPool from './FamilyPool';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');

  const [receipts, setReceipts]   = useState([]);
  const [properties, setProperties] = useState([]);
  const [user, setUser]           = useState(null);
  const [savedIds, setSavedIds]   = useState(new Set()); // track saved property IDs

  // Payment simulation state
  const [paymentModalProp, setPaymentModalProp] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /* Toggle save / unsave a demo property card */
  const toggleSave = async (propertyId) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/properties/${propertyId}/save/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedIds(prev => {
        const next = new Set(prev);
        next.has(propertyId) ? next.delete(propertyId) : next.add(propertyId);
        return next;
      });
    } catch (err) {
      console.error('Save toggle error:', err);
    }
  };

  const handleBookProperty = async (propertyId) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8000/api/properties/${propertyId}/book/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // Refresh properties
        fetchUserData();
        setPaymentModalProp(null);
      } else {
        const data = await res.json();
        alert(data.message || 'Error booking property');
      }
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = async (propertyId) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8000/api/properties/${propertyId}/cancel_booking/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // Refresh properties
        fetchUserData();
      } else {
        const data = await res.json();
        alert(data.message || 'Error cancelling booking');
      }
    } catch (err) {
      console.error('Cancellation error:', err);
    }
  };


  // Build nav dynamically — admins get 'Verify Receipts' instead of 'Upload Receipt'
  const navItems = [
    { label: 'Dashboard',      icon: <LayoutGrid size={18} /> },
    // Only show Upload Receipt for non-admin users
    ...(user && user.is_staff ? [] : [{ label: 'Upload Receipt', icon: <UploadCloud size={18} /> }]),
    // Only show Verify Receipts tab for admin/staff
    ...(user && user.is_staff ? [{ label: 'Verify Receipts', icon: <ShieldCheck size={18} /> }] : []),
    ...(user && user.role === 'builder' ? [
      { label: 'Add Property', icon: <PlusCircle size={18} /> },
      { label: 'My Listings', icon: <LayoutGrid size={18} /> }
    ] : []),
    ...(user && !user.is_staff && user.role === 'user' ? [
      { label: 'Subscription', icon: <Star size={18} /> }
    ] : []),
    { label: 'Properties',     icon: <Home size={18} /> },
    { label: 'Wallet',         icon: <Wallet size={18} /> },
    { label: 'Rewards',        icon: <Gift size={18} /> },
    ...(user && !user.is_staff && user.role === 'user' ? [{ label: 'Family Pool', icon: <UserPlus size={18} /> }] : []),
    { label: 'AI Insights',    icon: <BarChart2 size={18} /> },
    { label: 'Saved Homes',    icon: <Heart size={18} /> },
    { label: 'Community',      icon: <Users size={18} /> },
    { label: 'Settings',       icon: <Settings size={18} /> },
  ];

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

        // Fetch User Profile
        const userRes = await fetch('http://localhost:8000/api/auth/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        // Fetch Receipts
        const receiptsRes = await fetch('http://localhost:8000/api/receipts/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (receiptsRes.ok) {
          const data = await receiptsRes.json();
          const receiptsArray = data.results ? data.results : data;
          setReceipts(receiptsArray.slice(0, 4));
        }

        // Fetch Properties
        const propsRes = await fetch('http://localhost:8000/api/properties/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (propsRes.ok) {
          const propsData = await propsRes.json();
          const propsArray = propsData.results || propsData;
          setProperties(propsArray);
          
          // Seed the savedIds set for properties the user already saved
          if (token) {
            const savedProps = propsArray.filter(p => p.is_saved).map(p => p.id);
            setSavedIds(new Set(savedProps));
          }
        }

        // Fetch Notifications
        await fetchNotifications(token);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    useEffect(() => {
      fetchUserData();
    }, []);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);

  const fetchNotifications = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/notifications/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.results || data;
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error('Notifications fetch error:', err);
    }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem('access_token');
    await fetch('http://localhost:8000/api/notifications/mark-all-read/', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleSubscribe = async (tier) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/auth/subscribe/', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tier })
      });
      if (res.ok) {
        alert(`Successfully subscribed to ${tier.toUpperCase()} tier!`);
        fetchUserData(); // Refresh user data to get new tier
      } else {
        alert('Subscription failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to format currency
  const formatINR = (amount) => {
    const num = parseFloat(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="dashboard-portal">

      {/* ── Sidebar ── */}
      <aside className="db-sidebar">
        <div className="db-brand" onClick={() => navigate('/')}>
          <div className="logo-icon-wrapper" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'transparent', boxShadow: 'none' }}>
            <CustomLogo size={24} mainColor="#ffffff" />
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

        {user && user.role === 'user' && user.tier !== 'platinum' && (
          <div className="db-platinum-card">
            <h4>Upgrade Tier</h4>
            <p>Unlock higher credit multipliers & premium perks.</p>
            <button className="btn-platinum" onClick={() => setActiveTab('Subscription')}>Upgrade</button>
          </div>
        )}
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
          <h1>{user ? (user.full_name ? user.full_name.split(' ')[0] : 'Admin') : 'Nancy'} 👏</h1>
          {user && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{
                display: 'inline-block', padding: '4px 10px', borderRadius: '20px',
                fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8',
                fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                {user.role} {user.is_staff ? '(Admin)' : ''}
              </span>
              
              {user.tier && (
                <span style={{
                  display: 'inline-block', padding: '4px 10px', borderRadius: '20px',
                  fontSize: '0.75rem', 
                  background: user.tier === 'platinum' ? 'rgba(168, 85, 247, 0.15)' : 
                              user.tier === 'gold' ? 'rgba(234, 179, 8, 0.15)' : 
                              user.tier === 'silver' ? 'rgba(148, 163, 184, 0.15)' : 
                              'rgba(217, 119, 6, 0.15)', 
                  color: user.tier === 'platinum' ? '#c084fc' : 
                         user.tier === 'gold' ? '#facc15' : 
                         user.tier === 'silver' ? '#cbd5e1' : 
                         '#d97706',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                  border: `1px solid ${
                    user.tier === 'platinum' ? 'rgba(192, 132, 252, 0.3)' : 
                    user.tier === 'gold' ? 'rgba(250, 204, 21, 0.3)' : 
                    user.tier === 'silver' ? 'rgba(203, 213, 225, 0.3)' : 
                    'rgba(217, 119, 6, 0.3)'
                  }`
                }}>
                  {user.tier} Tier
                </span>
              )}
            </div>
          )}
          <p>Here's your home-ownership journey this month.</p>
        </div>

        {activeTab === 'Verify Receipts' && user && user.is_staff ? (
          <AdminQueue />
        ) : activeTab === 'Settings' ? (
          <ProfileSettings />
        ) : activeTab === 'Upload Receipt' ? (
          <ReceiptUpload />
        ) : activeTab === 'Add Property' && user && user.role === 'builder' ? (
          <AddProperty onPropertyAdded={() => setActiveTab('Properties')} />
        ) : activeTab === 'Saved Homes' ? (
          <SavedHomes onBrowse={() => setActiveTab('Properties')} user={user} />
        ) : activeTab === 'Subscription' && user && user.role === 'user' ? (
          <div className="db-subscription-container" style={{ padding: '2rem 0' }}>
            <div className="db-chart-header" style={{ marginBottom: '2rem' }}>
              <div>
                <h3 className="db-chart-title" style={{ fontSize: '1.5rem' }}>Upgrade Your Tier</h3>
                <p className="db-chart-subtitle">Multiply your credit earnings and unlock premium perks.</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {/* Bronze */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '2rem', border: user.tier === 'bronze' ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                {user.tier === 'bronze' && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#818cf8', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>CURRENT PLAN</div>}
                <h4 style={{ color: '#d97706', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Bronze</h4>
                <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Free</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', height: '40px' }}>Default tier for all new users.</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, gap: '10px', display: 'flex', flexDirection: 'column' }}>
                  <li><ShieldCheck size={16} color="#10b981" /> <strong>1x</strong> Credit Multiplier</li>
                  <li><ShieldCheck size={16} color="#10b981" /> Basic Insights</li>
                </ul>
                <button disabled style={{ width: '100%', marginTop: '2rem', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff' }}>
                  {user.tier === 'bronze' ? 'Active' : 'Included'}
                </button>
              </div>

              {/* Silver */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '2rem', border: user.tier === 'silver' ? '2px solid #cbd5e1' : '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                {user.tier === 'silver' && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#cbd5e1', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>CURRENT PLAN</div>}
                <h4 style={{ color: '#cbd5e1', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Silver</h4>
                <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Earned</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', height: '40px' }}>Unlocks automatically after 50,000 credits.</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, gap: '10px', display: 'flex', flexDirection: 'column' }}>
                  <li><ShieldCheck size={16} color="#10b981" /> <strong>1.25x</strong> Credit Multiplier</li>
                  <li><ShieldCheck size={16} color="#10b981" /> Priority OCR Processing</li>
                </ul>
                <button disabled style={{ width: '100%', marginTop: '2rem', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff' }}>
                  {user.tier === 'silver' ? 'Active' : (parseFloat(user.total_credits) >= 50000 ? 'Unlocked' : `Need ${(50000 - parseFloat(user.total_credits)).toLocaleString()} more`)}
                </button>
              </div>

              {/* Gold */}
              <div style={{ background: 'rgba(234,179,8,0.05)', borderRadius: '16px', padding: '2rem', border: user.tier === 'gold' ? '2px solid #facc15' : '1px solid rgba(250,204,21,0.3)', position: 'relative' }}>
                {user.tier === 'gold' && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#facc15', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>CURRENT PLAN</div>}
                <h4 style={{ color: '#facc15', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Gold</h4>
                <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>₹999<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', height: '40px' }}>For serious home buyers.</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, gap: '10px', display: 'flex', flexDirection: 'column' }}>
                  <li><ShieldCheck size={16} color="#10b981" /> <strong>1.5x</strong> Credit Multiplier</li>
                  <li><ShieldCheck size={16} color="#10b981" /> Concierge Support</li>
                </ul>
                <button 
                  onClick={() => handleSubscribe('gold')}
                  disabled={user.tier === 'gold' || user.tier === 'platinum'} 
                  style={{ width: '100%', marginTop: '2rem', padding: '0.8rem', background: user.tier === 'gold' ? 'rgba(255,255,255,0.1)' : '#ca8a04', border: 'none', borderRadius: '8px', color: '#fff', cursor: (user.tier === 'gold' || user.tier === 'platinum') ? 'not-allowed' : 'pointer' }}
                >
                  {user.tier === 'gold' ? 'Active' : user.tier === 'platinum' ? 'Included' : 'Subscribe Now'}
                </button>
              </div>

              {/* Platinum */}
              <div style={{ background: 'rgba(168,85,247,0.08)', borderRadius: '16px', padding: '2rem', border: user.tier === 'platinum' ? '2px solid #c084fc' : '1px solid rgba(192,132,252,0.4)', position: 'relative' }}>
                {user.tier === 'platinum' && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#c084fc', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>CURRENT PLAN</div>}
                <h4 style={{ color: '#c084fc', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Platinum</h4>
                <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>₹2,499<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', height: '40px' }}>The ultimate home buying experience.</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, gap: '10px', display: 'flex', flexDirection: 'column' }}>
                  <li><ShieldCheck size={16} color="#10b981" /> <strong>2.0x</strong> Credit Multiplier</li>
                  <li><ShieldCheck size={16} color="#10b981" /> Early access to listings</li>
                </ul>
                <button 
                  onClick={() => handleSubscribe('platinum')}
                  disabled={user.tier === 'platinum'} 
                  style={{ width: '100%', marginTop: '2rem', padding: '0.8rem', background: user.tier === 'platinum' ? 'rgba(255,255,255,0.1)' : '#9333ea', border: 'none', borderRadius: '8px', color: '#fff', cursor: user.tier === 'platinum' ? 'not-allowed' : 'pointer', boxShadow: user.tier !== 'platinum' ? '0 4px 15px rgba(147,51,234,0.4)' : 'none' }}
                >
                  {user.tier === 'platinum' ? 'Active' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'Family Pool' ? (
          <FamilyPool user={user} />
        ) : activeTab === 'Wallet' ? (
          <WalletView user={user} onUpdateUser={fetchUserData} />
        ) : activeTab === 'Rewards' ? (
          user && user.role === 'builder' ? <BuilderRewards properties={properties} user={user} /> : <RewardsTiers user={user} />
        ) : activeTab === 'Properties' ? (
          <MarketplacePreview setCurrentView={(view) => {
            if (view === 'dashboard') setActiveTab('Dashboard');
            else if (view === 'signin') navigate('/signin');
            else navigate('/' + view);
          }} />
        ) : activeTab === 'My Listings' && user && user.role === 'builder' ? (
          <div style={{ marginTop: '0.5rem' }}>
            <div className="db-prop-header">
              <div>
                <h3 className="db-chart-title" style={{ fontSize: '1.25rem' }}>My Listings</h3>
                <p className="db-chart-subtitle">All properties you have added</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveTab('Add Property')} style={{ padding: '8px 16px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>
                + New Property
              </button>
            </div>
            {properties.filter(p => p.builder === user.id).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>You haven't listed any properties yet.</div>
            ) : (
              <div className="db-prop-grid">
                {properties.filter(p => p.builder === user.id).map(p => {
                  const fallbackImg = p.title.includes('Skyline') ? '/property_skyline_residences.png' :
                                      p.title.includes('Azure')   ? '/property_azure_villa.png' :
                                      '/property_altura_penthouse.png';
                  return (
                    <div key={p.id} className="db-prop-card">
                      <div className="db-prop-img-container">
                        <img src={p.images?.[0]?.image || fallbackImg} alt={p.title} className="db-prop-img" />
                        <div className="db-prop-tag" style={{ background: p.status === 'booked' ? 'rgba(16,185,129,0.9)' : 'rgba(13,11,35,0.85)' }}>
                          {p.status === 'booked' ? 'Booked' : 'Available'}
                        </div>
                      </div>
                      <div className="db-prop-body">
                        <div className="db-prop-title-row">
                          <span className="db-prop-title">{p.title}</span>
                          <span className="db-prop-rating"><ShieldCheck size={10} color="#10b981" /> {p.trust_score}</span>
                        </div>
                        <div className="db-prop-loc"><MapPin size={12} /> {p.location}</div>
                        <div className="db-prop-price-row">
                          <div>
                            <div className="db-prop-price">{formatINR(p.price_in_inr)}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="db-prop-btn"
                            style={{ flex: 1, color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            onClick={async () => {
                              if (!window.confirm('Delete this property?')) return;
                              try {
                                const res = await fetch(`http://localhost:8000/api/properties/${p.id}/`, {
                                  method: 'DELETE',
                                  headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
                                });
                                if (res.ok) fetchUserData();
                                else alert('Failed to delete property.');
                              } catch (err) { console.error(err); }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === 'Dashboard' && user && user.role === 'builder' ? (
          <BuilderDashboardView properties={properties} setActiveTab={setActiveTab} user={user} />
        ) : activeTab === 'Dashboard' && user && user.is_staff ? (
          <AdminDashboardView setActiveTab={setActiveTab} />
        ) : (
          <>
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
                        <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0" />
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
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
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
                  {receipts.length === 0 && <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>No receipts uploaded yet.</div>}
                  {receipts.map((r) => (
                    <div key={r.id} className="db-list-item">
                      <div className="db-list-left">
                        <div className="db-list-icon"><Activity size={14} /></div>
                        <div>
                          <div className="db-list-title">{r.store_name}</div>
                          <div className="db-list-sub">{new Date(r.uploaded_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="db-list-right">
                        <div className="db-list-amt">₹{parseFloat(r.amount_spent).toLocaleString()}</div>
                        <div className="db-list-yield" style={{
                          color: r.status === 'approved' ? '#10b981' : r.status === 'rejected' ? '#ef4444' : '#f59e0b',
                          background: 'none', padding: 0
                        }}>
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="db-chart-card">
                <div className="db-chart-header">
                  <h3 className="db-chart-title">
                    Notifications
                    {unreadCount > 0 && (
                      <span style={{
                        marginLeft: '8px', background: '#ef4444', color: '#fff',
                        fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px',
                        borderRadius: '10px', verticalAlign: 'middle'
                      }}>{unreadCount} new</span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        background: 'none', border: 'none', color: '#818cf8',
                        fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600
                      }}
                    >Mark all read</button>
                  )}
                </div>
                <div className="db-list">
                  {notifications.length === 0 && (
                    <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      No notifications yet.
                    </div>
                  )}
                  {notifications.map((n) => {
                    const isReject  = n.notif_type === 'receipt_rejected';
                    const isApprove = n.notif_type === 'receipt_approved';
                    const dotColor  = isReject ? '#ef4444' : isApprove ? '#10b981' : '#60a5fa';
                    return (
                      <div key={n.id} className="db-list-item" style={{
                        opacity: n.is_read ? 0.6 : 1,
                        borderLeft: `3px solid ${dotColor}`,
                        background: n.is_read ? 'transparent' : 'rgba(255,255,255,0.02)'
                      }}>
                        <div className="db-list-left">
                          <div className="db-list-icon dot" style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}` }} />
                          <div>
                            <div className="db-list-title">{n.title}</div>
                            <div className="db-list-sub" style={{ whiteSpace: 'pre-line' }}>{n.message}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {new Date(n.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                {properties.slice(0, 3).map((p) => {
                  const fallbackImg = p.title.includes('Skyline') ? '/property_skyline_residences.png' :
                                      p.title.includes('Azure')   ? '/property_azure_villa.png' :
                                      '/property_altura_penthouse.png';
                  
                  return (
                  <div key={p.id} className="db-prop-card">
                    <div className="db-prop-img-container">
                      <img src={p.images?.[0]?.image || fallbackImg} alt={p.title} className="db-prop-img" />
                      <div className="db-prop-tag">Featured</div>
                      <div className="db-prop-trust"><ShieldCheck size={12} /> Trust {p.trust_score}</div>
                      {/* Heart toggle using real DB ID */}
                      <div
                        className="db-prop-fav"
                        onClick={() => toggleSave(p.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Heart
                          size={14}
                          fill={savedIds.has(p.id) ? '#f472b6' : 'none'}
                          color={savedIds.has(p.id) ? '#f472b6' : '#fff'}
                        />
                      </div>
                    </div>
                    <div className="db-prop-body">
                      <div className="db-prop-title-row">
                        <span className="db-prop-title">{p.title}</span>
                        <span className="db-prop-rating"><Star size={10} fill="currentColor" stroke="none" /> 4.9</span>
                      </div>
                      <div className="db-prop-loc"><MapPin size={12} /> {p.location}</div>
                      <div className="db-prop-price-row">
                        <div>
                          <div className="db-prop-price">{formatINR(p.price_in_inr)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'right' }}>CREDITS</div>
                          <div className="db-prop-credit-amt">{formatINR(p.max_credit_discount_allowed)} applicable</div>
                        </div>
                      </div>
                      
                      {p.status === 'booked' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="db-prop-btn"
                            style={{ background: '#10b981', color: '#fff', flex: 1, cursor: 'default' }}
                          >
                            Booked by You
                          </button>
                          <button
                            className="db-prop-btn"
                            style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', flex: 1 }}
                            onClick={() => handleCancelBooking(p.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="db-prop-btn"
                            onClick={() => setActiveTab('Saved Homes')}
                            style={{ flex: 1 }}
                          >Details</button>
                          <button
                            className="db-prop-btn"
                            style={{ background: '#3b82f6', color: '#fff', flex: 1 }}
                            onClick={() => setPaymentModalProp(p)}
                          >Book Now</button>
                        </div>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          </>
        )}

      </main>

      {/* Simulated Payment Modal */}
      {paymentModalProp && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content glass-card" style={{ padding: '2rem', width: '90%', maxWidth: '400px', position: 'relative' }}>
            <h3 style={{ marginTop: 0 }}>Complete Booking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You are about to book <strong>{paymentModalProp.title}</strong> for {formatINR(paymentModalProp.price_in_inr)}.
            </p>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Booking Amount</span>
                <span>₹1,00,000 (Refundable)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method</span>
                <span>Visa ending in 4242</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-outline" 
                style={{ flex: 1 }} 
                onClick={() => setPaymentModalProp(null)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} 
                onClick={() => handleBookProperty(paymentModalProp.id)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay & Book'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
