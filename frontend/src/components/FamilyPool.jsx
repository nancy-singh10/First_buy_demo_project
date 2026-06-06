import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Activity, Send, Crown, X, CheckCircle, XCircle,
  Mail, TrendingUp, Wallet, LogOut, Zap, Heart, Target
} from 'lucide-react';
import '../styles/FamilyPool.css';

const API = 'http://localhost:8000/api/familypool';

function getToken() {
  return localStorage.getItem('access_token');
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
}

const formatINR = (val) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export default function FamilyPool({ user }) {
  const [pool, setPool] = useState(null);
  const [activity, setActivity] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPool, setHasPool] = useState(false);

  // Create pool state
  const [poolName, setPoolName] = useState('');
  const [creating, setCreating] = useState(false);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMsg, setInviteMsg] = useState({ text: '', type: '' });
  const [inviting, setInviting] = useState(false);

  const fetchPool = useCallback(async () => {
    try {
      const res = await fetch(`${API}/`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPool(data);
        setHasPool(true);
      } else {
        setPool(null);
        setHasPool(false);
      }
    } catch (err) {
      console.error('Error fetching pool:', err);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch(`${API}/activity/`, { headers: authHeaders() });
      if (res.ok) {
        setActivity(await res.json());
      }
    } catch (err) {
      console.error('Error fetching activity:', err);
    }
  }, []);

  const fetchPendingInvites = useCallback(async () => {
    try {
      const res = await fetch(`${API}/invitations/`, { headers: authHeaders() });
      if (res.ok) {
        setPendingInvites(await res.json());
      }
    } catch (err) {
      console.error('Error fetching invitations:', err);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPool(), fetchPendingInvites()]);
    setLoading(false);
  }, [fetchPool, fetchPendingInvites]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Fetch activity once pool is loaded
  useEffect(() => {
    if (hasPool) fetchActivity();
  }, [hasPool, fetchActivity]);

  // ── Create Pool ──
  const handleCreatePool = async (e) => {
    e.preventDefault();
    if (!poolName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/create/`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: poolName.trim() })
      });
      if (res.ok) {
        await fetchAll();
        setPoolName('');
      } else {
        const data = await res.json();
        alert(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // ── Invite Member ──
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API}/invite/`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email: inviteEmail.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setInviteMsg({ text: `Invitation sent to ${inviteEmail}!`, type: 'success' });
        setInviteEmail('');
        fetchPool();
      } else {
        const errText = data.detail || data.email?.[0] || Object.values(data).flat().join(', ') || 'Failed to send invite';
        setInviteMsg({ text: errText, type: 'error' });
      }
    } catch (err) {
      setInviteMsg({ text: 'Network error. Try again.', type: 'error' });
    } finally {
      setInviting(false);
      setTimeout(() => setInviteMsg({ text: '', type: '' }), 4000);
    }
  };

  // ── Accept / Decline Invitation ──
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`${API}/invitations/${id}/accept/`, {
        method: 'POST', headers: authHeaders()
      });
      if (res.ok) {
        await fetchAll();
      } else {
        const data = await res.json();
        alert(data.detail || 'Failed to accept');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await fetch(`${API}/invitations/${id}/decline/`, {
        method: 'POST', headers: authHeaders()
      });
      fetchPendingInvites();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Leave Pool ──
  const handleLeave = async () => {
    if (!window.confirm(
      pool.owner === user?.id
        ? 'You are the owner. Leaving will disband the entire family pool. Continue?'
        : 'Are you sure you want to leave this family pool?'
    )) return;
    try {
      const res = await fetch(`${API}/leave/`, {
        method: 'POST', headers: authHeaders()
      });
      if (res.ok) {
        await fetchAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Remove Member ──
  const handleRemove = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from the family pool?`)) return;
    try {
      const res = await fetch(`${API}/remove/${memberId}/`, {
        method: 'POST', headers: authHeaders()
      });
      if (res.ok) {
        fetchPool();
        fetchActivity();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="family-pool">
        <div className="fp-loading"><div className="fp-spinner"></div></div>
      </div>
    );
  }

  // ── Onboarding: No pool yet ──
  if (!hasPool) {
    return (
      <div className="family-pool">
        {/* Pending incoming invitations */}
        {pendingInvites.length > 0 && (
          <div className="fp-pending-banner">
            <div className="fp-pending-title">
              <Mail size={18} /> You have {pendingInvites.length} pending invitation{pendingInvites.length > 1 ? 's' : ''}
            </div>
            <div className="fp-invitations-section">
              {pendingInvites.map(inv => (
                <div key={inv.id} className="fp-invitation-card">
                  <div className="fp-invitation-info">
                    <div className="fp-invitation-pool-name">{inv.pool_name}</div>
                    <div className="fp-invitation-from">Invited by {inv.invited_by_name} • {formatDate(inv.created_at)}</div>
                  </div>
                  <div className="fp-invitation-actions">
                    <button className="fp-btn fp-btn-accept fp-btn-sm" onClick={() => handleAccept(inv.id)}>
                      <CheckCircle size={14} /> Accept
                    </button>
                    <button className="fp-btn fp-btn-decline fp-btn-sm" onClick={() => handleDecline(inv.id)}>
                      <XCircle size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="fp-onboarding">
          <div className="fp-onboarding-card">
            <div className="fp-onboarding-icon">
              <Users size={32} />
            </div>
            <div className="fp-onboarding-title">Create Your Family Pool</div>
            <p className="fp-onboarding-desc">
              Link accounts with your spouse, family, or partner. Pool your shopping credits together 
              and reach your home-buying goal <strong>twice as fast</strong>.
            </p>
            <form className="fp-create-form" onSubmit={handleCreatePool}>
              <input
                className="fp-create-input"
                type="text"
                placeholder="e.g. The Sharma Family"
                value={poolName}
                onChange={(e) => setPoolName(e.target.value)}
                required
                maxLength={100}
              />
              <button type="submit" className="fp-btn fp-btn-primary" disabled={creating}>
                <Users size={16} /> {creating ? 'Creating…' : 'Create Family Pool'}
              </button>
            </form>
          </div>

          <div className="fp-onboarding-features">
            <div className="fp-feature-card">
              <div className="fp-feature-icon purple"><Zap size={20} /></div>
              <div className="fp-feature-title">2× Faster</div>
              <div className="fp-feature-desc">Both partners earn credits from everyday shopping receipts</div>
            </div>
            <div className="fp-feature-card">
              <div className="fp-feature-icon blue"><Heart size={20} /></div>
              <div className="fp-feature-title">Shared Goal</div>
              <div className="fp-feature-desc">See combined progress toward your dream home together</div>
            </div>
            <div className="fp-feature-card">
              <div className="fp-feature-icon green"><Target size={20} /></div>
              <div className="fp-feature-title">Full Visibility</div>
              <div className="fp-feature-desc">Track every credit earned by each family member in real-time</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Pool View ──
  const combinedCredits = parseFloat(pool.combined_credits) || 0;
  const isOwner = pool.owner === user?.id;

  return (
    <div className="family-pool">

      {/* ── Header Card ── */}
      <div className="fp-header-card">
        <div className="fp-header-top">
          <div className="fp-pool-info">
            <span className="fp-pool-label">Family Pool</span>
            <div className="fp-pool-name">
              {pool.name}
              <span className="fp-badge">{pool.member_count} member{pool.member_count > 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="fp-header-actions">
            <button className="fp-btn fp-btn-danger fp-btn-sm" onClick={handleLeave}>
              <LogOut size={14} /> {isOwner ? 'Disband' : 'Leave'}
            </button>
          </div>
        </div>
        <div className="fp-header-stats">
          <div className="fp-stat-block">
            <div className="fp-stat-value credits">{formatINR(combinedCredits)}</div>
            <div className="fp-stat-label">Combined Family Credits</div>
          </div>
          <div className="fp-stat-block">
            <div className="fp-stat-value">{pool.member_count}</div>
            <div className="fp-stat-label">Family Members</div>
          </div>
          <div className="fp-stat-block">
            <div className="fp-stat-value">{formatDate(pool.created_at)}</div>
            <div className="fp-stat-label">Pool Created</div>
          </div>
        </div>
      </div>

      {/* ── Members Grid ── */}
      <div>
        <div className="fp-section-title"><Users size={18} /> Family Members</div>
        <div className="fp-members-grid">
          {pool.members.map(member => {
            const contribution = combinedCredits > 0
              ? ((parseFloat(member.total_credits) / combinedCredits) * 100).toFixed(1)
              : 0;
            const isMemberOwner = member.id === pool.owner;
            const initial = member.full_name ? member.full_name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase();

            return (
              <div key={member.id} className={`fp-member-card ${isMemberOwner ? 'is-owner' : ''}`}>
                {/* Remove button (only owner can remove non-owners) */}
                {isOwner && !isMemberOwner && (
                  <div
                    className="fp-member-remove-btn"
                    onClick={() => handleRemove(member.id, member.full_name)}
                    title="Remove member"
                  >
                    <X size={12} />
                  </div>
                )}

                <div className="fp-member-top">
                  <div className={`fp-member-avatar ${isMemberOwner ? 'owner-avatar' : 'member-avatar'}`}>
                    {initial}
                  </div>
                  <div>
                    <div className="fp-member-name">{member.full_name || member.email}</div>
                    <div className="fp-member-email">{member.email}</div>
                    <span className={`fp-member-role-badge ${isMemberOwner ? 'owner' : 'member'}`}>
                      {isMemberOwner ? '👑 Owner' : 'Member'}
                    </span>
                  </div>
                </div>

                <div className="fp-member-credits">
                  <span className="fp-member-credit-val">{formatINR(member.total_credits)}</span>
                  <span className={`fp-member-tier ${member.tier}`}>{member.tier}</span>
                </div>

                <div className="fp-contribution-bar-wrap">
                  <div className="fp-contribution-label">
                    <span>Contribution</span>
                    <span>{contribution}%</span>
                  </div>
                  <div className="fp-contribution-bar">
                    <div className="fp-contribution-fill" style={{ width: `${contribution}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Activity Feed + Invite Section ── */}
      <div className="fp-content-grid">

        {/* Activity Feed */}
        <div className="fp-activity-panel">
          <div className="fp-panel-title"><Activity size={18} /> Family Credit Activity</div>
          <div className="fp-activity-list">
            {activity.length === 0 && (
              <div className="fp-empty-state">No credit activity yet. Start uploading receipts!</div>
            )}
            {activity.map(tx => {
              const amt = parseFloat(tx.amount);
              const isPositive = amt > 0;
              const initial = tx.member_name ? tx.member_name.charAt(0).toUpperCase() : '?';
              const avatarClass = tx.transaction_type === 'earn_receipt'
                ? 'earn'
                : tx.transaction_type === 'bonus'
                  ? 'bonus'
                  : 'spend';

              return (
                <div key={tx.id} className="fp-activity-item">
                  <div className={`fp-activity-avatar ${avatarClass}`}>{initial}</div>
                  <div className="fp-activity-info">
                    <div className="fp-activity-name">{tx.member_name}</div>
                    <div className="fp-activity-desc">{tx.description}</div>
                  </div>
                  <div className="fp-activity-right">
                    <div className={`fp-activity-amount ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? '+' : ''}{formatINR(amt)}
                    </div>
                    <div className="fp-activity-date">{formatDate(tx.created_at)} • {formatTime(tx.created_at)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invite Panel */}
        <div className="fp-invite-panel">
          <div className="fp-panel-title"><UserPlus size={18} /> Invite Family Member</div>

          <form className="fp-invite-form" onSubmit={handleInvite}>
            <input
              className="fp-invite-input"
              type="email"
              placeholder="Enter email address..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <button type="submit" className="fp-btn fp-btn-primary fp-btn-sm" disabled={inviting}>
              <Send size={14} /> {inviting ? 'Sending…' : 'Send'}
            </button>
          </form>

          {inviteMsg.text && (
            <div className={`fp-invite-msg ${inviteMsg.type}`}>{inviteMsg.text}</div>
          )}

          <div className="fp-divider" />

          {/* Sent invitations from the pool */}
          <div className="fp-panel-title" style={{ fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            <Mail size={16} /> Sent Invitations
          </div>
          {pool.invitations && pool.invitations.length > 0 ? (
            <div className="fp-sent-list">
              {pool.invitations.map(inv => (
                <div key={inv.id} className="fp-sent-item">
                  <span className="fp-sent-email">{inv.invited_email}</span>
                  <span className={`fp-sent-status ${inv.status}`}>{inv.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="fp-empty-state" style={{ padding: '1rem' }}>No invitations sent yet.</div>
          )}
        </div>
      </div>

      {/* ── Pending incoming invitations (if user has a pool but also has pending from others) ── */}
      {pendingInvites.length > 0 && (
        <div className="fp-pending-banner">
          <div className="fp-pending-title">
            <Mail size={18} /> Pending Invitations for You
          </div>
          <div className="fp-invitations-section">
            {pendingInvites.map(inv => (
              <div key={inv.id} className="fp-invitation-card">
                <div className="fp-invitation-info">
                  <div className="fp-invitation-pool-name">{inv.pool_name}</div>
                  <div className="fp-invitation-from">Invited by {inv.invited_by_name}</div>
                </div>
                <div className="fp-invitation-actions">
                  <button className="fp-btn fp-btn-accept fp-btn-sm" onClick={() => handleAccept(inv.id)}>
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button className="fp-btn fp-btn-decline fp-btn-sm" onClick={() => handleDecline(inv.id)}>
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
