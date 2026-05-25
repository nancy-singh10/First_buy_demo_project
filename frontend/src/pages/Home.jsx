import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Capabilities from '../components/Capabilities';
import RedeemSection from '../components/RedeemSection';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const setCurrentView = (view) => {
    if (view === 'dashboard') navigate('/dashboard');
    else if (view === 'landing') navigate('/');
    else if (view === 'contact') navigate('/contact');
  };
  const setActiveSection = () => {}; // Dummy for now

  return (
    <>
      <main>
        <Hero setCurrentView={setCurrentView} setActiveSection={setActiveSection} />
        <Stats />
        <Capabilities />
        <RedeemSection />
        <FAQ />
        <CTA setCurrentView={setCurrentView} />
      </main>
      <Footer />
    </>
  );
}
