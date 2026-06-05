import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, BedDouble, Bath, Square, Car, Check, ArrowLeft, ArrowRight, Building, Shield } from 'lucide-react';
import Footer from '../components/Footer';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/properties/${id}/`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setProperty(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching property details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '80vh' }}>
        <h2>Loading Property Details...</h2>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '80vh' }}>
        <h2>Property not found.</h2>
        <button onClick={() => navigate('/properties')} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Back to Properties</button>
      </div>
    );
  }

  const formatINR = (amount) => {
    const num = parseFloat(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const realPrice = parseFloat(property.price_in_inr);
  const discountCredit = realPrice * 0.025;
  const finalPrice = realPrice - discountCredit;

  const fallbackImg = property.title.includes('Skyline') ? '/property_skyline_residences.png' :
                      property.title.includes('Azure')   ? '/property_azure_villa.png' :
                      '/property_altura_penthouse.png';

  const mainImage = property.images?.[0]?.image || fallbackImg;

  const handleBookClick = () => {
    const token = localStorage.getItem('access_token');
    if (token) navigate('/dashboard');
    else navigate('/signin');
  };

  return (
    <>
      <main style={{ paddingTop: '80px', minHeight: '80vh', paddingBottom: '4rem' }}>
        <div className="container">
          
          <button onClick={() => navigate('/properties')} style={{ background: 'transparent', border: 'none', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', fontWeight: 500 }}>
            <ArrowLeft size={18} /> Back to Marketplace
          </button>

          {/* Hero Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ 
              width: '100%', 
              height: '50vh', 
              borderRadius: '24px', 
              backgroundImage: `url(${mainImage})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem 2rem 2rem',
                background: 'linear-gradient(to top, rgba(5,4,14,0.9), transparent)'
              }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span style={{
                    background: property.builder_tier === 'platinum' ? 'rgba(192, 132, 252, 0.9)' :
                                property.builder_tier === 'gold' ? 'rgba(250, 204, 21, 0.9)' : 'rgba(148, 163, 184, 0.9)',
                    color: property.builder_tier === 'platinum' ? '#fff' : '#000',
                    padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600
                  }}>
                    {property.builder_tier === 'platinum' ? 'Premium Listing' : property.builder_tier === 'gold' ? 'Featured' : 'Verified Builder'}
                  </span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.9)', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {property.status === 'available' ? 'Available' : 'Booked'}
                  </span>
                </div>
                <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{property.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '1.2rem' }}>
                  <MapPin size={20} /> {property.location}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            
            {/* Left Column: Details */}
            <div>
              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>About this Property</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1.1rem' }}>
                  {property.description || "An exceptional premium property offering unparalleled luxury and convenience. Located in one of the most sought-after neighborhoods, this residence features state-of-the-art amenities, breathtaking views, and meticulously crafted interiors designed for modern living. Perfect for those who seek the highest standards of comfort and elegance."}
                </p>
              </section>

              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#fff' }}>Key Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BedDouble size={24} color="#818cf8" />
                    <div><div style={{ color: '#fff', fontWeight: 600 }}>3 Bedrooms</div><div style={{ fontSize: '0.85rem', color: '#64748b' }}>Spacious & well-lit</div></div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bath size={24} color="#818cf8" />
                    <div><div style={{ color: '#fff', fontWeight: 600 }}>3 Bathrooms</div><div style={{ fontSize: '0.85rem', color: '#64748b' }}>Premium fittings</div></div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Square size={24} color="#818cf8" />
                    <div><div style={{ color: '#fff', fontWeight: 600 }}>2,450 Sq.Ft.</div><div style={{ fontSize: '0.85rem', color: '#64748b' }}>Carpet Area</div></div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Car size={24} color="#818cf8" />
                    <div><div style={{ color: '#fff', fontWeight: 600 }}>2 Parking</div><div style={{ fontSize: '0.85rem', color: '#64748b' }}>Covered spaces</div></div>
                  </div>
                </div>
              </section>

              <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#fff' }}>Premium Amenities</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {['Swimming Pool', 'State-of-the-art Gym', '24/7 Security & CCTV', 'Smart Home Integration', 'Clubhouse & Lounge', 'Landscaped Gardens', 'High-Speed Elevators', 'Power Backup'].map((amenity, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                      <Check size={18} color="#10b981" /> {amenity}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Pricing & Action */}
            <div>
              <div style={{ 
                background: 'rgba(13, 11, 35, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '20px', 
                padding: '2rem',
                position: 'sticky',
                top: '100px',
                backdropFilter: 'blur(20px)'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Financial Breakdown</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  <span style={{ color: '#94a3b8' }}>Real Price</span>
                  <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{formatINR(realPrice)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', color: '#c084fc' }}>
                  <span>FirstBuy Discount (2.5%)</span>
                  <span style={{ fontWeight: 600 }}>- {formatINR(discountCredit)}</span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>
                  <span>Final Price</span>
                  <span>{formatINR(finalPrice)}</span>
                </div>

                <button 
                  onClick={handleBookClick}
                  style={{
                    width: '100%',
                    background: 'var(--gradient-primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Book This Property <ArrowRight size={20} />
                </button>
                
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '1rem' }}>
                  No hidden charges. Transparent pricing.
                </p>

                <div style={{ marginTop: '2.5rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} color="#10b981" /> Builder Profile
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building size={24} color="#fff" />
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{property.builder_name || 'Verified Builder'}</div>
                      <div style={{ color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> {property.trust_score}% Trust Score
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
