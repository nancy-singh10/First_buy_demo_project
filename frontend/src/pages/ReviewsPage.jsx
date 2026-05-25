import React from 'react';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function ReviewsPage() {
  const navigate = useNavigate();
  const setCurrentView = (view) => {
    if (view === 'dashboard') navigate('/dashboard');
    else if (view === 'landing') navigate('/');
    else if (view === 'contact') navigate('/contact');
  };

  return (
    <>
      <main style={{ paddingTop: '80px', minHeight: '80vh' }}>
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
