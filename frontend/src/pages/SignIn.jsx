import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Home } from 'lucide-react';
import '../styles/SignIn.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Invalid email or password');
      }

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">

        {/* ── Left: Image Panel ── */}
        <div className="signin-left">
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
        <div className="signin-right">
          <div className="signin-welcome">
            <h1>Welcome Back</h1>
            <p>Please enter your details to sign in</p>
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="signin-form-group">
              <label className="signin-label">Email Address</label>
              <div className="signin-input-wrapper">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="signin-form-group">
              <label className="signin-label">Password</label>
              <div className="signin-input-wrapper">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="signin-options">
              <label className="signin-remember">
                <input type="checkbox" />
                Remember me
              </label>
              <button type="button" className="signin-forgot">Forgot password?</button>
            </div>

            <button type="submit" className="btn-signin-submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <button type="button" className="btn-google" onClick={() => navigate('/dashboard')}>
              <span className="g-icon">G</span>
              Continue with Google
            </button>

            <div className="signin-divider">
              <span>or</span>
            </div>

            <div className="signin-footer-text">
              Don't have an account?
              <Link to="/signup">Sign up</Link>
            </div>

            <div className="signin-back-link">
              <Link to="/">Back to Home</Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
