import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ContactPage from './pages/ContactPage';
import PropertiesPage from './pages/PropertiesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import RewardsPage from './pages/RewardsPage';
import ReviewsPage from './pages/ReviewsPage';
import Dashboard from './components/Dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
