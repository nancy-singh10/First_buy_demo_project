import React from 'react';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <>
      <main style={{ paddingTop: '80px' }}>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
