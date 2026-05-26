import React, { useState } from 'react';
import { Home, Menu, X, ArrowRight, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Properties', path: '/properties' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Rewards', path: '/rewards' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Contact', path: '/contact' },
    ...(isAuthenticated ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="container header-container">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-wrapper">
              <Home size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div className="logo-text">
              <div className="logo-title">
                FirstBuy <span className="logo-badge">AI</span>
              </div>
              <div className="logo-subtitle">Property × Fintech</div>
            </div>
          </Link>

          <nav>
            <ul className="nav-menu">
              {navItems.map((item) => (
                <li key={item.label} className="nav-item">
                  <NavLink
                    to={item.path}
                    onClick={() => handleNavClick()}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <button onClick={handleSignOut} className="btn-signin" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/signin" className="btn-signin">Sign In</Link>
                <Link to="/signin" className="btn-getstarted">
                  Get Started <ArrowRight size={16} />
                </Link>
              </>
            )}
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
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-wrapper">
              <Home size={18} color="#ffffff" />
            </div>
            <div className="logo-title">FirstBuy AI</div>
          </Link>
          <button className="mobile-close" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff' }}>
            <X size={24} />
          </button>
        </div>

        <ul className="mobile-nav-links">
          {navItems.map((item) => (
            <li key={item.label} className="mobile-nav-item">
              <NavLink
                to={item.path}
                onClick={() => handleNavClick()}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mobile-nav-actions">
            {isAuthenticated ? (
              <button onClick={handleSignOut} className="btn-signin" style={{ width: '100%', textAlign: 'center', padding: '10px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/signin" className="btn-signin" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
                  Sign In
                </Link>
                <Link to="/signin" className="btn-getstarted" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
                  Get Started <ArrowRight size={16} />
                </Link>
              </>
            )}
        </div>
      </div>
    </>
  );
}
