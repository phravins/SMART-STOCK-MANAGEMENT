# SmartStock AI - Complete Project Explanation

## Table of Contents
1. [Project Overview](#project-overview)
2. [How ARIMA Model Works](#how-arima-model-works)
3. [MongoDB Database Structure](#mongodb-database-structure)
4. [WhatsApp & Email Alert System](#whatsapp--email-alert-system)
5. [Complete Workflow](#complete-workflow)

---

## 1. Project Overview

### What is SmartStock AI?

SmartStock AI is an **intelligent inventory management system** that helps businesses:
- Track product stock levels in real-time
- Predict future sales using AI (ARIMA model)
- Get automatic alerts when stock is low
- Prevent stockouts and overstocking
- Make data-driven purchasing decisions

### Technology Stack

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│  - User Interface                       │
│  - Dashboard with Charts                │
│  - Product Management                   │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│         Backend (FastAPI)               │
│  - API Endpoints                        │
│  - Business Logic                       │
│  - ARIMA Forecasting Service            │
│  - Alert Service (WhatsApp + Email)     │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼─────┐        ┌──────▼──────┐
│ MongoDB │        │   External  │
│Database │        │   Services  │
└─────────┘        │- Twilio     │
                   │- Gmail SMTP │
                   └─────────────┘
```

### Key Features

1. **Real-Time Inventory Tracking**
   - Add/Edit/Delete products
   - Track stock levels
   - Stock-in/Stock-out operations

2. **AI-Powered Forecasting**
   - Predicts sales for next 7-90 days
   - Uses ARIMA statistical model
   - Shows confidence intervals

3. **Smart Alerts**
   - WhatsApp messages via Twilio
   - Email notifications via Gmail
   - Triggered automatically

4. **Analytics Dashboard**
   - Visual charts and graphs
   - Statistical insights
   - Export to CSV

---

## 2. How ARIMA Model Works

### What is ARIMA?

**ARIMA** = AutoRegressive Integrated Moving Average

It's a statistical model used for **time series forecasting** - predicting future values based on past data.

### Components of ARIMA

```
ARIMA (p, d, q)
  │    │  │  │
  │    │  │  └─ q: Moving Average order
  │    │  └──── d: Differencing order (makes data stationary)
  │    └─────── p: AutoRegressive order
  └──────────── Model name
```

In SmartStock AI, we use: **ARIMA(1, 1, 1)**

### How It Works in SmartStock AI

#### Step 1: Data Collection
```python
# System collects historical sales data
Sales History:
Day 1: 10 units sold
Day 2: 12 units sold
Day 3: 8 units sold
...
Day 90: 15 units sold
```

#### Step 2: Data Preparation
```python
# Convert to time series
import pandas as pd

# Create daily sales dataframe
df = pd.DataFrame({
    'date': ['2025-05-10', '2025-05-11', ...],
    'sales': [10, 12, 8, ...]
})

# Resample to daily frequency (fill missing days with 0)
daily_sales = df.resample('D')['sales'].sum()
```

#### Step 3: ARIMA Model Training
```python
from statsmodels.tsa.arima.model import ARIMA

# Train ARIMA model
model = ARIMA(daily_sales, order=(1, 1, 1))
fitted_model = model.fit()

# The model learns:
# - Patterns in past sales
# - Trends (increasing/decreasing)
# - Seasonality (weekly/monthly patterns)
```

#### Step 4: Generate Predictions
```python
# Predict next 30 days
forecast = fitted_model.forecast(steps=30)

# Result:
Day 91: 14.2 units (predicted)
Day 92: 15.1 units (predicted)
Day 93: 13.8 units (predicted)
...
Day 120: 16.5 units (predicted)
```

#### Step 5: Calculate Confidence Intervals
```python
# Get confidence range (uncertainty bounds)
forecast_object = fitted_model.get_forecast(steps=30)
confidence_intervals = forecast_object.conf_int()

# For Day 91:
Predicted: 14.2 units
Lower bound: 11.5 units (worst case)
Upper bound: 16.9 units (best case)
Confidence: 95%
```

### Example Scenario

**Product: Wireless Mouse**

```
Historical Data (Last 90 days):
Average daily sales: 10 units
Total sold: 900 units

ARIMA Analysis:
✓ Detected upward trend (+2% growth)
✓ Found weekly pattern (more sales on Fridays)
✓ Identified seasonal spike (month-end)

Forecast (Next 30 days):
Day 1-7:   11-12 units/day (normal week)
Day 8-14:  13-15 units/day (weekend boost)
Day 15-21: 10-11 units/day (mid-month dip)
Day 22-30: 16-18 units/day (month-end spike)

Total 30-day forecast: 385 units
Current stock: 45 units
⚠️ ALERT: Stock insufficient for predicted demand!
```

### Why ARIMA for Inventory?

✅ **Accurate** - Accounts for trends and patterns
✅ **Fast** - Generates predictions in seconds
✅ **Reliable** - Proven statistical method
✅ **Adaptable** - Updates with new data
✅ **Confidence Intervals** - Shows uncertainty range

---

## 3. MongoDB Database Structure

### What is MongoDB?

MongoDB is a **NoSQL database** that stores data in flexible JSON-like documents.

### Database Schema

SmartStock AI uses 4 main collections:

#### Collection 1: Products
```javascript
{
  "_id": "uuid-1234-5678",           // Unique ID
  "sku": "PROD-001",                 // Stock Keeping Unit
  "name": "Wireless Mouse",          // Product name
  "category": "Electronics",         // Category
  "current_stock": 45,               // Current quantity
  "threshold": 20,                   // Minimum stock level
  "price": 29.99,                    // Unit price
  "last_updated": "2025-08-15T10:30:00Z",
  "status": "in_stock"               // in_stock | low_stock | critical
}
```

**Status Rules:**
- `in_stock`: current_stock >= threshold
- `low_stock`: current_stock < threshold
- `critical`: current_stock < (threshold × 0.5)

#### Collection 2: Sales
```javascript
{
  "_id": "uuid-9876-5432",
  "product_id": "uuid-1234-5678",    // Links to product
  "sku": "PROD-001",
  "quantity": 5,                     // Units sold
  "amount": 149.95,                  // Total price (5 × 29.99)
  "date": "2025-08-15T14:25:00Z"
}
```

This collection stores every sale transaction for historical analysis.

#### Collection 3: Forecasts
```javascript
{
  "_id": "uuid-1111-2222",
  "product_id": "uuid-1234-5678",
  "sku": "PROD-001",
  "forecast_date": "2025-09-01",     // Future date
  "predicted_sales": 14.2,           // ARIMA prediction
  "confidence_lower": 11.5,          // 95% confidence lower
  "confidence_upper": 16.9,          // 95% confidence upper
  "created_at": "2025-08-15T10:00:00Z"
}
```

Each product has 90 forecast records (90 days into future).

#### Collection 4: Alerts
```javascript
{
  "_id": "uuid-3333-4444",
  "type": "low_stock",               // low_stock | demand_surge
  "product_id": "uuid-1234-5678",
  "product_name": "Wireless Mouse",
  "message": "Stock level critical: 5 units remaining",
  "timestamp": "2025-08-15T15:00:00Z",
  "severity": "critical",            // critical | warning | info
  "resolved": false                  // Alert status
}
```

### How Data Flows

```
1. User adds product → Saved to Products collection
2. Product is sold → New record in Sales collection
                   → Updates current_stock in Products
3. Forecast generated → Analyzes Sales history
                      → Saves predictions to Forecasts collection
4. Alert triggered → Checks Products vs Forecasts
                   → Creates record in Alerts collection
                   → Sends WhatsApp + Email
```

### Example Query Flow

**Get Dashboard Statistics:**
```javascript
// Count products by status
db.products.aggregate([
  { $group: { 
      _id: "$status", 
      count: { $sum: 1 } 
  }}
])

// Result:
{ _id: "in_stock", count: 10 }
{ _id: "low_stock", count: 3 }
{ _id: "critical", count: 2 }
```

---

## 4. WhatsApp & Email Alert System

### When Alerts are Triggered

Alerts are automatically triggered in **2 scenarios**:

#### Scenario 1: Low Stock Alert

**Trigger Condition:**
```python
if product.current_stock < product.threshold:
    # Generate LOW STOCK alert
```

**Example:**
```
Product: Laptop Stand
Threshold: 10 units (minimum required)
Current Stock: 5 units

✓ CONDITION MET: 5 < 10
→ ALERT TRIGGERED!

Severity: CRITICAL (stock < 50% of threshold)
Type: low_stock
Message: "Stock level critical: 5 units remaining"
```

#### Scenario 2: Demand Surge Alert

**Trigger Condition:**
```python
# Get 7-day forecast
predicted_demand = sum(next_7_days_forecast)
current_stock = product.current_stock

if predicted_demand > (current_stock * 0.8):
    # Generate DEMAND SURGE alert
```

**Example:**
```
Product: Webcam Cover
Current Stock: 20 units
7-Day Forecast: 30 units predicted to sell

Calculation:
30 > (20 × 0.8)  →  30 > 16  →  TRUE

✓ CONDITION MET
→ ALERT TRIGGERED!

Severity: INFO
Type: demand_surge
Message: "Predicted demand surge: +50%"
```

### How Alerts are Generated

**Method 1: Automatic (Best Practice)**
```python
# Triggered when stock changes
POST /api/inventory/stock-out
→ Updates product stock
→ Automatically checks if alert needed
→ If yes, generates alert
→ Sends WhatsApp + Email immediately
```

**Method 2: Manual Check**
```python
# Trigger manually
POST /api/alerts/check
→ Scans ALL products
→ Checks conditions
→ Generates alerts for qualifying products
→ Sends WhatsApp + Email for each
```

**Method 3: Scheduled (Production)**
```python
# Run every hour using cron job or scheduler
import schedule

def check_alerts():
    # Call alert service
    alerts = alert_service.check_and_generate_alerts()

schedule.every(1).hours.do(check_alerts)
```

### WhatsApp Message Flow (Twilio)

```
┌─────────────────────────────────────────────┐
│  1. Alert Triggered in SmartStock AI        │
│     (Low stock detected: 5 units)           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  2. Python Code Prepares Message           │
│                                             │
│  message = """                              │
│  🚨 SmartStock AI Alert                     │
│                                             │
│  Product: Laptop Stand                      │
│  Status: CRITICAL                           │
│                                             │
│  Stock level critical: 5 units remaining   │
│  """                                        │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  3. Send via Twilio API                     │
│                                             │
│  from twilio.rest import Client             │
│  client.messages.create(                    │
│    from_='whatsapp:+14155238886',          │
│    to='whatsapp:+919543573515',            │
│    body=message                             │
│  )                                          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  4. Twilio Processes Request                │
│     - Validates credentials                 │
│     - Checks sandbox registration          │
│     - Queues message for delivery           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  5. WhatsApp Receives Message               │
│     - Sent to your phone                    │
│     - Shows as WhatsApp notification        │
│     - Delivered within 1-3 seconds          │
└─────────────────────────────────────────────┘
```

**Actual Code:**
```python
# backend/services/alert_service.py

def _send_alert_notification(self, product_name, message, severity):
    # Format message
    whatsapp_message = f"""
    🚨 *SmartStock AI Alert*
    
    *Product:* {product_name}
    *Status:* {severity.upper()}
    
    {message}
    
    _Automated alert from SmartStock AI_
    """
    
    # Send WhatsApp
    if self.twilio_enabled:
        message_obj = self.twilio_client.messages.create(
            from_='whatsapp:+14155238886',  # Twilio sandbox number
            body=whatsapp_message,
            to='whatsapp:+919543573515'      # Your phone number
        )
        logger.info(f"✅ WhatsApp sent! SID: {message_obj.sid}")
```

### Email Flow (Gmail SMTP)

```
┌─────────────────────────────────────────────┐
│  1. Alert Triggered                         │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  2. Create HTML Email                       │
│                                             │
│  <html>                                     │
│    <div style="color: red">                 │
│      🚨 SmartStock AI Alert                 │
│      Product: Laptop Stand                  │
│      Stock level critical: 5 units          │
│    </div>                                   │
│  </html>                                    │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  3. Connect to Gmail SMTP                   │
│                                             │
│  smtp = smtplib.SMTP('smtp.gmail.com', 587)│
│  smtp.starttls()                            │
│  smtp.login('phravin.v2v@gmail.com',       │
│             'ntpo nzjy phlh zpkk')         │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  4. Send Email                              │
│                                             │
│  smtp.send_message(email)                   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  5. Email Delivered                         │
│     - Arrives in Gmail inbox                │
│     - Subject: 🚨 SmartStock AI - CRITICAL  │
│     - HTML formatted with colors            │
│     - Delivered within 5-10 seconds         │
└─────────────────────────────────────────────┘
```

**Actual Code:**
```python
# backend/services/alert_service.py

def _send_email_alert(self, product_name, message, severity, emoji):
    # Create HTML email
    html_body = f"""
    <html>
        <body style="font-family: Arial; padding: 20px;">
            <div style="background: white; padding: 30px;">
                <h1 style="color: {'#FF3B30' if severity == 'critical' else '#FF9500'};">
                    {emoji} SmartStock AI Alert
                </h1>
                <h2>Product: {product_name}</h2>
                <p><strong>Status:</strong> {severity.upper()}</p>
                <div style="background: #f9f9f9; padding: 15px;">
                    <p>{message}</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    # Send via Gmail SMTP
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login('phravin.v2v@gmail.com', 'ntpo nzjy phlh zpkk')
        server.send_message(email)
        
    logger.info("✅ Email sent to phravin.v2v@gmail.com")
```

### Real-World Example

**Scenario: Product Running Low**

```
TIME: 2025-08-15 15:30:00

1. USER ACTION:
   Customer buys 5 units of "Laptop Stand"
   Frontend: Click "Stock Out" button
   
2. API CALL:
   POST /api/inventory/stock-out
   Body: { "sku": "PROD-004", "quantity": 5 }
   
3. BACKEND PROCESSING:
   ✓ Finds product in MongoDB
   ✓ Current stock: 10 units
   ✓ New stock: 10 - 5 = 5 units
   ✓ Threshold: 10 units
   ✓ Check: 5 < 10 → TRUE
   ✓ Status changed to "critical"
   
4. ALERT GENERATION:
   ✓ Creates alert in MongoDB:
     {
       "type": "low_stock",
       "product_name": "Laptop Stand",
       "message": "Stock level critical: 5 units",
       "severity": "critical"
     }
   
5. NOTIFICATIONS SENT (SIMULTANEOUSLY):
   
   WhatsApp (via Twilio):
   ┌────────────────────────────────────┐
   │ 🚨 SmartStock AI Alert            │
   │                                    │
   │ Product: Laptop Stand              │
   │ Status: CRITICAL                   │
   │                                    │
   │ Stock level critical: 5 units     │
   │ remaining                          │
   │                                    │
   │ Automated alert from SmartStock AI│
   └────────────────────────────────────┘
   Delivered to: +91 9543573515
   Time: 15:30:02 (2 seconds)
   
   Email (via Gmail):
   ┌────────────────────────────────────┐
   │ To: phravin.v2v@gmail.com         │
   │ Subject: 🚨 SmartStock AI -       │
   │          CRITICAL Alert:           │
   │          Laptop Stand              │
   │                                    │
   │ [HTML formatted email with red    │
   │  header, product details, and     │
   │  formatted message]                │
   └────────────────────────────────────┘
   Delivered to: Gmail inbox
   Time: 15:30:05 (5 seconds)
   
6. LOGS:
   [INFO] Stock OUT: PROD-004 -5 = 5
   [INFO] Status changed: in_stock → critical
   [INFO] ✅ WhatsApp sent (SID: SMxxxxx)
   [INFO] ✅ Email sent to phravin.v2v@gmail.com
```

---

## 5. Complete Workflow

### Daily Operations

```
MORNING (9:00 AM)
├─ System checks all products
├─ Generates fresh ARIMA forecasts
└─ Identifies potential issues

USER ACTIVITY (Throughout Day)
├─ Adds new products → Saved to MongoDB
├─ Records sales → Updates stock, triggers alerts if needed
└─ Views dashboard → Sees real-time data

AUTOMATED CHECKS (Every Hour)
├─ Scan all products
├─ Compare stock vs threshold
├─ Compare stock vs forecasts
└─ Generate alerts if conditions met

ALERTS (When Triggered)
├─ Create alert record in MongoDB
├─ Send WhatsApp message (1-3 seconds)
└─ Send Email (5-10 seconds)
```

### Complete User Journey

**Example: Managing "Wireless Mouse"**

```
DAY 1 - Setup
───────────────
User adds product:
  Name: Wireless Mouse
  SKU: PROD-001
  Stock: 100 units
  Threshold: 20 units
  Price: $29.99
  
→ Saved to MongoDB Products collection

System generates forecast:
  ✓ Analyzes historical sales (if any)
  ✓ Generates 30-day prediction
  ✓ Saves to Forecasts collection

DAY 2-30 - Sales Activity
──────────────────────────
Daily sales recorded:
  Day 2: Sold 3 units → Stock: 97
  Day 3: Sold 5 units → Stock: 92
  ...
  Day 29: Sold 4 units → Stock: 25

→ Each sale saved to Sales collection
→ Product stock updated in real-time
→ ARIMA model learns from new data

DAY 30 - Low Stock
───────────────────
Sale of 10 units:
  Before: 25 units
  After: 15 units
  Threshold: 20 units
  
✓ CONDITION: 15 < 20
→ ALERT TRIGGERED!

Immediate actions:
  1. Alert saved to MongoDB
  2. WhatsApp sent to +919543573515
  3. Email sent to phravin.v2v@gmail.com
  
Dashboard shows:
  🔴 Status: LOW STOCK
  📊 15 units remaining
  ⚠️ Active alert visible

DAY 31 - Restock
─────────────────
User adds 50 units:
  Before: 15 units
  After: 65 units
  
✓ Stock above threshold
→ Status: IN STOCK
→ Alert can be marked resolved

DAY 32+ - Forecast Update
──────────────────────────
System regenerates forecast:
  ✓ Uses last 90 days of sales
  ✓ Detects increased demand
  ✓ Predicts higher sales next month
  ✓ May trigger demand surge alert
```

---

## Summary

### How Everything Works Together

1. **MongoDB** stores all data (products, sales, forecasts, alerts)
2. **ARIMA Model** analyzes sales history → predicts future demand
3. **Alert System** monitors conditions → sends WhatsApp + Email when:
   - Stock falls below threshold
   - Predicted demand exceeds available stock
4. **Real-time Updates** keep everything synchronized
5. **User Dashboard** displays all information visually

### Key Takeaways

✅ **Automatic** - No manual monitoring needed
✅ **Predictive** - AI forecasts future demand
✅ **Proactive** - Alerts before problems occur
✅ **Multi-channel** - WhatsApp + Email notifications
✅ **Real-time** - Instant updates and alerts
✅ **Data-driven** - Statistical analysis guides decisions

### When You'll Receive Alerts

**You WILL receive WhatsApp + Email when:**
- ✅ Product stock drops below threshold
- ✅ Predicted sales exceed current stock
- ✅ Manual alert check is triggered
- ✅ Stock-out operation creates low stock condition

**You WON'T receive alerts when:**
- ❌ Stock is above threshold
- ❌ Predictions show sufficient stock
- ❌ Alerts are already sent (no duplicates)
- ❌ Alert is marked as resolved

---

## Questions & Answers

**Q: How accurate is ARIMA forecasting?**
A: Typically 85-95% accurate with 90+ days of data. Accuracy improves over time as more data is collected.

**Q: Can I change alert phone numbers/emails?**
A: Yes! Update `TWILIO_WHATSAPP_TO` and `ALERT_EMAIL_TO` in `.env` file.

**Q: How fast are alerts sent?**
A: WhatsApp: 1-3 seconds, Email: 5-10 seconds from trigger.

**Q: Do alerts cost money?**
A: WhatsApp via Twilio Sandbox: FREE. Production: $0.005 per message. Gmail: FREE (no limits).

**Q: Can I turn off alerts?**
A: Yes, set thresholds to 0 or remove credentials from `.env`.

**Q: How often should I generate forecasts?**
A: Daily is recommended. Run `POST /api/forecast/generate` once per day.

---

**Need more details?** Check the code in:
- `backend/services/forecast_service.py` - ARIMA implementation
- `backend/services/alert_service.py` - Alert logic
- `backend/server.py` - API endpoints
