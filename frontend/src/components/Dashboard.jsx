import React, { useState } from 'react';
import { ArrowLeft, Wallet, CreditCard, Layers, UploadCloud, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import '../styles/Dashboard.css';

export default function Dashboard({ setCurrentView, setActiveSection }) {
  const [balance, setBalance] = useState(382450);
  const [monthlySpend, setMonthlySpend] = useState(42500);
  const [scansCount, setScansCount] = useState(24);
  const [scanning, setScanning] = useState(false);
  const [uploadType, setUploadType] = useState('Electricity');
  
  const [ledger, setLedger] = useState([
    { id: 1, title: 'BPCL Petrol Pump Fuel', date: '24-May-2026', type: '⛽ Fuel', amt: 525, status: 'Verified' },
    { id: 2, title: 'HDFC Rent Transfer', date: '02-May-2026', type: '🏢 Rent', amt: 2500, status: 'Verified' },
    { id: 3, title: 'BigBasket Grocery', date: '28-Apr-2026', type: '🛒 Grocery', amt: 180, status: 'Verified' },
    { id: 4, title: 'BESCOM Electricity Utility', date: '15-Apr-2026', type: '⚡ Utility', amt: 400, status: 'Verified' },
  ]);

  const handleUploadClick = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      let yieldAmt = 0;
      let titleName = '';
      let typeLabel = '';

      if (uploadType === 'Electricity') {
        yieldAmt = 450;
        titleName = 'BESCOM Electricity Bill';
        typeLabel = '⚡ Utility';
      } else if (uploadType === 'Fuel') {
        yieldAmt = 620;
        titleName = 'IndianOil Fuel Receipt';
        typeLabel = '⛽ Fuel';
      } else {
        yieldAmt = 150;
        titleName = 'Swiggy Food Delivery';
        typeLabel = '🍔 Food';
      }

      setBalance(prev => prev + yieldAmt);
      setScansCount(prev => prev + 1);
      setMonthlySpend(prev => prev + 3500);
      
      const newLog = {
        id: Date.now(),
        title: titleName,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
        type: typeLabel,
        amt: yieldAmt,
        status: 'Verified'
      };

      setLedger(prev => [newLog, ...prev]);
    }, 2200);
  };

  const formattedCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Downpayment target variables
  const propertyTarget = 18500000; // 1.85 Cr
  const downpaymentGoal = propertyTarget * 0.10; // 10% downpayment = 18.5 L
  const progressPercent = Math.min(((balance / downpaymentGoal) * 100).toFixed(1), 100);

  return (
    <div className="dashboard-portal">
      <div className="container">
        
        {/* Top Header */}
        <div className="db-header-row">
          <div className="db-title-col">
            <h2>Your AI Ledger</h2>
            <p>Track your spending, credits allocation, and progress toward home ownership.</p>
          </div>
          <button className="btn-back-home" onClick={() => { setCurrentView('landing'); setActiveSection('home'); }}>
            <ArrowLeft size={16} /> Back to Landing Page
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="db-grid">
          
          {/* Left panel: Actions, Stats, Logs */}
          <div className="db-left">
            
            {/* Stats Summary cards */}
            <div className="db-stats-row">
              <div className="db-stat-card glass-card">
                <div className="db-stat-icon-row">
                  <div className="db-stat-icon purple"><Wallet size={18} /></div>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Active</span>
                </div>
                <div className="db-stat-label">Credits Balance</div>
                <div className="db-stat-val text-gradient">{formattedCurrency(balance)}</div>
              </div>

              <div className="db-stat-card glass-card">
                <div className="db-stat-icon-row">
                  <div className="db-stat-icon blue"><CreditCard size={18} /></div>
                  <span style={{ fontSize: '0.7rem', color: '#a855f7', fontWeight: 600 }}>This month</span>
                </div>
                <div className="db-stat-label">Spend Tracked</div>
                <div className="db-stat-val">{formattedCurrency(monthlySpend)}</div>
              </div>

              <div className="db-stat-card glass-card">
                <div className="db-stat-icon-row">
                  <div className="db-stat-icon.green" style={{ width: '36px', height: '36px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justify: 'center' }}><Layers size={18} /></div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OCR Verified</span>
                </div>
                <div className="db-stat-label">Invoices Scanned</div>
                <div className="db-stat-val">{scansCount}</div>
              </div>
            </div>

            {/* Document Uploader Simulator */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Simulate OCR Receipt Upload</h3>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Select Mock Invoice</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                  >
                    <option value="Electricity">Electricity Bill (Utility - ₹4,500)</option>
                    <option value="Fuel">IndianOil Petrol Receipt (Fuel - ₹4,200)</option>
                    <option value="Swiggy">Food Bill (Shopping - ₹1,200)</option>
                  </select>
                </div>
              </div>

              <div className="db-uploader-box" onClick={handleUploadClick} style={{ position: 'relative', overflow: 'hidden' }}>
                {scanning && (
                  <div className="scanner-laser" style={{ background: 'linear-gradient(to right, transparent, var(--accent-purple), transparent)', boxShadow: '0 0 12px var(--accent-purple)', height: '4px' }}></div>
                )}
                <div className="upload-icon-circle">
                  <UploadCloud size={28} />
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>
                  {scanning ? 'OCR Scanner scanning receipt image...' : 'Click to Upload and Parse Receipt'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supported formats: PDF, PNG, JPG (Max 5MB)
                </span>
              </div>
            </div>

            {/* Ledger logs */}
            <div className="ledger-card glass-card">
              <h3 className="ledger-header">Transaction Log</h3>
              <div className="ledger-list">
                {ledger.map((item) => (
                  <div key={item.id} className="ledger-item">
                    <div className="ledger-item-left">
                      <div className="ledger-item-icon">{item.type.split(' ')[0]}</div>
                      <div className="ledger-item-details">
                        <span className="ledger-item-title">{item.title}</span>
                        <span className="ledger-item-date">{item.date} • {item.type.split(' ')[1]}</span>
                      </div>
                    </div>
                    <div className="ledger-item-right">
                      <span className="ledger-item-amt">+{item.amt} Credits</span>
                      <div className="ledger-item-status" style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', color: '#10b981' }}>
                        <ShieldCheck size={10} /> Verified
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right panel: Home Goal progress */}
          <div className="db-right">
            
            {/* Goal Card */}
            <div className="target-progress-card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', borderRadius: '4px', fontWeight: 600 }}>Redemption Goal</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target: Skyline Residences</span>
              </div>

              <h3 className="target-title text-gradient">Gurgaon Sec 54 • 3 BHK</h3>

              <div className="target-stat-box">
                <span className="target-stat-label">Downpayment Target (10%)</span>
                <span className="target-stat-val">{formattedCurrency(downpaymentGoal)}</span>
              </div>

              <div className="target-stat-box">
                <span className="target-stat-label">Accumulated Credits Value</span>
                <span className="target-stat-val" style={{ color: '#10b981' }}>{formattedCurrency(balance)}</span>
              </div>

              <div className="target-progress-bar-bg">
                <div className="target-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <span>Goal Progress</span>
                <span style={{ color: 'var(--accent-purple)' }}>{progressPercent}% Completed</span>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Redemption Checklist</h4>
              <ul className="target-checklist">
                <li className="target-check-item">
                  <Check size={14} color="#10b981" /> KYC Verification approved
                </li>
                <li className="target-check-item">
                  <Check size={14} color="#10b981" /> Builder RERA checklist approved
                </li>
                <li className="target-check-item">
                  <Check size={14} color="#10b981" /> Min threshold 1,00,000 credits met
                </li>
                <li className="target-check-item" style={{ color: 'var(--text-muted)' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block' }}></div> Downpayment total threshold met
                </li>
              </ul>
              
              <button className="btn-primary" onClick={() => alert('Simulator: Credits applied successfully toward booking reservation!')} style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} disabled={balance < downpaymentGoal && false}>
                Redeem Downpayment <ArrowRight size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
