import React from 'react';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const setCurrentView = (view) => {
    if (view === 'dashboard') navigate('/dashboard');
    else if (view === 'landing') navigate('/');
    else if (view === 'contact') navigate('/contact');
  };

  return (
    <>
      <main style={{ paddingTop: '80px', minHeight: '80vh' }}>
        <HowItWorks setCurrentView={setCurrentView} />
      </main>
      <Footer />
    </>
  );
}
