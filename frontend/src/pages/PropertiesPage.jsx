import React from 'react';
import MarketplacePreview from '../components/MarketplacePreview';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const setCurrentView = (view) => {
    if (view === 'dashboard') navigate('/dashboard');
    else if (view === 'landing') navigate('/');
    else if (view === 'contact') navigate('/contact');
  };

  return (
    <>
      <main style={{ paddingTop: '80px', minHeight: '80vh' }}>
        <MarketplacePreview setCurrentView={setCurrentView} />
      </main>
      <Footer />
    </>
  );
}
