import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Home, FileText, AlertCircle, ArrowRight, ShieldCheck, Clock, MapPin, Activity, Trash2, Gift, XCircle } from 'lucide-react';
import '../styles/Dashboard.css';

export default function AdminDashboardView({ setActiveTab }) {
  const [activeSection, setActiveSection] = useState('overview'); // overview, buyers, builders, transactions, audit
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);
  const [receiptsList, setReceiptsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const statsRes = await fetch('http://localhost:8000/api/auth/admin_stats/', { headers });
      if (statsRes.ok) setStats(await statsRes.json());

      const usersRes = await fetch('http://localhost:8000/api/auth/users/', { headers });
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsersList(uData.results || uData);
      }

      const propsRes = await fetch('http://localhost:8000/api/properties/', { headers });
      if (propsRes.ok) {
        const pData = await propsRes.json();
        setPropertiesList(pData.results || pData);
      }

      const recRes = await fetch('http://localhost:8000/api/receipts/', { headers });
      if (recRes.ok) {
        const rData = await recRes.json();
        setReceiptsList(rData.results || rData);
      }
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to completely ban and delete user ${name}?`)) return;
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/auth/users/${userId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (err) { console.error(err); }
  };

  const handleGrantCredits = async (userId, name) => {
    const amountStr = window.prompt(`How many Property Credits do you want to manually grant to ${name}?`, '50000');
    if (!amountStr) return;
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount <= 0) return alert('Invalid amount');

    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/auth/users/${userId}/grant_credits/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });
      alert(`Successfully granted ${amount} credits!`);
      fetchAdminData();
    } catch (err) { console.error(err); }
  };

  const handleForceCancel = async (propertyId, title) => {
    if (!window.confirm(`Force cancel the booking for ${title}? This will revert it to available.`)) return;
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/properties/${propertyId}/cancel_booking/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (err) { console.error(err); }
  };

  if (isLoading || !stats) {
    return <div className="dashboard-content-wrapper"><div style={{ color: 'var(--text-muted)' }}>Loading admin data...</div></div>;
  }

  const buyers = usersList.filter(u => u.role === 'user');
  const builders = usersList.filter(u => u.role === 'builder');
  const bookedProperties = propertiesList.filter(p => p.status === 'booked');
  const auditedReceipts = receiptsList.filter(r => r.status !== 'pending');

  const formatINR = (amount) => {
    const num = parseFloat(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="dashboard-content-wrapper">
      <div className="db-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 className="db-title">Admin Dashboard</h2>
          <p className="db-subtitle">Platform overview, financials, and management controls.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        {['overview', 'buyers', 'builders', 'transactions', 'audit log'].map(sec => (
          <button 
            key={sec}
            onClick={() => setActiveSection(sec)}
            style={{ 
              background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'capitalize',
              fontWeight: activeSection === sec ? 600 : 400,
              color: activeSection === sec ? '#fff' : 'var(--text-muted)',
              borderBottom: activeSection === sec ? '2px solid #3b82f6' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            {sec}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <>
          <div className="db-quick-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.5rem' }}>
            <div className="db-stat-card glass-card" style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.05), rgba(0,0,0,0.2))', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="db-stat-header">
                <div className="db-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Activity size={20} /></div>
              </div>
              <div className="db-stat-value" style={{ color: '#10b981' }}>{formatINR(stats.total_revenue || 0)}</div>
              <div className="db-stat-label">Total Platform Revenue (1% Fee)</div>
            </div>
            <div className="db-stat-card glass-card">
              <div className="db-stat-header">
                <div className="db-stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}><Gift size={20} /></div>
              </div>
              <div className="db-stat-value">{formatINR(stats.circulating_credits || 0)}</div>
              <div className="db-stat-label">Total Credits Circulation</div>
            </div>
          </div>

          <div className="db-quick-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '3rem' }}>
            <div className="db-stat-card glass-card">
              <div className="db-stat-header"><div className="db-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><Users size={20} /></div></div>
              <div className="db-stat-value">{stats.total_users}</div>
              <div className="db-stat-label">Registered Buyers</div>
            </div>
            <div className="db-stat-card glass-card">
              <div className="db-stat-header"><div className="db-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}><UserCheck size={20} /></div></div>
              <div className="db-stat-value">{stats.total_builders}</div>
              <div className="db-stat-label">Verified Builders</div>
            </div>
            <div className="db-stat-card glass-card">
              <div className="db-stat-header"><div className="db-stat-icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}><Home size={20} /></div></div>
              <div className="db-stat-value">{stats.total_properties}</div>
              <div className="db-stat-label">Total Properties</div>
            </div>
            <div className="db-stat-card glass-card" style={{ border: stats.pending_receipts > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '' }}>
              <div className="db-stat-header">
                <div className="db-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><FileText size={20} /></div>
                {stats.pending_receipts > 0 && <AlertCircle size={16} color="#ef4444" />}
              </div>
              <div className="db-stat-value">{stats.pending_receipts}</div>
              <div className="db-stat-label">Pending Receipts</div>
            </div>
          </div>

          {stats.pending_receipts > 0 && (
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} /> Action Required
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>There are {stats.pending_receipts} newly uploaded receipts waiting for administrative verification.</p>
              <button className="btn-card-view" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', width: 'auto' }} onClick={() => setActiveTab('Verify Receipts')}>
                Go to Verification Queue <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          )}
        </>
      )}

      {activeSection === 'buyers' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Registered Buyers ({buyers.length})</h3>
          <div className="db-list">
            {buyers.map(b => (
              <div key={b.id} className="db-list-item" style={{ alignItems: 'center' }}>
                <div className="db-list-left">
                  <div className="db-list-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Users size={16} /></div>
                  <div>
                    <div className="db-list-title">{b.full_name || 'Unnamed User'}</div>
                    <div className="db-list-sub">{b.email} • Joined {new Date(b.date_joined).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="db-list-right" style={{ textAlign: 'right', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wallet Balance</div>
                    <div style={{ fontWeight: 600, color: '#10b981' }}>₹{parseFloat(b.total_credits || 0).toLocaleString('en-IN')}</div>
                  </div>
                  <button onClick={() => handleGrantCredits(b.id, b.full_name || b.email)} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                    <Gift size={12} /> Grant Credits
                  </button>
                  <button onClick={() => handleDeleteUser(b.id, b.full_name || b.email)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'builders' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Verified Builders ({builders.length})</h3>
          <div className="db-list">
            {builders.map(b => (
              <div key={b.id} className="db-list-item" style={{ alignItems: 'center' }}>
                <div className="db-list-left">
                  <div className="db-list-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}><UserCheck size={16} /></div>
                  <div>
                    <div className="db-list-title">{b.full_name || 'Unnamed Builder'}</div>
                    <div className="db-list-sub">{b.email}</div>
                  </div>
                </div>
                <div className="db-list-right" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                    background: b.tier === 'platinum' ? 'rgba(168, 85, 247, 0.15)' : 
                                b.tier === 'gold' ? 'rgba(234, 179, 8, 0.15)' : 
                                b.tier === 'silver' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                    color: b.tier === 'platinum' ? '#c084fc' : 
                           b.tier === 'gold' ? '#facc15' : 
                           b.tier === 'silver' ? '#cbd5e1' : '#d97706',
                  }}>
                    {b.tier || 'bronze'} Tier
                  </span>
                  <button onClick={() => handleDeleteUser(b.id, b.full_name || b.email)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'transactions' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Booking Activity Feed</h3>
          {bookedProperties.length === 0 ? (
             <div style={{ color: 'var(--text-muted)' }}>No properties have been booked yet.</div>
          ) : (
            <div className="db-list">
              {bookedProperties.map(p => (
                <div key={p.id} className="db-list-item" style={{ alignItems: 'flex-start', borderLeft: '3px solid #10b981', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="db-list-left">
                    <div className="db-list-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Activity size={16} /></div>
                    <div>
                      <div className="db-list-title" style={{ fontSize: '0.95rem' }}>
                        <strong style={{ color: '#fff' }}>{p.buyer_name || 'A buyer'}</strong> booked <strong style={{ color: '#fff' }}>{p.title}</strong>
                      </div>
                      <div className="db-list-sub" style={{ marginTop: '4px' }}>From builder: <span style={{ color: '#60a5fa' }}>{p.builder_name}</span></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <MapPin size={12} /> {p.location}
                      </div>
                    </div>
                  </div>
                  <div className="db-list-right" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Booking Price</div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{formatINR(p.price_in_inr)}</div>
                    </div>
                    <button onClick={() => handleForceCancel(p.id, p.title)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                      <XCircle size={12} /> Force Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'audit log' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Receipt Audit Log</h3>
          {auditedReceipts.length === 0 ? (
             <div style={{ color: 'var(--text-muted)' }}>No receipts have been processed yet.</div>
          ) : (
            <div className="db-list">
              {auditedReceipts.map(r => (
                <div key={r.id} className="db-list-item" style={{ alignItems: 'center', borderLeft: `3px solid ${r.status === 'approved' ? '#10b981' : '#ef4444'}`, background: 'rgba(255,255,255,0.02)' }}>
                  <div className="db-list-left">
                    <div className="db-list-icon" style={{ background: r.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: r.status === 'approved' ? '#10b981' : '#ef4444' }}>
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="db-list-title">{r.store_name} ({formatINR(r.amount_spent)})</div>
                      <div className="db-list-sub">Uploaded by user #{r.user} on {new Date(r.uploaded_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="db-list-right" style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
                    <div style={{ fontWeight: 600, color: r.status === 'approved' ? '#10b981' : '#ef4444', textTransform: 'capitalize' }}>{r.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
