import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Home } from 'lucide-react';
import '../styles/SignIn.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just navigate to dashboard
    navigate('/dashboard');
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

            <button type="submit" className="btn-signin-submit">Sign in</button>

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
