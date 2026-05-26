import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, FileImage, ShieldCheck,
  User, Mail, Phone, Clock, Store, RefreshCw,
  ChevronDown, ChevronUp, Eye, AlertTriangle
} from 'lucide-react';
import '../styles/AdminQueue.css';

// Safely build the image URL — avoids doubling if Django already returns full URL
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
};

const TIER_COLORS = {
  bronze:   { bg: 'rgba(180,83,9,0.15)',   text: '#f59e0b' },
  silver:   { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
  gold:     { bg: 'rgba(234,179,8,0.15)',   text: '#eab308' },
  platinum: { bg: 'rgba(99,102,241,0.15)',  text: '#818cf8' },
};

export default function AdminQueue() {
  const [allReceipts, setAllReceipts]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [filter, setFilter]             = useState('pending');   // pending | approved | rejected | all
  const [expandedId, setExpandedId]     = useState(null);
  const [rejectNotes, setRejectNotes]   = useState({});          // keyed by receipt id
  const [actionLoading, setActionLoading] = useState({});        // keyed by receipt id

  /* ── Fetch all receipts (admin sees all) ── */
  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/receipts/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllReceipts(data.results || data);
      } else {
        setError('Failed to load receipts. Make sure you are logged in as admin.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, []);

  /* ── Approve / Reject ── */
  const handleAction = async (id, action) => {
    setActionLoading(prev => ({ ...prev, [id]: action }));
    try {
      const token = localStorage.getItem('access_token');
      const body  = action === 'reject' ? { notes: rejectNotes[id] || '' } : {};
      const res   = await fetch(`http://localhost:8000/api/receipts/${id}/${action}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // Optimistically update status in local state
        setAllReceipts(prev =>
          prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r)
        );
        setExpandedId(null);
      } else {
        alert('Action failed — check permissions.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ── Derived lists ── */
  const displayed = filter === 'all'
    ? allReceipts
    : allReceipts.filter(r => r.status === filter);

  const counts = {
    all:      allReceipts.length,
    pending:  allReceipts.filter(r => r.status === 'pending').length,
    approved: allReceipts.filter(r => r.status === 'approved').length,
    rejected: allReceipts.filter(r => r.status === 'rejected').length,
  };

  /* ── Status badge ── */
  const StatusBadge = ({ status }) => {
    const map = {
      pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '⏳ Pending' },
      approved: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: '✅ Approved' },
      rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: '❌ Rejected' },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{
        background: s.bg, color: s.color,
        padding: '3px 10px', borderRadius: '20px',
        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3px'
      }}>{s.label}</span>
    );
  };

  if (loading) return (
    <div className="aq-loading">
      <div className="aq-spinner" />
      <span>Loading receipt queue…</span>
    </div>
  );

  return (
    <div className="aq-root">

      {/* ── Header ── */}
      <div className="aq-header">
        <div className="aq-header-left">
          <ShieldCheck size={26} color="#10b981" />
          <div>
            <h2 className="aq-title">Admin Verification Queue</h2>
            <p className="aq-subtitle">Review, approve or reject user-submitted receipts</p>
          </div>
        </div>
        <button className="aq-refresh-btn" onClick={fetchReceipts}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {error && (
        <div className="aq-error">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div className="aq-tabs">
        {['pending', 'approved', 'rejected', 'all'].map(tab => (
          <button
            key={tab}
            className={`aq-tab ${filter === tab ? 'active' : ''} aq-tab-${tab}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="aq-tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      {/* ── Receipt Cards ── */}
      {displayed.length === 0 ? (
        <div className="aq-empty">
          <ShieldCheck size={48} color="#10b981" opacity={0.3} />
          <p>No {filter === 'all' ? '' : filter} receipts found.</p>
        </div>
      ) : (
        <div className="aq-list">
          {displayed.map(receipt => {
            const user      = receipt.user_detail || {};
            const tier      = user.tier || 'bronze';
            const tierStyle = TIER_COLORS[tier] || TIER_COLORS.bronze;
            const isOpen    = expandedId === receipt.id;

            return (
              <div key={receipt.id} className={`aq-card ${isOpen ? 'open' : ''}`}>

                {/* ── Card Summary Row (always visible) ── */}
                <div className="aq-card-summary" onClick={() => setExpandedId(isOpen ? null : receipt.id)}>

                  {/* User avatar */}
                  <div className="aq-avatar">
                    {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </div>

                  {/* User info */}
                  <div className="aq-user-info">
                    <div className="aq-user-name">
                      {user.full_name || 'Unknown User'}
                      <span className="aq-tier-badge" style={{ background: tierStyle.bg, color: tierStyle.text }}>
                        {tier.toUpperCase()}
                      </span>
                    </div>
                    <div className="aq-user-meta">
                      <span><Mail size={11} /> {user.email || '—'}</span>
                      {user.phone && <span><Phone size={11} /> {user.phone}</span>}
                    </div>
                  </div>

                  {/* Receipt summary */}
                  <div className="aq-receipt-meta">
                    <div className="aq-store"><Store size={13} /> {receipt.store_name}</div>
                    <div className="aq-amount">₹{parseFloat(receipt.amount_spent).toLocaleString()}</div>
                    <div className="aq-date"><Clock size={11} /> {new Date(receipt.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  </div>

                  {/* Status + expand */}
                  <div className="aq-card-right">
                    <StatusBadge status={receipt.status} />
                    <button className="aq-expand-btn">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isOpen ? 'Collapse' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* ── Expanded Detail Panel ── */}
                {isOpen && (
                  <div className="aq-detail-panel">

                    {/* Left: Full user info + actions */}
                    <div className="aq-detail-left">

                      <div className="aq-section-label">👤 Submitted By</div>
                      <div className="aq-info-grid">
                        <div className="aq-info-item">
                          <span className="aq-info-key"><User size={12} /> Name</span>
                          <span className="aq-info-val">{user.full_name || '—'}</span>
                        </div>
                        <div className="aq-info-item">
                          <span className="aq-info-key"><Mail size={12} /> Email</span>
                          <span className="aq-info-val">{user.email || '—'}</span>
                        </div>
                        <div className="aq-info-item">
                          <span className="aq-info-key"><Phone size={12} /> Phone</span>
                          <span className="aq-info-val">{user.phone || '—'}</span>
                        </div>
                        <div className="aq-info-item">
                          <span className="aq-info-key">🏅 Tier</span>
                          <span className="aq-info-val" style={{ color: tierStyle.text, textTransform: 'capitalize' }}>{tier}</span>
                        </div>
                        <div className="aq-info-item">
                          <span className="aq-info-key">💰 Total Credits</span>
                          <span className="aq-info-val">₹{parseFloat(user.total_credits || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="aq-section-label" style={{ marginTop: '1.5rem' }}>🧾 Receipt Info</div>
                      <div className="aq-info-grid">
                        <div className="aq-info-item">
                          <span className="aq-info-key"><Store size={12} /> Store</span>
                          <span className="aq-info-val">{receipt.store_name}</span>
                        </div>
                        <div className="aq-info-item">
                          <span className="aq-info-key">💵 Amount</span>
                          <span className="aq-info-val" style={{ color: '#10b981', fontWeight: 700 }}>
                            ₹{parseFloat(receipt.amount_spent).toLocaleString()}
                          </span>
                        </div>
                        <div className="aq-info-item">
                          <span className="aq-info-key"><Clock size={12} /> Uploaded</span>
                          <span className="aq-info-val">{new Date(receipt.uploaded_at).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="aq-info-item">
                          <span className="aq-info-key">Status</span>
                          <StatusBadge status={receipt.status} />
                        </div>
                        {receipt.admin_notes && (
                          <div className="aq-info-item" style={{ gridColumn: '1/-1' }}>
                            <span className="aq-info-key">Admin Notes</span>
                            <span className="aq-info-val">{receipt.admin_notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions — only for pending */}
                      {receipt.status === 'pending' && (
                        <div className="aq-actions">
                          <button
                            className="aq-btn-approve"
                            disabled={!!actionLoading[receipt.id]}
                            onClick={() => handleAction(receipt.id, 'approve')}
                          >
                            {actionLoading[receipt.id] === 'approve'
                              ? 'Approving…'
                              : <><CheckCircle size={16} /> Approve &amp; Award Credits</>}
                          </button>

                          <div className="aq-reject-group">
                            <input
                              type="text"
                              className="aq-reject-input"
                              placeholder="Rejection reason (optional)…"
                              value={rejectNotes[receipt.id] || ''}
                              onChange={e => setRejectNotes(prev => ({ ...prev, [receipt.id]: e.target.value }))}
                            />
                            <button
                              className="aq-btn-reject"
                              disabled={!!actionLoading[receipt.id]}
                              onClick={() => handleAction(receipt.id, 'reject')}
                            >
                              {actionLoading[receipt.id] === 'reject'
                                ? 'Rejecting…'
                                : <><XCircle size={16} /> Reject</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Image Preview */}
                    <div className="aq-detail-right">
                      <div className="aq-section-label"><FileImage size={13} /> Receipt Image</div>
                      {receipt.receipt_image ? (
                        <>
                          <img
                            src={getImageUrl(receipt.receipt_image)}
                            alt="Receipt"
                            className="aq-receipt-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="aq-no-image" style={{ display: 'none' }}>Image could not be loaded</div>
                          <a
                            href={getImageUrl(receipt.receipt_image)}
                            target="_blank"
                            rel="noreferrer"
                            className="aq-view-full"
                          >
                            <Eye size={13} /> Open Full Image
                          </a>
                        </>
                      ) : (
                        <div className="aq-no-image">No image uploaded</div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
