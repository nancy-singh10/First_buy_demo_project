import React, { useState } from 'react';
import { Home, Menu, X, ArrowRight } from 'lucide-react';
import '../styles/Header.css';

export default function Header({ activeSection, setActiveSection, currentView, setCurrentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home', type: 'scroll' },
    { label: 'Properties', id: 'properties', type: 'scroll' },
    { label: 'How It Works', id: 'how-it-works', type: 'scroll' },
    { label: 'Rewards', id: 'rewards', type: 'scroll' },
    { label: 'Reviews', id: 'reviews', type: 'scroll' },
    { label: 'Contact', id: 'contact', type: 'scroll' },
    { label: 'Dashboard', id: 'dashboard', type: 'view' },
  ];

  const handleNavClick = (item) => {
    setMobileMenuOpen(false);
    if (item.type === 'view') {
      setCurrentView(item.id);
      setActiveSection(item.id);
    } else {
      setCurrentView('landing');
      setActiveSection(item.id);
      setTimeout(() => {
        const element = document.getElementById(item.id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  };

  return (
    <>
      <header className="header">
        <div className="container header-container">
          <div className="logo" onClick={() => handleNavClick({ id: 'home', type: 'scroll' })}>
            <div className="logo-icon-wrapper">
              <Home size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div className="logo-text">
              <div className="logo-title">
                FirstBuy <span className="logo-badge">AI</span>
              </div>
              <div className="logo-subtitle">Property × Fintech</div>
            </div>
          </div>

          <nav>
            <ul className="nav-menu">
              {navItems.map((item) => (
                <li
                  key={item.id}
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button className="btn-signin" onClick={() => setCurrentView('dashboard')}>Sign In</button>
            <button className="btn-getstarted" onClick={() => setCurrentView('dashboard')}>
              Get Started <ArrowRight size={16} />
            </button>
          </div>

          <div className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="logo">
            <div className="logo-icon-wrapper">
              <Home size={18} color="#ffffff" />
            </div>
            <div className="logo-title">FirstBuy AI</div>
          </div>
          <button className="mobile-close" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff' }}>
            <X size={24} />
          </button>
        </div>

        <ul className="mobile-nav-links">
          {navItems.map((item) => (
            <li
              key={item.id}
              className={`mobile-nav-item ${activeSection === item.id ? 'active' : ''}`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-nav-actions">
          <button className="btn-signin" onClick={() => { setMobileMenuOpen(false); setCurrentView('dashboard'); }} style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
            Sign In
          </button>
          <button className="btn-getstarted" onClick={() => { setMobileMenuOpen(false); setCurrentView('dashboard'); }} style={{ width: '100%', justifyContent: 'center' }}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
