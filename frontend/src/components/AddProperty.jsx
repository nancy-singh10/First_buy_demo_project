import React, { useState } from 'react';
import { Building, MapPin, DollarSign, Tag, FileText, CheckCircle } from 'lucide-react';

export default function AddProperty({ onPropertyAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_in_inr: '',
    location: '',
    max_credit_discount_allowed: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('access_token');
      
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const response = await fetch('http://localhost:8000/api/properties/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: payload
      });

      if (response.ok) {
        setStatusMsg({ type: 'success', text: 'Property added successfully!' });
        setFormData({
          title: '',
          description: '',
          price_in_inr: '',
          location: '',
          max_credit_discount_allowed: ''
        });
        setImageFile(null);
        if (onPropertyAdded) onPropertyAdded();
      } else {
        const data = await response.json();
        setStatusMsg({ type: 'error', text: data.message || 'Error adding property. Please check fields.' });
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="db-chart-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div className="db-chart-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <div>
          <h3 className="db-chart-title" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={24} color="#60a5fa" />
            Add New Property
          </h3>
          <p className="db-chart-subtitle">List a new property for FirstBuy buyers</p>
        </div>
      </div>

      {statusMsg.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: statusMsg.type === 'success' ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 500
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : null}
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Property Title</label>
            <div style={{ position: 'relative' }}>
              <Building size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Skyline Residences Penthouse"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bandra West, Mumbai"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Price (INR)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="number"
                name="price_in_inr"
                value={formData.price_in_inr}
                onChange={handleChange}
                placeholder="e.g. 15000000"
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Max Credit Discount Allowed (INR)</label>
            <div style={{ position: 'relative' }}>
              <Tag size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="number"
                name="max_credit_discount_allowed"
                value={formData.max_credit_discount_allowed}
                onChange={handleChange}
                placeholder="e.g. 500000"
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
          <div style={{ position: 'relative' }}>
            <FileText size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the property details, amenities, etc."
              required
              rows="4"
              style={{
                width: '100%',
                padding: '12px 12px 12px 36px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Property Image (Optional)</label>
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            marginTop: '1rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => { if (!isSubmitting) e.target.style.background = '#2563eb' }}
          onMouseOut={(e) => { if (!isSubmitting) e.target.style.background = '#3b82f6' }}
        >
          {isSubmitting ? 'Adding Property...' : 'Submit Property'}
        </button>
      </form>
    </div>
  );
}
