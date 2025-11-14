// Mock data for inventory management system

export const inventoryItems = [
  {
    id: 1,
    sku: 'PROD-001',
    name: 'Wireless Mouse',
    category: 'Electronics',
    currentStock: 45,
    threshold: 20,
    price: 29.99,
    lastUpdated: '2025-08-15T10:30:00Z',
    status: 'in_stock'
  },
  {
    id: 2,
    sku: 'PROD-002',
    name: 'USB-C Cable',
    category: 'Accessories',
    currentStock: 12,
    threshold: 15,
    price: 12.99,
    lastUpdated: '2025-08-15T09:15:00Z',
    status: 'low_stock'
  },
  {
    id: 3,
    sku: 'PROD-003',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    currentStock: 67,
    threshold: 25,
    price: 89.99,
    lastUpdated: '2025-08-15T11:00:00Z',
    status: 'in_stock'
  },
  {
    id: 4,
    sku: 'PROD-004',
    name: 'Laptop Stand',
    category: 'Accessories',
    currentStock: 5,
    threshold: 10,
    price: 39.99,
    lastUpdated: '2025-08-15T08:45:00Z',
    status: 'critical'
  },
  {
    id: 5,
    sku: 'PROD-005',
    name: 'Webcam HD',
    category: 'Electronics',
    currentStock: 89,
    threshold: 30,
    price: 59.99,
    lastUpdated: '2025-08-15T10:00:00Z',
    status: 'in_stock'
  },
  {
    id: 6,
    sku: 'PROD-006',
    name: 'Monitor 24"',
    category: 'Electronics',
    currentStock: 15,
    threshold: 18,
    price: 199.99,
    lastUpdated: '2025-08-15T09:30:00Z',
    status: 'low_stock'
  }
];

export const salesData = [
  { month: 'Jan', sales: 4200, forecast: 4100 },
  { month: 'Feb', sales: 3800, forecast: 3900 },
  { month: 'Mar', sales: 5100, forecast: 5000 },
  { month: 'Apr', sales: 4600, forecast: 4700 },
  { month: 'May', sales: 5800, forecast: 5700 },
  { month: 'Jun', sales: 6200, forecast: 6100 },
  { month: 'Jul', sales: 5900, forecast: 6000 },
  { month: 'Aug', sales: null, forecast: 6400 },
  { month: 'Sep', sales: null, forecast: 6800 },
  { month: 'Oct', sales: null, forecast: 7200 }
];

export const alerts = [
  {
    id: 1,
    type: 'low_stock',
    product: 'Laptop Stand',
    message: 'Stock level critical: Only 5 units remaining',
    timestamp: '2025-08-15T08:45:00Z',
    severity: 'critical'
  },
  {
    id: 2,
    type: 'low_stock',
    product: 'USB-C Cable',
    message: 'Stock below threshold: 12 units remaining',
    timestamp: '2025-08-15T09:15:00Z',
    severity: 'warning'
  },
  {
    id: 3,
    type: 'demand_surge',
    product: 'Wireless Mouse',
    message: 'Predicted demand surge in next 7 days: +35%',
    timestamp: '2025-08-15T10:30:00Z',
    severity: 'info'
  },
  {
    id: 4,
    type: 'low_stock',
    product: 'Monitor 24"',
    message: 'Stock approaching threshold: 15 units remaining',
    timestamp: '2025-08-15T09:30:00Z',
    severity: 'warning'
  }
];

export const dashboardStats = {
  totalProducts: 156,
  lowStockItems: 8,
  criticalItems: 2,
  totalValue: 234567.89,
  monthlySales: 5900,
  forecastedSales: 6400,
  growthRate: 8.5
};

export const features = [
  {
    icon: 'ShieldCheck',
    title: 'Secure User Login',
    description: 'Role-based access control with encrypted authentication for admins and staff members'
  },
  {
    icon: 'Package',
    title: 'Product Management',
    description: 'Easily add, update, and delete products with SKU tracking, pricing, and stock thresholds'
  },
  {
    icon: 'Activity',
    title: 'Real-Time Tracking',
    description: 'Monitor inventory levels with instant updates for incoming stock and outgoing sales'
  },
  {
    icon: 'TrendingUp',
    title: 'AI Sales Forecasting',
    description: 'ARIMA-powered predictions for future demand based on historical sales data'
  },
  {
    icon: 'Bell',
    title: 'Smart Alerts',
    description: 'Automated notifications via Email & WhatsApp when stock levels fall below threshold'
  },
  {
    icon: 'BarChart3',
    title: 'Analytics Dashboard',
    description: 'Interactive charts, graphs, and downloadable reports for data-driven decisions'
  }
];

export const pricingPlans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for small businesses',
    features: [
      'Up to 50 products',
      'Basic inventory tracking',
      'Email alerts',
      '30-day sales forecast',
      'Standard support'
    ]
  },
  {
    name: 'Pro',
    price: 79,
    description: 'For growing businesses',
    features: [
      'Up to 500 products',
      'Real-time tracking',
      'Email & WhatsApp alerts',
      '90-day AI forecasting',
      'Advanced analytics',
      'Priority support',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For large organizations',
    features: [
      'Unlimited products',
      'Multi-location support',
      'Custom integrations',
      '365-day forecasting',
      'White-label solution',
      'Dedicated support',
      'Custom reporting'
    ]
  }
];

export const techStack = [
  { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Flask', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
  { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'TailwindCSS', logo: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg' },
  { name: 'Scikit-learn', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg' }
];