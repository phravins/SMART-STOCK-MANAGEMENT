import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, BarChart3 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login - in real app, this would authenticate with backend
    toast({
      title: 'Login Successful!',
      description: 'Welcome to SmartStock AI Dashboard'
    });
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)', padding: '2rem' }}>
      <div className="product-card" style={{ maxWidth: '450px', width: '100%', background: 'white', padding: '2.5rem' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
          <BarChart3 size={32} color="var(--accent-text)" />
          <span style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--text-primary)' }}>SmartStock AI</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-2" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                placeholder="you@example.com"
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} />
              <span className="body-small">Remember me</span>
            </label>
            <a href="#" className="body-small" style={{ color: 'var(--accent-text)', textDecoration: 'none' }}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign In <LogIn size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-text)', textDecoration: 'none', fontWeight: 500 }}>
              Sign up for free
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

export default Login;