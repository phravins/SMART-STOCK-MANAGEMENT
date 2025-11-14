import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Products
export const getProducts = async () => {
  const response = await axios.get(`${API}/products`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await axios.post(`${API}/products`, product);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await axios.delete(`${API}/products/${productId}`);
  return response.data;
};

export const getForecast = async (sku) => {
  const response = await axios.get(`${API}/forecast/${sku}`);
  return response.data;
};

// Dashboard
export const getDashboardStats = async () => {
  const response = await axios.get(`${API}/dashboard/stats`);
  return response.data;
};

export const getChartData = async () => {
  const response = await axios.get(`${API}/dashboard/chart-data`);
  return response.data;
};

// Alerts
export const getAlerts = async () => {
  const response = await axios.get(`${API}/alerts`);
  return response.data;
};

// Sales
export const getSalesHistory = async () => {
  const response = await axios.get(`${API}/sales/history?limit=50`);
  return response.data;
};

// Inventory Operations
export const stockIn = async (sku, quantity) => {
  const response = await axios.post(`${API}/inventory/stock-in`, { sku, quantity });
  return response.data;
};

export const stockOut = async (sku, quantity) => {
  const response = await axios.post(`${API}/inventory/stock-out`, { sku, quantity });
  return response.data;
};

// Contact
export const submitContactForm = async (formData) => {
  const response = await axios.post(`${API}/contact`, formData);
  return response.data;
};
