import React, { useState } from 'react';
import { Check, Shield } from 'lucide-react';
import '../styles/RedeemSection.css';

export default function RedeemSection() {
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [monthlySpend, setMonthlySpend] = useState(15000);

  // Simple calculation: Rent yields 10% credit, other spends yield 15% credit
  // Projected total credits earned over 3 years (36 months)
  const monthlyCredits = Math.round(monthlyRent * 0.10 + monthlySpend * 0.15);
  const projectedCredits3Years = monthlyCredits * 36;
  
  // Simulated EMI reduction (assume credits reduce principal, lowering EMI by e.g. 1.2% per 50K credits)
  const emiReductionAmount = Math.round((projectedCredits3Years / 100000) * 1850);

  const formattedCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section className="redeem-section">
      <div className="container redeem-grid">
        
        {/* Left Column: Descriptions */}
        <div className="redeem-content">
          <span className="step-detail-step-label">Step 4 detailed</span>
          <h2 className="redeem-title text-gradient-primary">Redeem for home ownership</h2>
          <p className="redeem-desc">
            Apply credits at checkout — reduce principal, EMI, or registration fees. FirstBuy AI links directly with major banking institutions and rated realtors to credit your down payments seamlessly.
          </p>

          <ul className="step-detail-bullets">
            <li className="step-detail-bullet-item">
              <span className="step-bullet-check">
                <Check size={12} />
              </span>
              Partner bank network
            </li>
            <li className="step-detail-bullet-item">
              <span className="step-bullet-check">
                <Check size={12} />
              </span>
              Lifetime credits
            </li>
            <li className="step-detail-bullet-item">
              <span className="step-bullet-check">
                <Check size={12} />
              </span>
              Concierge handover
            </li>
          </ul>
        </div>

        {/* Right Column: Calculator Widget */}
        <div className="calc-widget">
          <div className="calc-title">
            <Shield size={18} color="var(--accent-purple)" />
            EMI Reduction Calculator
          </div>
          
          <div className="calc-slider-group">
            
            {/* Rent Slider */}
            <div className="slider-container">
              <div className="slider-label-row">
                <span>Monthly Rent</span>
                <span className="slider-val">{formattedCurrency(monthlyRent)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="2500"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="custom-slider"
              />
            </div>

            {/* Other Spend Slider */}
            <div className="slider-container">
              <div className="slider-label-row">
                <span>Other spends (Groceries, Fuel, Bills)</span>
                <span className="slider-val">{formattedCurrency(monthlySpend)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="custom-slider"
              />
            </div>

          </div>

          <div className="calc-results">
            <div className="result-card">
              <div className="result-label">3yr Credit Balance</div>
              <div className="result-value">{formattedCurrency(projectedCredits3Years)}</div>
            </div>
            
            <div className="result-card">
              <div className="result-label">Est. EMI Saved / mo</div>
              <div className="result-value purple">{formattedCurrency(emiReductionAmount)}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
