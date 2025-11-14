import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { pricingPlans } from '../mockData';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div style={{ paddingTop: '5rem' }}>
      {/* Hero */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--bg-section)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="heading-1" style={{ marginBottom: '1rem' }}>Simple, Transparent Pricing</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Choose the plan that fits your business size. All plans include core features.
          </p>

          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span className="body-medium" style={{ color: isAnnual ? 'var(--text-muted)' : 'var(--text-primary)' }}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              style={{
                width: '56px',
                height: '32px',
                borderRadius: '9999px',
                background: isAnnual ? 'var(--gradient-button)' : 'var(--border-medium)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '4px',
                left: isAnnual ? '28px' : '4px',
                transition: 'left 0.2s ease'
              }}></div>
            </button>
            <span className="body-medium" style={{ color: isAnnual ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              Annual <span style={{ color: 'var(--accent-text)', fontWeight: 600 }}>(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
            {pricingPlans.map((plan, idx) => {
              const price = isAnnual ? Math.round(plan.price * 0.8) : plan.price;
              return (
                <div
                  key={idx}
                  className="product-card"
                  style={{
                    border: plan.popular ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    position: 'relative'
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--gradient-button)',
                      color: 'white',
                      padding: '4px 16px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      MOST POPULAR
                    </div>
                  )}

                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>{plan.name}</h3>
                    <p className="body-small" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>$</span>
                      <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{price}</span>
                      <span className="body-small" style={{ color: 'var(--text-muted)' }}>/month</span>
                    </div>
                    {isAnnual && (
                      <p className="body-small" style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Billed annually at ${price * 12}
                      </p>
                    )}
                  </div>

                  <Link
                    to="/login"
                    className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                    style={{ width: '100%', marginBottom: '1.5rem' }}
                  >
                    Get Started
                  </Link>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {plan.features.map((feature, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <Check size={18} color="var(--accent-text)" style={{ minWidth: '18px', marginTop: '2px' }} />
                        <span className="body-small">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'Is there a free trial?', a: 'Yes! All plans come with a 14-day free trial. No credit card required.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel anytime with no penalties. Your data is always exportable.' }
            ].map((item, idx) => (
              <div key={idx} className="product-card">
                <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>{item.q}</h3>
                <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;