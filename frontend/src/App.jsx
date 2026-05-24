import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import MarketplacePreview from './components/MarketplacePreview';
import RedeemSection from './components/RedeemSection';
import RewardsTiers from './components/RewardsTiers';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [activeSection, setActiveSection] = useState('home');

  // Track scroll position to update active header nav highlight automatically
  useEffect(() => {
    if (currentView !== 'landing') return;

    const sections = ['home', 'properties', 'how-it-works', 'rewards', 'reviews', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // offset for sticky header

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  return (
    <>
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {currentView === 'landing' ? (
        <main>
          <Hero setCurrentView={setCurrentView} setActiveSection={setActiveSection} />
          <Stats />
          <HowItWorks setCurrentView={setCurrentView} />
          <MarketplacePreview setCurrentView={setCurrentView} />
          <RedeemSection />
          <RewardsTiers />
          <Reviews />
          <Contact />
        </main>
      ) : (
        <Dashboard setCurrentView={setCurrentView} setActiveSection={setActiveSection} />
      )}

      <Footer setCurrentView={setCurrentView} setActiveSection={setActiveSection} />
    </>
  );
}
