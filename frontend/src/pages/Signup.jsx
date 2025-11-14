import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Building, BarChart3 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }
    
    // Mock signup
    toast({
      title: 'Account Created!',
      description: 'Welcome to SmartStock AI. Redirecting to dashboard...'
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)', padding: '2rem' }}>
      <div className="product-card" style={{ maxWidth: '500px', width: '100%', background: 'white', padding: '2.5rem' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
          <BarChart3 size={32} color="var(--accent-text)" />
          <span style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--text-primary)' }}>SmartStock AI</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-2" style={{ marginBottom: '0.5rem' }}>Create Account</h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Start your 14-day free trial</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="name" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
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
          </div>

          <div>
            <label htmlFor="email" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
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
          </div>

          <div>
            <label htmlFor="company" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Company Name
            </label>
            <div style={{ position: 'relative' }}>
              <Building size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company Inc."
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
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
          </div>

          <div>
            <label htmlFor="password" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
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
          </div>

          <div>
            <label htmlFor="confirmPassword" className="body-medium" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
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
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Create Account <UserPlus size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-text)', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" className="body-small" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;