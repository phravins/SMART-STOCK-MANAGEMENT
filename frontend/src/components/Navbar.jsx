import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart3 size={24} color="var(--accent-text)" />
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.125rem' }}>
          SmartStock AI
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="nav-link"
            style={{
              color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-muted)',
              background: isActive(link.path) ? 'rgba(0, 0, 0, 0.05)' : 'transparent'
            }}
          >
            {link.name}
          </Link>
        ))}
        <Link to="/login" className="btn-primary" style={{ marginLeft: '8px', fontSize: '0.9rem', padding: '10px 20px' }}>
          Dashboard
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {isOpen ? <X size={24} color="var(--text-primary)" /> : <Menu size={24} color="var(--text-primary)" />}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '4.5rem',
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-light)',
            zIndex: 40
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="nav-link"
              onClick={() => setIsOpen(false)}
              style={{
                color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-muted)',
                background: isActive(link.path) ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                textAlign: 'center'
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" className="btn-primary" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;