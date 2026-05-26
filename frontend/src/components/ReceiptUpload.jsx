import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReceiptUpload() {
  const [storeName, setStoreName] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!storeName || !amount || !file) {
      setError('Please fill in all fields and select a receipt image.');
      return;
    }

    setLoading(true);
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to upload a receipt.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('store_name', storeName);
    formData.append('amount_spent', amount);
    formData.append('receipt_image', file);

    try {
      const response = await fetch('http://localhost:8000/api/receipts/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail) {
          throw new Error(data.detail);
        } else {
          // DRF validation errors usually look like { "field_name": ["Error message"] }
          const errors = Object.values(data).flat().join(', ');
          throw new Error(errors || 'Failed to upload receipt');
        }
      }

      setSuccess('Receipt uploaded successfully! It is now pending admin review.');
      setStoreName('');
      setAmount('');
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="receipt-upload-container" style={{ padding: '2rem', maxWidth: '600px' }}>
      <div className="db-chart-card" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Upload a Receipt</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Turn your everyday spending into property credits! Upload your receipts here. They will be reviewed by our team and credits will be added to your account.
        </p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>Store Name</label>
            <input 
              type="text" 
              value={storeName} 
              onChange={(e) => setStoreName(e.target.value)} 
              placeholder="e.g., Reliance Smart"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>Amount Spent (₹)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="e.g., 2500"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>Receipt Image</label>
            <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                id="receipt-file"
              />
              <label htmlFor="receipt-file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <UploadCloud size={32} color="#818cf8" />
                <span style={{ color: '#818cf8', fontWeight: '500' }}>{file ? file.name : 'Click to upload receipt photo'}</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Uploading...' : 'Submit Receipt'}
          </button>
        </form>
      </div>
    </div>
  );
}
