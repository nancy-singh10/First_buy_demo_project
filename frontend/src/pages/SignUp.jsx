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
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = ['User', 'Builder', 'Owner', 'Agent'];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Frontend validation
    if (!form.fullName || form.fullName.trim().length < 2) {
      setError('Please enter a valid full name (at least 2 characters)');
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(form.phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // 2. API Request (POST /signup) -> Django backend
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.fullName,
          phone: form.phone,
          role: role.toLowerCase()
        })
      });
      
      const data = await response.json();
      
      // 3. Backend checks user exists, returns error if so
      if (!response.ok) {
        throw new Error(data.email?.[0] || data.detail || 'Registration failed');
      }

      // 4. Return success, store JWT tokens
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      
      // 5. Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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

          {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

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

            <button type="submit" className="btn-signup-submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
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
