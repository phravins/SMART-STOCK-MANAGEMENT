# API Contracts & Backend Integration Plan

## Current Mock Data (to be replaced)
- `/app/frontend/src/mockData.js` contains:
  - inventoryItems
  - salesData
  - alerts
  - dashboardStats
  - features (static, keep as is)
  - pricingPlans (static, keep as is)
  - techStack (static, keep as is)

## Backend Models

### 1. Product Model
```python
{
  "_id": ObjectId,
  "sku": str (unique),
  "name": str,
  "category": str,
  "current_stock": int,
  "threshold": int,
  "price": float,
  "last_updated": datetime,
  "status": str (in_stock, low_stock, critical)
}
```

### 2. Sales Model
```python
{
  "_id": ObjectId,
  "product_id": ObjectId,
  "sku": str,
  "quantity": int,
  "date": datetime,
  "amount": float
}
```

### 3. Alert Model
```python
{
  "_id": ObjectId,
  "type": str (low_stock, demand_surge),
  "product_id": ObjectId,
  "product_name": str,
  "message": str,
  "timestamp": datetime,
  "severity": str (critical, warning, info),
  "resolved": bool
}
```

### 4. Forecast Model
```python
{
  "_id": ObjectId,
  "product_id": ObjectId,
  "sku": str,
  "forecast_date": datetime,
  "predicted_sales": int,
  "confidence_lower": int,
  "confidence_upper": int,
  "created_at": datetime
}
```

## API Endpoints

### Product Management
- `GET /api/products` - Get all products with pagination
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Inventory Tracking
- `POST /api/inventory/stock-in` - Add incoming stock
- `POST /api/inventory/stock-out` - Record outgoing sales
- `GET /api/inventory/status` - Get current inventory status

### Sales & Forecasting
- `GET /api/sales/history` - Get historical sales data
- `POST /api/sales` - Record a sale
- `GET /api/forecast/{sku}` - Get ARIMA forecast for product
- `POST /api/forecast/generate` - Generate forecasts for all products

### Alerts
- `GET /api/alerts` - Get all active alerts
- `POST /api/alerts/check` - Manually trigger alert check
- `PUT /api/alerts/{id}/resolve` - Mark alert as resolved

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/chart-data` - Get sales vs forecast chart data

## Frontend Integration Steps

### 1. Dashboard.jsx
Replace mock data with:
- `GET /api/dashboard/stats` → dashboardStats
- `GET /api/dashboard/chart-data` → salesData
- `GET /api/alerts` → alerts
- `GET /api/products` → inventoryItems

### 2. Contact.jsx
- `POST /api/contact` → Send contact form (mock email)

### 3. Login.jsx & Signup.jsx
- Keep as frontend-only for MVP (mock authentication)
- Future: Add JWT authentication

## ARIMA Implementation

Using `statsmodels` library:
1. Collect historical sales data (min 30 days)
2. Train ARIMA model per product
3. Generate 7-90 day forecasts
4. Store predictions in database
5. Update forecasts daily

## Alert Generation Logic

### Low Stock Alert
- Trigger when: `current_stock < threshold`
- Severity: 
  - critical: stock < 50% of threshold
  - warning: stock < threshold

### Demand Surge Alert
- Compare forecast vs current stock
- Trigger when: `predicted_demand > current_stock * 0.8`
- Severity: info

## Mock Services (for MVP)

- **Email alerts**: Console log instead of actual email
- **WhatsApp alerts**: Console log instead of Twilio API
- Keep these simple for now, can be enhanced later

## Database Initialization

Seed database with sample data:
- 20+ products across categories
- 3 months of historical sales data
- Auto-generate alerts based on current stock levels
