import React from 'react';
import { Upload, Cpu, Bell, BarChart3, TrendingUp, Mail } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Add Your Products',
      description: 'Import your inventory with SKU, pricing, and stock thresholds. Supports bulk upload via CSV or manual entry.',
      details: ['Import from spreadsheet', 'Manual product entry', 'Set stock thresholds', 'Configure pricing']
    },
    {
      icon: BarChart3,
      title: 'Track in Real-Time',
      description: 'Monitor stock levels with automatic updates for incoming shipments and outgoing sales.',
      details: ['Live inventory sync', 'Multi-location tracking', 'Barcode integration', 'Mobile updates']
    },
    {
      icon: Cpu,
      title: 'AI Analyzes Data',
      description: 'ARIMA machine learning models process your historical sales data to identify patterns and trends.',
      details: ['Historical analysis', 'Pattern recognition', 'Seasonal adjustments', 'Trend identification']
    },
    {
      icon: TrendingUp,
      title: 'Get Predictions',
      description: 'Receive accurate sales forecasts for the next 7 to 365 days with confidence intervals.',
      details: ['Daily forecasts', 'Weekly summaries', 'Monthly projections', 'Confidence scores']
    },
    {
      icon: Bell,
      title: 'Receive Alerts',
      description: 'Automated notifications when stock falls below threshold or demand surge is predicted.',
      details: ['Low stock warnings', 'Demand surge alerts', 'Reorder reminders', 'Custom triggers']
    },
    {
      icon: Mail,
      title: 'Take Action',
      description: 'Use insights to make data-driven decisions about purchasing, pricing, and inventory allocation.',
      details: ['Automated reordering', 'Purchase planning', 'Price optimization', 'Stock redistribution']
    }
  ];

  return (
    <div style={{ paddingTop: '5rem' }}>
      {/* Hero */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--bg-section)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="heading-1" style={{ marginBottom: '1rem' }}>How SmartStock AI Works</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            From inventory input to actionable insights in 6 simple steps
          </p>
        </div>
      </section>

      {/* Process Flow */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} style={{ position: 'relative', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexDirection: isEven ? 'row' : 'row-reverse' }}>
                  {/* Icon */}
                  <div style={{ minWidth: '80px', height: '80px', borderRadius: '20px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <IconComponent size={36} color="var(--accent-text)" />
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-button)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                      {idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>{step.title}</h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {step.description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                      {step.details.map((detail, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                          <span className="body-small">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div style={{ position: 'absolute', left: isEven ? '40px' : 'auto', right: isEven ? 'auto' : '40px', top: '80px', width: '2px', height: '60px', background: 'var(--border-light)' }}></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Explanation */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '2rem' }}>Powered by ARIMA Machine Learning</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="product-card">
              <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>What is ARIMA?</h3>
              <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                AutoRegressive Integrated Moving Average is a statistical model that analyzes time series data to make predictions. It's perfect for sales forecasting because it accounts for trends, seasonality, and irregular patterns.
              </p>
            </div>

            <div className="product-card">
              <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>Why ARIMA?</h3>
              <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                Unlike simple trend analysis, ARIMA models understand complex patterns in your data. This means more accurate predictions, better inventory decisions, and reduced waste from overstocking or stockouts.
              </p>
            </div>

            <div className="product-card">
              <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>Continuous Learning</h3>
              <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                Our models automatically retrain as new sales data comes in, ensuring predictions stay accurate even as your business evolves and market conditions change.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;