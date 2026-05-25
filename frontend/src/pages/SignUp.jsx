import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, Home } from 'lucide-react';
import '../styles/SignUp.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState('User');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const roles = ['User', 'Builder', 'Owner', 'Agent'];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">

        {/* ── Left: Image Panel ── */}
        <div className="signup-left">
          <div className="signin-brand">
            <div className="signin-brand-icon">
              <Home size={16} color="#fff" />
            </div>
            <span className="signin-brand-name">First-Buy</span>
          </div>

          <div className="signin-tagline">
            <h2>
              Start earning your<br />
              <span className="text-gradient">Property Credit</span><br />
              today.
            </h2>
          </div>

          <div className="signin-social-proof">
            <div className="signin-avatars">
              <div className="signin-avatar" style={{ background: '#6366f1' }}>N</div>
              <div className="signin-avatar" style={{ background: '#a855f7' }}>P</div>
              <div className="signin-avatar count">+50k</div>
            </div>
            <span className="signin-social-text">Join 50,000 users saving for their first home.</span>
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="signup-right">
          <div className="signup-welcome">
            <h1>Create Your Account</h1>
            <p>Join us and explore exclusive properties.</p>
          </div>

          {/* Role Tabs */}
          <div className="signup-role-tabs">
            {roles.map((r) => (
              <button
                key={r}
                className={`role-tab ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
                type="button"
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="signup-form-group">
              <label className="signup-label">Full Name *</label>
              <div className="signup-input-wrapper">
                <User size={16} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  required
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-label">Phone Number *</label>
              <div className="signup-input-wrapper">
                <Phone size={16} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  required
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-label">Email Address *</label>
              <div className="signup-input-wrapper">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-label">Password *</label>
              <div className="signup-input-wrapper">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange('password')}
                  required
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-label">Confirm Password *</label>
              <div className="signup-input-wrapper">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-signup-submit">Create Account</button>
          </form>

          <div className="signup-footer-text">
            Already have an account?
            <Link to="/signin">Sign in</Link>
          </div>

          <div className="signup-back-link">
            <Link to="/">Back to Home</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
