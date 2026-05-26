import React, { useState, useRef, useEffect } from 'react';
import {
  Mail, Phone, MessageSquare, MapPin, Send, Check, X
} from 'lucide-react';
import '../styles/Contact.css';

export default function Contact() {
  /* ── Form state ── */
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', role: 'future-homeowner', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          subject: `Enquiry from ${form.role}`,
          message: form.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setForm({ firstName: '', lastName: '', email: '', role: 'future-homeowner', message: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  /* ── Chat widget state ── */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'agent', text: 'Hi there! 👋 I\'m Aria, your FirstBuy AI advisor. How can I help you today?' }
  ]);
  const messagesEndRef = useRef(null);

  const agentReplies = [
    'Great question! Our AI matches your credit balance to available properties in real time.',
    'You can start redeeming credits once you cross ₹1,00,000 — we\'ll notify you automatically!',
    'Builder trust scores are calculated from RERA data, buyer reviews, and construction timelines.',
    'Feel free to book a live call with our property advisor — zero pressure, 100% free.',
    'Happy to connect you with a relationship manager. Can I get your preferred city?'
  ];

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { from: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const reply = agentReplies[Math.floor(Math.random() * agentReplies.length)];
      setChatMessages(prev => [...prev, { from: 'agent', text: reply }]);
    }, 900);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const infoCards = [
    {
      icon: <Mail size={18} />,
      label: 'Email Us',
      value: 'hello@firstbuy.ai'
    },
    {
      icon: <Phone size={18} />,
      label: 'Talk to a Human',
      value: '+91 80-4500-1200'
    },
    {
      icon: <MessageSquare size={18} />,
      label: 'Live Chat',
      value: 'Mon–Sat · 9am–9pm IST'
    },
    {
      icon: <MapPin size={18} />,
      label: 'HQ',
      value: 'Indiranagar, Bengaluru, IN'
    }
  ];

  return (
    <>
      <section id="contact" className="contact-section">
        <div className="container">

          {/* Section Header */}
          <div className="section-tag-wrapper">
            <div className="badge">
              <span className="badge-dot blue"></span>
              Contact
            </div>
          </div>

          <div className="section-title-wrapper">
            <h2 className="section-title">
              We're here, whenever<br />
              <span className="text-gradient">home is on your mind.</span>
            </h2>
            <p className="section-subtitle">
              Reach out — a human responds within 4 hours during weekdays.
            </p>
          </div>

          <div className="contact-grid">

            {/* ── Left: Form ── */}
            <div className="contact-form-card glass-card">
              <h3 className="contact-form-title">Send us a note</h3>

              {error && (
                <div style={{ color: '#ef4444', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                  {error}
                </div>
              )}

              {submitted ? (
                <div className="form-success-toast">
                  <Check size={18} />
                  Message sent! We'll get back to you within 4 hours.
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-name-row">
                    <input
                      id="contact-first-name"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className="contact-input"
                    />
                    <input
                      id="contact-last-name"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={handleChange}
                      className="contact-input"
                    />
                  </div>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="contact-input"
                  />

                  <select
                    id="contact-role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="contact-select"
                  >
                    <option value="future-homeowner">I am a future homeowner</option>
                    <option value="investor">I am an investor</option>
                    <option value="builder">I represent a builder</option>
                    <option value="press">Press / Media enquiry</option>
                    <option value="other">Other</option>
                  </select>

                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="How can we help?"
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="contact-textarea"
                  />

                  <button type="submit" className="btn-send-message">
                    <Send size={16} /> Send message
                  </button>
                </form>
              )}
            </div>

            {/* ── Right: Info + Urgent Help ── */}
            <div className="contact-right-col">
              {infoCards.map((card, i) => (
                <div key={i} className="contact-info-card glass-card">
                  <div className="contact-info-icon">{card.icon}</div>
                  <div className="contact-info-body">
                    <span className="contact-info-label">{card.label}</span>
                    <span className="contact-info-value">{card.value}</span>
                  </div>
                </div>
              ))}

              <div className="contact-urgent-card">
                <span className="urgent-label">Need Urgent Help?</span>
                <button
                  id="contact-start-chat-btn"
                  className="btn-start-chat"
                  onClick={() => setChatOpen(true)}
                >
                  Start live support
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Floating Live-Chat Widget ── */}
      {chatOpen && (
        <div className="chat-widget">
          <div className="chat-widget-header">
            <div className="chat-agent-info">
              <div className="chat-agent-avatar">🤖</div>
              <div>
                <div className="chat-agent-name">Aria · FirstBuy AI</div>
                <div className="chat-agent-status">
                  <span className="online-dot"></span> Online now
                </div>
              </div>
            </div>
            <button
              id="chat-close-btn"
              className="chat-close-btn"
              onClick={() => setChatOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              id="chat-text-input"
              className="chat-input"
              placeholder="Type a message…"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button
              id="chat-send-btn"
              className="chat-send-btn"
              onClick={sendChatMessage}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
