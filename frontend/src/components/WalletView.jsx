import React, { useState, useEffect } from 'react';
import { Wallet, Activity, Gift, X, CheckCircle, Clock } from 'lucide-react';
import '../styles/WalletView.css';

export default function WalletView({ user, onUpdateUser }) {
  const [transactions, setTransactions] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [txRes, rRes, pRes] = await Promise.all([
        fetch('http://localhost:8000/api/credits/transactions/', { headers }),
        fetch('http://localhost:8000/api/credits/redemptions/', { headers }),
        fetch('http://localhost:8000/api/properties/')
      ]);

      if (txRes.ok) setTransactions((await txRes.json()).results || []);
      if (rRes.ok) setRedemptions((await rRes.json()).results || []);
      if (pRes.ok) setProperties((await pRes.json()).results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedPropId || !spendAmount) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/credits/redemptions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          property: selectedPropId,
          credits_spent: spendAmount
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || Object.values(data).flat().join(', ') || 'Failed to submit request');
      }

      setSuccessMsg('Redemption request submitted successfully!');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg('');
        setSpendAmount('');
        setSelectedPropId('');
        fetchData(); // Refresh history
        if (onUpdateUser) onUpdateUser(); // Trigger user fetch to update total credits
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="wallet-view">
      <div className="wallet-header-card">
        <div className="wallet-balance-col">
          <span className="wallet-balance-label">Total Credits Available</span>
          <div className="wallet-balance-value">
            <Wallet size={32} />
            {formatINR(user?.total_credits || 0)}
          </div>
        </div>
        <button className="wallet-redeem-btn" onClick={() => setShowModal(true)}>
          <Gift size={18} /> Redeem Credits
        </button>
      </div>

      <div className="wallet-grid">
        <div className="wallet-panel">
          <div className="wallet-panel-title"><Activity size={18} /> Recent Transactions</div>
          <div className="wallet-list">
            {transactions.length === 0 && <div className="wallet-item-date">No transactions yet.</div>}
            {transactions.map(tx => (
              <div key={tx.id} className="wallet-list-item">
                <div className="wallet-item-left">
                  <div className="wallet-item-title">{tx.description}</div>
                  <div className="wallet-item-date">{formatDate(tx.created_at)}</div>
                </div>
                <div className="wallet-item-right">
                  <div className={`wallet-item-amount ${parseFloat(tx.amount) > 0 ? 'positive' : 'negative'}`}>
                    {parseFloat(tx.amount) > 0 ? '+' : ''}{formatINR(tx.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wallet-panel">
          <div className="wallet-panel-title"><Clock size={18} /> Pending Redemptions</div>
          <div className="wallet-list">
            {redemptions.length === 0 && <div className="wallet-item-date">No redemptions found.</div>}
            {redemptions.map(r => (
              <div key={r.id} className="wallet-list-item">
                <div className="wallet-item-left">
                  <div className="wallet-item-title">{r.property_title}</div>
                  <div className="wallet-item-date">{formatDate(r.requested_at)}</div>
                </div>
                <div className="wallet-item-right">
                  <div className="wallet-item-amount negative">-{formatINR(r.credits_spent)}</div>
                  <div className={`wallet-item-status status-${r.status}`}>{r.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="redeem-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title">Redeem Credits</h3>
              <div className="modal-close-btn" onClick={() => setShowModal(false)}><X size={20} /></div>
            </div>

            {successMsg ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ color: '#10b981' }}>{successMsg}</h4>
              </div>
            ) : (
              <form onSubmit={handleRedeemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {errorMsg && (
                  <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                    {errorMsg}
                  </div>
                )}
                
                <div className="form-group-col">
                  <label>Select Property</label>
                  <select 
                    className="form-input-text" 
                    value={selectedPropId} 
                    onChange={(e) => setSelectedPropId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a property --</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-col">
                  <label>Credits to Spend (Max: {formatINR(user?.total_credits || 0)})</label>
                  <input
                    type="number"
                    className="form-input-text"
                    required
                    min="1"
                    max={user?.total_credits || 0}
                    value={spendAmount}
                    onChange={e => setSpendAmount(e.target.value)}
                    placeholder="e.g. 50000"
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-modal-submit">Confirm Redemption</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
