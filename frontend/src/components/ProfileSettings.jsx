import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Award, Wallet, Activity } from 'lucide-react';

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No authentication token found. Please sign in again.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/auth/me/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError('Failed to load profile data.');
        }
      } catch (err) {
        setError('A network error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444', padding: '2rem' }}>{error}</div>;
  }

  if (!profile) return null;

  return (
    <div className="profile-container" style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '2rem', color: '#fff' }}>Account Settings</h2>
      
      <div className="db-chart-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold', color: '#fff'
          }}>
            {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{profile.full_name || 'User'}</h3>
            <span style={{ 
              display: 'inline-block', padding: '4px 10px', borderRadius: '20px', 
              fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8',
              fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              {profile.role}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <Mail size={16} /> Email Address
            </div>
            <div style={{ fontSize: '1.1rem' }}>{profile.email}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <Phone size={16} /> Phone Number
            </div>
            <div style={{ fontSize: '1.1rem' }}>{profile.phone_number}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <Award size={16} /> Loyalty Tier
            </div>
            <div style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{profile.tier}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <Wallet size={16} /> Property Credits
            </div>
            <div style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 'bold' }}>
              ₹{parseFloat(profile.total_credits).toLocaleString()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
