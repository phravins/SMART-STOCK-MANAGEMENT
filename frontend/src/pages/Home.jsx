import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Bell, BarChart3, Shield, Package, Zap } from 'lucide-react';
import { features, techStack } from '../mockData';

const iconMap = {
  ShieldCheck: Shield,
  Package: Package,
  Activity: Zap,
  TrendingUp: TrendingUp,
  Bell: Bell,
  BarChart3: BarChart3
};

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered Inventory Management That Predicts Tomorrow
          </h1>
          <p className="hero-subtitle">
            Smart inventory tracking with ARIMA-based sales forecasting. Prevent stockouts, optimize purchasing, and grow your business with data-driven insights.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link to="/login" className="btn-primary">
              Try Demo Dashboard <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Request Live Demo
            </Link>
          </div>

          {/* Stats */}
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', maxWidth: '600px', margin: '4rem auto 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-text)' }}>99.5%</div>
              <div className="body-small">Forecast Accuracy</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-text)' }}>50%</div>
              <div className="body-small">Cost Reduction</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-text)' }}>24/7</div>
              <div className="body-small">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Powerful Features for Modern Businesses</h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to manage inventory and predict demand
            </p>
          </div>

          <div className="ai-grid">
            {features.map((feature, idx) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <div key={idx} className="product-card">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <IconComponent size={24} color="var(--accent-text)" />
                  </div>
                  <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>{feature.title}</h3>
                  <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/features" className="btn-primary">
              Explore All Features <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="heading-2" style={{ marginBottom: '1rem' }}>From Data to Decision in 3 Steps</h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Our AI engine works behind the scenes
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            {[
              { step: '01', title: 'Track Inventory', desc: 'Real-time monitoring of stock levels with incoming and outgoing updates' },
              { step: '02', title: 'AI Analysis', desc: 'ARIMA models analyze historical data to predict future demand patterns' },
              { step: '03', title: 'Smart Alerts', desc: 'Automated notifications via Email & WhatsApp when action is needed' }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '1rem', opacity: 0.3 }}>{item.step}</div>
                <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>{item.title}</h3>
                <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Built with Industry-Leading Technology</h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              Powered by modern tools and frameworks
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
            {techStack.map((tech, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <img src={tech.logo} alt={tech.name} style={{ width: '60px', height: '60px', marginBottom: '0.5rem' }} />
                <p className="body-small">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Ready to Transform Your Inventory?</h2>
          <p className="body-large" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Join hundreds of businesses using AI to optimize their inventory management
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary">
              Get Started Free
            </Link>
            <Link to="/pricing" className="btn-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;