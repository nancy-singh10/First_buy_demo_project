import React, { useState, useEffect } from 'react';
import { UploadCloud, Wallet, Building, Home, Check, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import '../styles/HowItWorks.css';

export default function HowItWorks({ setCurrentView }) {
  const [activeStep, setActiveStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState('Rent');
  const [creditsAwarded, setCreditsAwarded] = useState(0);

  const steps = [
    {
      id: 'upload',
      number: '01',
      label: 'Upload Bills',
      short: 'Snap a photo of any receipt — rent, fuel, groceries, utilities.',
      icon: <UploadCloud size={20} />,
      title: 'Seamlessly upload bills & receipts',
      description: 'Our advanced document parsing engine accepts and categorizes any bill type. Just snap a photo or drop an invoice to kick off the conversion.',
      bullets: [
        'Supports PDFs, JPEGs, PNGs',
        'Automatic utility, rent, and fuel categorization',
        'Instant security encryption'
      ]
    },
    {
      id: 'earn',
      number: '02',
      label: 'Earn Property Credits',
      short: 'Our AI verifies & converts spend into redeemable Property Credits.',
      icon: <Wallet size={20} />,
      title: 'AI yields verified property credits',
      description: 'Your spending compounds automatically. Our AI ledger verifies invoice details, applies matching builder promotions, and allocates credits to your secure balance.',
      bullets: [
        'Instant proof-of-payment checks',
        'Bonus tier credit multipliers',
        'Transparent ledger logging'
      ]
    },
    {
      id: 'explore',
      number: '03',
      label: 'Explore Verified Properties',
      short: 'Browse 15,000+ listings from rated builders across India.',
      icon: <Building size={20} />,
      title: 'Browse premium builder listings',
      description: 'Discover your dream home from our catalog of pre-vetted real estate assets. View price lists, builder rating indexes, and credit eligibility rules.',
      bullets: [
        '100% pre-vetted builder profiles',
        'Location-based affordability ratings',
        'Direct credit matching calculation'
      ]
    },
    {
      id: 'redeem',
      number: '04',
      label: 'Redeem & Own',
      short: 'Apply credits at checkout, reduce EMIs, move into your home.',
      icon: <Home size={20} />,
      title: 'Redeem for home ownership',
      description: 'Apply your compiled Property Credits at checkout to reduce your home purchase principal, down payment, bank EMI interest rate, or registration fees.',
      bullets: [
        'Partner bank networks integration',
        'Lifetime credit guarantee',
        'Concierge support for handover'
      ]
    }
  ];

  // OCR scanning mock logic
  const triggerScan = () => {
    setScanning(true);
    setCreditsAwarded(0);
    setTimeout(() => {
      setScanning(false);
      if (selectedReceipt === 'Rent') setCreditsAwarded(2500);
      else if (selectedReceipt === 'Fuel') setCreditsAwarded(350);
      else setCreditsAwarded(120);
    }, 2500);
  };

  useEffect(() => {
    // Reset scanner state when changing tabs
    setScanning(false);
    setCreditsAwarded(0);
  }, [activeStep]);

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-tag-wrapper">
          <div className="badge">
            <span className="badge-dot"></span>
            How It Works
          </div>
        </div>
        
        <div className="section-title-wrapper">
          <h2 className="section-title">From receipts to keys, in four moves.</h2>
          <p className="section-subtitle">
            A premium pipeline that quietly compounds your spending into ownership.
          </p>
        </div>

        {/* Steps Cards Selector */}
        <div className="steps-selector-grid">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`step-selector-card glass-card ${activeStep === index ? 'active' : ''}`}
              onClick={() => setActiveStep(index)}
            >
              <div className="step-card-header">
                <span className="step-number">{step.number}</span>
                <span className="step-icon-wrapper">{step.icon}</span>
              </div>
              <h3 className="step-card-title">{step.label}</h3>
              <p className="step-card-desc">{step.short}</p>
            </div>
          ))}
        </div>

        {/* Detailed Showcase Box */}
        <div className="step-detail-container">
          
          {/* Left Text Detail */}
          <div className="step-detail-text">
            <span className="step-detail-step-label">Step {steps[activeStep].number} Detail</span>
            <h3 className="step-detail-title">{steps[activeStep].title}</h3>
            <p className="step-detail-desc">{steps[activeStep].description}</p>
            
            <ul className="step-detail-bullets">
              {steps[activeStep].bullets.map((bullet, i) => (
                <li key={i} className="step-detail-bullet-item">
                  <span className="step-bullet-check">
                    <Check size={12} />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>

            {activeStep === 3 && (
              <button className="btn-primary" onClick={() => setCurrentView('dashboard')} style={{ alignSelf: 'flex-start' }}>
                Open Dashboard <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* Right Interactive Preview */}
          <div className="step-interactive-preview">
            
            {/* Step 1: Scan receipt mockup */}
            {activeStep === 0 && (
              <div className="scan-mockup">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>OCR AI Scanner</span>
                  <select
                    value={selectedReceipt}
                    onChange={(e) => setSelectedReceipt(e.target.value)}
                    style={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.8rem', padding: '4px', borderRadius: '4px' }}
                    disabled={scanning}
                  >
                    <option value="Rent">Rent Invoice (₹25,000)</option>
                    <option value="Fuel">Fuel receipt (₹3,500)</option>
                    <option value="Dining">Dining receipt (₹1,200)</option>
                  </select>
                </div>

                <div className="receipt-card">
                  {scanning && <div className="scanner-laser"></div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>INVOICE: FB-2026-928</span>
                    <span>24-May-2026</span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, margin: '5px 0' }}>
                    {selectedReceipt} Payment
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '5px', fontSize: '0.75rem' }}>
                    <span>Verified Payee: RealEst Ltd</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>PAID</span>
                  </div>
                </div>

                {creditsAwarded > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: '#10b981', fontSize: '0.85rem' }}>
                    <Check size={16} /> Scan completed! <strong>+{creditsAwarded} Credits</strong> added.
                  </div>
                )}

                <button
                  className="btn-upload-trigger"
                  onClick={triggerScan}
                  disabled={scanning}
                  style={{ opacity: scanning ? 0.7 : 1 }}
                >
                  {scanning ? 'Analyzing invoice details...' : 'Simulate OCR Scan'}
                </button>
              </div>
            )}

            {/* Step 2: AI Yield Log */}
            {activeStep === 1 && (
              <div className="yields-mockup">
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Live Credit Ledger
                </div>
                <div className="yield-stat-row">
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>HDFC Rent Payment</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Base: ₹25,000</div>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 700 }}>+2,500 Credits</div>
                </div>
                <div className="yield-stat-row">
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>BPCL Petrol Pump</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Bonus: 1.5x Silver tier</div>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 700 }}>+525 Credits</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <div style={{ flex: 1, padding: '10px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Total Balance</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a5b4fc' }}>₹3,82,450</div>
                  </div>
                  <div style={{ flex: 1, padding: '10px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Current Multiplier</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc' }}>1.5x Gold</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Map / Listing preview */}
            {activeStep === 2 && (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Builders Near You</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 600 }}>15,420 Listings</span>
                </div>
                
                {/* Simulated list of verified projects */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {[
                    { name: 'Skyline Residences', builder: 'DLF Group', rating: 98, location: 'Gurgaon Sec 54' },
                    { name: 'Emerald Meadows', builder: 'Godrej Properties', rating: 96, location: 'Whitefield, Bangalore' }
                  ].map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', alignItems: 'center' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '0.9rem' }}>
                        🏢
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{p.builder} • {p.location}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>{p.rating} Trust</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Redeemable</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Video player with Home logo */}
            {activeStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="media-placeholder">
                  <Home size={38} color="#ffffff" strokeWidth={2} />
                </div>
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Redemption Dashboard</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    100% Direct Checkout Integration
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
