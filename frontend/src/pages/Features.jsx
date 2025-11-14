import React from 'react';
import { Shield, Package, Zap, TrendingUp, Bell, BarChart3, Database, Clock, Users, FileText, Mail, MessageSquare } from 'lucide-react';

const Features = () => {
  const featuresList = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with role-based access control. Separate permissions for admins and staff members.',
      features: ['Two-factor authentication', 'Encrypted data storage', 'Activity logging', 'Session management']
    },
    {
      icon: Package,
      title: 'Complete Product Management',
      description: 'Comprehensive product catalog with detailed tracking and organization capabilities.',
      features: ['SKU management', 'Pricing control', 'Category organization', 'Bulk import/export']
    },
    {
      icon: Zap,
      title: 'Real-Time Inventory Sync',
      description: 'Instant updates across all devices with seamless synchronization and live data streams.',
      features: ['Live stock updates', 'Multi-location support', 'Barcode scanning', 'Mobile app sync']
    },
    {
      icon: TrendingUp,
      title: 'AI Sales Forecasting',
      description: 'Advanced ARIMA models predict future demand with high accuracy based on historical patterns.',
      features: ['7-365 day predictions', 'Seasonal analysis', 'Trend detection', 'Confidence intervals']
    },
    {
      icon: Bell,
      title: 'Smart Alert System',
      description: 'Proactive notifications keep you informed about critical inventory events and changes.',
      features: ['Email notifications', 'WhatsApp alerts', 'Custom thresholds', 'Alert history']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboard with interactive visualizations and detailed reporting.',
      features: ['Custom reports', 'Export to PDF/CSV', 'Visual charts', 'KPI tracking']
    },
    {
      icon: Database,
      title: 'Reliable Data Storage',
      description: 'Secure PostgreSQL/MySQL database with automatic backups and data redundancy.',
      features: ['Daily backups', 'Data encryption', 'Disaster recovery', 'Audit trails']
    },
    {
      icon: Clock,
      title: 'Automated Operations',
      description: 'Set it and forget it with automated reordering, reporting, and workflow management.',
      features: ['Auto-reorder points', 'Scheduled reports', 'Workflow automation', 'Integration APIs']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team with shared access and collaborative features.',
      features: ['Multi-user support', 'Role permissions', 'Activity feeds', 'Team messaging']
    },
    {
      icon: FileText,
      title: 'Comprehensive Reports',
      description: 'Generate detailed reports for inventory, sales, forecasts, and business insights.',
      features: ['Custom templates', 'Scheduled delivery', 'Data visualization', 'Export options']
    },
    {
      icon: Mail,
      title: 'Email Integration',
      description: 'Stay connected with Gmail SMTP integration for all notification needs.',
      features: ['Instant alerts', 'Report delivery', 'Team updates', 'Custom templates']
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Notifications',
      description: 'Receive critical updates directly on WhatsApp via Twilio Cloud API integration.',
      features: ['Real-time messages', 'Stock alerts', 'Forecast updates', 'Custom notifications']
    }
  ];

  return (
    <div style={{ paddingTop: '5rem' }}>
      {/* Hero */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--bg-section)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="heading-1" style={{ marginBottom: '1rem' }}>Complete Feature Set</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Everything you need to manage inventory, forecast sales, and grow your business
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {featuresList.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div key={idx} className="product-card">
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <IconComponent size={28} color="var(--accent-text)" />
                  </div>
                  <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>{feature.title}</h3>
                  <p className="body-medium" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    {feature.description}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {feature.features.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                        <span className="body-small">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;