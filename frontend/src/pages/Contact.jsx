import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { submitContactForm } from '../services/api';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await submitContactForm(formData);
      toast({
        title: 'Message Sent!',
        description: 'We\'ll get back to you within 24 hours.'
      });
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '5rem' }}>
      {/* Hero */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--bg-section)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="heading-1" style={{ marginBottom: '1rem' }}>Get in Touch</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {/* Contact Info */}
            <div>
              <h2 className="heading-3" style={{ marginBottom: '1.5rem' }}>Contact Information</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="product-card">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Mail size={24} color="var(--accent-text)" />
                  </div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Email</h4>
                  <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>support@smartstock.ai</p>
                </div>

                <div className="product-card">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Phone size={24} color="var(--accent-text)" />
                  </div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Phone</h4>
                  <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>+1 (555) 123-4567</p>
                </div>

                <div className="product-card">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <MessageSquare size={24} color="var(--accent-text)" />
                  </div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>WhatsApp Support</h4>
                  <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>+1 (555) 987-6543</p>
                </div>

                <div className="product-card">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <MapPin size={24} color="var(--accent-text)" />
                  </div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Office</h4>
                  <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                    123 Business Avenue<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="heading-3" style={{ marginBottom: '1.5rem' }}>Send us a Message</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="name" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'system-ui, sans-serif',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'system-ui, sans-serif',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'system-ui, sans-serif',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'system-ui, sans-serif',
                      resize: 'vertical',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'} <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;