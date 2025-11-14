# SmartStock AI - Inventory Management & Sales Forecasting System

AI-powered inventory management with ARIMA-based sales forecasting, real-time alerts via WhatsApp & Email.

## Features

1) **Real-Time Inventory Tracking**
- Track stock levels across multiple products
- Automatic status updates (In Stock, Low Stock, Critical)
- Stock-in/Stock-out operations

2) **AI Sales Forecasting (ARIMA)**
- 30-90 day sales predictions using ARIMA models
- Statistical graphs with confidence intervals
- Historical data analysis

3) **Smart Alert System**
- WhatsApp notifications (Twilio)
- Email alerts (Gmail SMTP)
- Low stock & demand surge detection

4) **Analytics Dashboard**
- Real-time statistics
- Interactive charts & graphs
- Export reports (CSV)

5) **Product Management**
- Add/Edit/Delete products
- Forecast view per product
- Bulk operations

## Tech Stack

### Frontend
- React 19
- TailwindCSS + Custom Design System
- Axios for API calls
- React Router

### Backend
- FastAPI (Python)
- MongoDB (Motor async driver)
- ARIMA (statsmodels)
- Twilio (WhatsApp)
- Flask-Mail (Email)

## Deployment to Render

### 1. Setup MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Get connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/smartstock`

### 2. Deploy Backend
1. Go to https://dashboard.render.com/
2. New → Web Service
3. Connect your GitHub repository
4. Settings:
   - **Name**: smartstock-api
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables (click "Add Environment Variable"):
   - `MONGO_URL` = `mongodb+srv://user:pass@cluster.mongodb.net/smartstock`
   - `DB_NAME` = `smartstock`
   - `TWILIO_ACCOUNT_SID` = `<YOURE SID>`
   - `TWILIO_AUTH_TOKEN` = `<YOUR AUTH TOKEN>`
   - `TWILIO_WHATSAPP_FROM` = `<TWILIO CONNECTED WHATSAPP NO>`
   - `TWILIO_WHATSAPP_TO` = `<WHATSAPP NO>`
   - `MAIL_SERVER` = `smtp.gmail.com`
   - `MAIL_PORT` = `587`
   - `MAIL_USE_TLS` = `True`
   - `MAIL_USERNAME` = `<YOUR MAIL>`
   - `MAIL_PASSWORD` = `<MAIL APP PASSWORD>`
   - `MAIL_DEFAULT_SENDER` = `<YOUR DEFAULT MAIL>`
   - `ALERT_EMAIL_TO` = `<YOUR ALERT MAIL>`
6. Click "Create Web Service"
7. Copy the backend URL (e.g., `https://railway.com/`)

### 3. Deploy Frontend
1. Render Dashboard → New → Static Site
2. Connect same GitHub repository
3. Settings:
   - **Name**: smartstock-frontend
   - **Build Command**: `cd frontend && yarn install && yarn build`
   - **Publish Directory**: `frontend/build`
4. Add Environment Variable:
   - `REACT_APP_BACKEND_URL` = `https://smartstock-api.onrender.com` (your backend URL)
5. Click "Create Static Site"

### 4. Seed Database (One-time)
After backend is deployed:
```bash
# In Render Web Service shell OR locally
python backend/seed_data.py

# Generate forecasts
curl -X POST https://your-backend-url.onrender.com/api/forecast/generate

# Generate alerts
curl -X POST https://your-backend-url.onrender.com/api/alerts/check
```

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python seed_data.py
uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

## Environment Setup

Create `.env` files:

**backend/.env:**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=smartstock
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+your_number
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
ALERT_EMAIL_TO=recipient@gmail.com
```

**frontend/.env:**
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## API Documentation

Access interactive API docs at: `https://docs.railway.com/railway-metal`

## License

PHRAVIN S - MIT License
