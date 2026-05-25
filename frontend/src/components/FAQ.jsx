import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/FAQ.css';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do Property Credits work?',
      a: 'Every verified bill earns a percentage back as Property Credits. Credits are redeemable at checkout with partnered builders, reducing your principal or EMI.'
    },
    {
      q: 'Is my financial data safe?',
      a: 'Yes. We use bank-level encryption and never share your identifiable data without explicit consent.'
    },
    {
      q: 'Which cities are supported?',
      a: 'We currently support properties in Bengaluru, Mumbai, Pune, Gurgaon, and Hyderabad, with more cities coming soon.'
    },
    {
      q: 'Do I need to switch banks?',
      a: 'Not at all. You can upload receipts from any bank or payment method to earn credits.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        
        <div className="section-tag-wrapper" style={{ justifyContent: 'center' }}>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge-dot purple"></span>
            FAQ
          </div>
        </div>

        <div className="section-title-wrapper" style={{ textAlign: 'center', alignItems: 'center' }}>
          <h2 className="section-title">
            Questions, <span className="text-gradient">answered.</span>
          </h2>
        </div>

        <div className="faq-container">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(i)}>
                {faq.q}
                <ChevronDown className="faq-icon" size={20} />
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
