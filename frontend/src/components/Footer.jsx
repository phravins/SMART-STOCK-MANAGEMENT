import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-section)', padding: '4rem 1.5rem 2rem', marginTop: '4rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <BarChart3 size={28} color="var(--accent-text)" />
              <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)' }}>SmartStock AI</span>
            </div>
            <p className="body-small" style={{ marginBottom: '1rem' }}>
              AI-powered inventory management and sales forecasting for modern businesses.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Mail size={16} color="var(--text-secondary)" />
              <span className="body-small">support@smartstock.ai</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/features" className="nav-link" style={{ padding: '4px 0', width: 'fit-content' }}>Features</Link>
              <Link to="/how-it-works" className="nav-link" style={{ padding: '4px 0', width: 'fit-content' }}>How It Works</Link>
              <Link to="/pricing" className="nav-link" style={{ padding: '4px 0', width: 'fit-content' }}>Pricing</Link>
              <Link to="/contact" className="nav-link" style={{ padding: '4px 0', width: 'fit-content' }}>Contact</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="#" className="nav-link" style={{ padding: '4px 0', width: 'fit-content' }}>Documentation</a>
              <a href="#" className="nav-link" style={{ padding: '4px 0', width: 'fit-content' }}>API Reference</a>
              <a href="#" className="nav-link" style={{ padding: '4px 0', width: 'fit-content' }}>Support Center</a>
              <a href="#" className="nav-link" style={{ padding: '4px 0', width: 'fit-content' }}>Privacy Policy</a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Phone size={16} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                <span className="body-small">+1 (555) 123-4567</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                <span className="body-small">123 Business Ave<br />San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', textAlign: 'center' }}>
          <p className="body-small">
            © 2025 SmartStock AI. All rights reserved. 
            {' '}
            <a
              href="https://vision2value.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ color: 'var(--accent-text)' }}
            >
              Built by V2V
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;