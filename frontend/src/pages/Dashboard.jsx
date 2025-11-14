import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle, DollarSign, BarChart3, Plus, Download, X, Trash2, LineChart } from 'lucide-react';
import { getDashboardStats, getChartData, getAlerts, getProducts, createProduct, deleteProduct, getForecast } from '../services/api';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    total_products: 0,
    low_stock_items: 0,
    critical_items: 0,
    total_value: 0,
    monthly_sales: 0,
    forecasted_sales: 0,
    growth_rate: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: '',
    current_stock: 0,
    threshold: 0,
    price: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [stats, chart, alertsData, products] = await Promise.all([
        getDashboardStats(),
        getChartData(),
        getAlerts(),
        getProducts()
      ]);

      setDashboardStats(stats);
      setSalesData(chart);
      setAlerts(alertsData);
      setInventoryItems(products);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      toast({
        title: 'Product Added!',
        description: `${newProduct.name} has been added successfully.`
      });
      setShowAddModal(false);
      setNewProduct({
        sku: '',
        name: '',
        category: '',
        current_stock: 0,
        threshold: 0,
        price: 0
      });
      loadDashboardData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to add product',
        variant: 'destructive'
      });
    }
  };

  const handleExportReport = () => {
    // Create CSV content
    const headers = ['SKU', 'Product', 'Category', 'Stock', 'Threshold', 'Price', 'Status'];
    const rows = inventoryItems.map(item => [
      item.sku,
      item.name,
      item.category,
      item.current_stock,
      item.threshold,
      item.price,
      item.status
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Report Exported!',
      description: 'Inventory report has been downloaded as CSV.'
    });
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete ${productName}?`)) {
      return;
    }

    try {
      await deleteProduct(productId);
      toast({
        title: 'Product Deleted!',
        description: `${productName} has been removed from inventory.`
      });
      loadDashboardData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
    }
  };

  const handleViewForecast = async (product) => {
    setSelectedProduct(product);
    setShowForecastModal(true);
    
    try {
      const forecast = await getForecast(product.sku);
      setForecastData(forecast);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load forecast data',
        variant: 'destructive'
      });
      setForecastData([]);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-section)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <BarChart3 size={48} color="var(--accent-text)" style={{ animation: 'pulse 2s infinite' }} />
          <p className="body-medium" style={{ marginTop: '1rem' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'var(--accent-text)';
      case 'low_stock': return '#FF9500';
      case 'critical': return '#FF3B30';
      default: return 'var(--text-secondary)';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#FF3B30';
      case 'warning': return '#FF9500';
      case 'info': return '#007AFF';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-section)' }}>
      {/* Dashboard Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-light)', padding: '1.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="heading-2">Dashboard</h1>
              <p className="body-small" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Welcome back! Here's your inventory overview</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn-secondary" style={{ padding: '10px 20px' }} onClick={handleExportReport}>
                <Download size={18} /> Export Report
              </button>
              <button className="btn-primary" style={{ padding: '10px 20px' }} onClick={() => setShowAddModal(true)}>
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="product-card" style={{ background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Products</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{dashboardStats.total_products}</p>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={24} color="var(--accent-text)" />
              </div>
            </div>
          </div>

          <div className="product-card" style={{ background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Low Stock Items</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#FF9500' }}>{dashboardStats.low_stock_items}</p>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 149, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} color="#FF9500" />
              </div>
            </div>
          </div>

          <div className="product-card" style={{ background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Monthly Sales</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>${dashboardStats.monthly_sales.toLocaleString()}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <TrendingUp size={14} color="var(--accent-text)" />
                  <span className="body-small" style={{ color: 'var(--accent-text)' }}>+{dashboardStats.growth_rate}%</span>
                </div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} color="var(--accent-text)" />
              </div>
            </div>
          </div>

          <div className="product-card" style={{ background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Forecasted Sales</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-text)' }}>${dashboardStats.forecasted_sales.toLocaleString()}</p>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={24} color="var(--accent-text)" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Sales Forecast Chart */}
          <div className="product-card" style={{ background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="heading-3">Sales Forecast</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['7d', '30d', '90d'].map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '9999px',
                      background: selectedPeriod === period ? 'var(--accent-wash)' : 'transparent',
                      color: selectedPeriod === period ? 'var(--accent-text)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '1rem 0' }}>
              {salesData.slice(0, 10).map((data, idx) => {
                const maxValue = Math.max(...salesData.map(d => Math.max(d.sales || 0, d.forecast)));
                const salesHeight = data.sales ? (data.sales / maxValue) * 100 : 0;
                const forecastHeight = (data.forecast / maxValue) * 100;
                
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end', height: '160px' }}>
                      {data.sales && (
                        <div style={{ flex: 1, height: `${salesHeight}%`, background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0', minHeight: '4px' }} title={`Sales: $${data.sales}`}></div>
                      )}
                      <div style={{ flex: 1, height: `${forecastHeight}%`, background: data.sales ? 'rgba(148, 242, 127, 0.4)' : 'var(--accent-primary)', borderRadius: '4px 4px 0 0', minHeight: '4px', border: data.sales ? '2px dashed var(--accent-primary)' : 'none' }} title={`Forecast: $${data.forecast}`}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{data.month}</span>
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
                <span className="body-small">Actual Sales</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: 'rgba(148, 242, 127, 0.4)', border: '2px dashed var(--accent-primary)', borderRadius: '2px' }}></div>
                <span className="body-small">AI Forecast</span>
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="product-card" style={{ background: 'white' }}>
            <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Recent Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-section)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${getSeverityColor(alert.severity)}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px' }}>
                      <AlertTriangle size={16} color={getSeverityColor(alert.severity)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{alert.product}</span>
                        <span className="body-small" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="body-small" style={{ color: 'var(--text-secondary)', margin: 0 }}>{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="product-card" style={{ background: 'white' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Current Inventory</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>SKU</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Product</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.sku}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.category}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {item.currentStock} / {item.threshold}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-primary)' }}>${item.price}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: `${getStatusColor(item.status)}15`,
                        color: getStatusColor(item.status)
                      }}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleViewForecast(item)}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid var(--border-light)',
                            borderRadius: '6px',
                            background: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-section)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <LineChart size={14} color="var(--accent-text)" />
                          Forecast
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id, item.name)}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #FF3B30',
                            borderRadius: '6px',
                            background: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#FF3B30';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'inherit';
                          }}
                        >
                          <Trash2 size={14} color="#FF3B30" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Forecast Modal with Statistical Graphs */}
      {showForecastModal && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setShowForecastModal(false)}>
          <div className="product-card" style={{
            background: 'white',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="heading-3">{selectedProduct.name} - ARIMA Forecast</h3>
                <p className="body-small" style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  SKU: {selectedProduct.sku} | 30-Day Prediction
                </p>
              </div>
              <button onClick={() => setShowForecastModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--text-muted)" />
              </button>
            </div>

            {forecastData.length > 0 ? (
              <>
                {/* Statistics Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-section)', borderRadius: '8px' }}>
                    <p className="body-small" style={{ color: 'var(--text-muted)' }}>Avg Daily Forecast</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {(forecastData.reduce((sum, f) => sum + f.predicted_sales, 0) / forecastData.length).toFixed(1)}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-section)', borderRadius: '8px' }}>
                    <p className="body-small" style={{ color: 'var(--text-muted)' }}>Total 30-Day</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-text)' }}>
                      {forecastData.reduce((sum, f) => sum + f.predicted_sales, 0).toFixed(0)}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-section)', borderRadius: '8px' }}>
                    <p className="body-small" style={{ color: 'var(--text-muted)' }}>Peak Day</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {Math.max(...forecastData.map(f => f.predicted_sales)).toFixed(1)}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-section)', borderRadius: '8px' }}>
                    <p className="body-small" style={{ color: 'var(--text-muted)' }}>Current Stock</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: getStatusColor(selectedProduct.status) }}>
                      {selectedProduct.current_stock}
                    </p>
                  </div>
                </div>

                {/* Forecast Line Chart */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Predicted Sales Trend</h4>
                  <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '1rem 0' }}>
                    {forecastData.slice(0, 30).map((forecast, idx) => {
                      const maxValue = Math.max(...forecastData.slice(0, 30).map(f => f.predicted_sales));
                      const height = (forecast.predicted_sales / maxValue) * 100;
                      const date = new Date(forecast.forecast_date);
                      
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div
                            style={{
                              width: '100%',
                              height: `${height}%`,
                              background: 'linear-gradient(to top, var(--accent-primary), var(--accent-strong))',
                              borderRadius: '3px 3px 0 0',
                              minHeight: '4px',
                              position: 'relative',
                              cursor: 'pointer'
                            }}
                            title={`Day ${idx + 1}: ${forecast.predicted_sales.toFixed(1)} units\nDate: ${date.toLocaleDateString()}`}
                          >
                            {idx % 5 === 0 && (
                              <span style={{
                                position: 'absolute',
                                bottom: '-20px',
                                fontSize: '0.65rem',
                                color: 'var(--text-muted)',
                                transform: 'translateX(-50%)',
                                left: '50%',
                                whiteSpace: 'nowrap'
                              }}>
                                Day {idx + 1}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Confidence Interval Chart */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Confidence Interval (7-Day View)</h4>
                  <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '1rem' }}>
                    {forecastData.slice(0, 7).map((forecast, idx) => {
                      const maxValue = Math.max(...forecastData.slice(0, 7).map(f => f.confidence_upper || f.predicted_sales * 1.3));
                      const predictedHeight = (forecast.predicted_sales / maxValue) * 100;
                      const upperHeight = ((forecast.confidence_upper || forecast.predicted_sales * 1.3) / maxValue) * 100;
                      const lowerHeight = ((forecast.confidence_lower || forecast.predicted_sales * 0.7) / maxValue) * 100;
                      
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '100%' }}>
                          {/* Confidence band */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            height: `${upperHeight}%`,
                            background: 'rgba(143, 236, 120, 0.2)',
                            borderRadius: '4px'
                          }} />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            height: `${lowerHeight}%`,
                            background: 'rgba(143, 236, 120, 0.2)',
                            borderRadius: '4px'
                          }} />
                          {/* Predicted value */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '80%',
                            height: `${predictedHeight}%`,
                            background: 'var(--gradient-button)',
                            borderRadius: '4px',
                            zIndex: 2
                          }} />
                          <span style={{
                            position: 'absolute',
                            bottom: '-25px',
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)'
                          }}>
                            Day {idx + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '16px', height: '16px', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
                      <span className="body-small">Predicted</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '16px', height: '16px', background: 'rgba(143, 236, 120, 0.3)', borderRadius: '2px' }}></div>
                      <span className="body-small">Confidence Range</span>
                    </div>
                  </div>
                </div>

                {/* Forecast Table */}
                <div>
                  <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Detailed Forecast (Next 7 Days)</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Predicted Sales</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Lower Bound</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>Upper Bound</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecastData.slice(0, 7).map((forecast, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '8px' }}>
                              {new Date(forecast.forecast_date).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: 'var(--accent-text)' }}>
                              {forecast.predicted_sales.toFixed(2)}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                              {(forecast.confidence_lower || forecast.predicted_sales * 0.7).toFixed(2)}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                              {(forecast.confidence_upper || forecast.predicted_sales * 1.3).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <BarChart3 size={48} color="var(--text-muted)" style={{ margin: '0 auto' }} />
                <p className="body-medium" style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                  Loading forecast data...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setShowAddModal(false)}>
          <div className="product-card" style={{ 
            background: 'white', 
            maxWidth: '500px', 
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="heading-3">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--text-muted)" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>SKU *</label>
                <input
                  type="text"
                  required
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="PROD-016"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Product Name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category *</label>
                <select
                  required
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Storage">Storage</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Current Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.current_stock}
                    onChange={(e) => setNewProduct({ ...newProduct, current_stock: parseInt(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Threshold *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.threshold}
                    onChange={(e) => setNewProduct({ ...newProduct, threshold: parseInt(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Price ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  <Plus size={18} /> Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;