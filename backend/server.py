from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import uuid

from models import (
    Product, ProductCreate, Sale, SaleCreate, Alert,
    DashboardStats, ChartDataPoint, StockOperation, ContactForm
)
from services.forecast_service import ForecastService
from services.alert_service import AlertService
from utils import calculate_product_status, format_product_response, format_alert_response

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Services
forecast_service = ForecastService(db)
alert_service = AlertService(db)

# Create the main app without a prefix
app = FastAPI(title="SmartStock AI API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "SmartStock AI API - Inventory Management & Sales Forecasting"}

# ============ PRODUCTS ============

@api_router.get("/products")
async def get_products(skip: int = 0, limit: int = 100):
    """Get all products"""
    products = await db.products.find().skip(skip).limit(limit).to_list(limit)
    return [format_product_response(p) for p in products]

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get single product"""
    product = await db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return format_product_response(product)

@api_router.post("/products")
async def create_product(product: ProductCreate):
    """Create new product"""
    # Check if SKU already exists
    existing = await db.products.find_one({"sku": product.sku})
    if existing:
        raise HTTPException(status_code=400, detail="Product with this SKU already exists")
    
    product_dict = product.dict()
    product_dict["_id"] = str(uuid.uuid4())
    product_dict["last_updated"] = datetime.utcnow()
    product_dict["status"] = calculate_product_status(product.current_stock, product.threshold)
    
    await db.products.insert_one(product_dict)
    # Auto-check alerts for this product (low stock / demand surge)
    try:
        await alert_service.check_and_generate_alerts_for_product(product_dict)
    except Exception as e:
        logger.error(f"Alert check failed on product create {product_dict['sku']}: {str(e)}")
    return format_product_response(product_dict)

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, product: ProductCreate):
    """Update product"""
    update_data = product.dict()
    update_data["last_updated"] = datetime.utcnow()
    update_data["status"] = calculate_product_status(product.current_stock, product.threshold)
    
    result = await db.products.update_one(
        {"_id": product_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated = await db.products.find_one({"_id": product_id})
    # Auto-check alerts for this product after update
    try:
        await alert_service.check_and_generate_alerts_for_product(updated)
    except Exception as e:
        logger.error(f"Alert check failed on product update {product_id}: {str(e)}")
    return format_product_response(updated)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete product"""
    result = await db.products.delete_one({"_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# ============ INVENTORY ============

@api_router.post("/inventory/stock-in")
async def stock_in(operation: StockOperation):
    """Add incoming stock"""
    product = await db.products.find_one({"sku": operation.sku})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    new_stock = product["current_stock"] + operation.quantity
    new_status = calculate_product_status(new_stock, product["threshold"])
    
    await db.products.update_one(
        {"sku": operation.sku},
        {
            "$set": {
                "current_stock": new_stock,
                "status": new_status,
                "last_updated": datetime.utcnow()
            }
        }
    )
    
    logger.info(f"Stock IN: {operation.sku} +{operation.quantity} = {new_stock}")
    # Auto-check alerts for this product after stock-in
    try:
        updated_product = await db.products.find_one({"sku": operation.sku})
        if updated_product:
            await alert_service.check_and_generate_alerts_for_product(updated_product)
    except Exception as e:
        logger.error(f"Alert check failed on stock-in {operation.sku}: {str(e)}")
    return {"message": "Stock updated", "new_stock": new_stock, "status": new_status}

@api_router.post("/inventory/stock-out")
async def stock_out(operation: StockOperation):
    """Record outgoing sales"""
    product = await db.products.find_one({"sku": operation.sku})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["current_stock"] < operation.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    new_stock = product["current_stock"] - operation.quantity
    new_status = calculate_product_status(new_stock, product["threshold"])
    
    # Update product stock
    await db.products.update_one(
        {"sku": operation.sku},
        {
            "$set": {
                "current_stock": new_stock,
                "status": new_status,
                "last_updated": datetime.utcnow()
            }
        }
    )
    
    # Record sale
    sale_data = {
        "_id": str(uuid.uuid4()),
        "product_id": str(product["_id"]),
        "sku": operation.sku,
        "quantity": operation.quantity,
        "amount": operation.quantity * product["price"],
        "date": datetime.utcnow()
    }
    await db.sales.insert_one(sale_data)
    
    logger.info(f"Stock OUT: {operation.sku} -{operation.quantity} = {new_stock}")
    # Auto-check alerts for this product after stock-out
    try:
        updated_product = await db.products.find_one({"sku": operation.sku})
        if updated_product:
            await alert_service.check_and_generate_alerts_for_product(updated_product)
    except Exception as e:
        logger.error(f"Alert check failed on stock-out {operation.sku}: {str(e)}")
    return {"message": "Sale recorded", "new_stock": new_stock, "status": new_status}

# ============ SALES & FORECASTING ============

@api_router.get("/sales/history")
async def get_sales_history(sku: Optional[str] = None, limit: int = 100):
    """Get historical sales data"""
    query = {"sku": sku} if sku else {}
    sales = await db.sales.find(query).sort("date", -1).limit(limit).to_list(limit)
    
    formatted = []
    for sale in sales:
        sale['id'] = str(sale['_id'])
        sale['_id'] = str(sale['_id'])
        sale['product_id'] = str(sale['product_id'])
        sale['date'] = sale['date'].isoformat()
        formatted.append(sale)
    
    return formatted

@api_router.post("/forecast/generate")
async def generate_forecasts():
    """Generate forecasts for all products"""
    products = await db.products.find().to_list(1000)
    generated_count = 0
    
    for product in products:
        try:
            forecasts = await forecast_service.generate_forecast_for_product(product["sku"], days=90)
            await forecast_service.save_forecasts(str(product["_id"]), forecasts)
            generated_count += 1
        except Exception as e:
            logger.error(f"Forecast generation failed for {product['sku']}: {str(e)}")
    
    logger.info(f"Generated forecasts for {generated_count} products")
    return {"message": f"Forecasts generated for {generated_count} products"}

@api_router.get("/forecast/{sku}")
async def get_forecast(sku: str, days: int = 30):
    """Get forecast for specific product"""
    product = await db.products.find_one({"sku": sku})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    forecasts = await db.forecasts.find(
        {"product_id": str(product["_id"])}
    ).limit(days).to_list(days)
    
    formatted = []
    for f in forecasts:
        f['id'] = str(f['_id'])
        f['_id'] = str(f['_id'])
        f['product_id'] = str(f['product_id'])
        f['forecast_date'] = f['forecast_date'].isoformat()
        f['created_at'] = f['created_at'].isoformat()
        formatted.append(f)
    
    return formatted

# ============ ALERTS ============

@api_router.get("/alerts")
async def get_alerts():
    """Get all active alerts"""
    alerts = await alert_service.get_active_alerts(limit=50)
    return [format_alert_response(a) for a in alerts]

@api_router.post("/alerts/check")
async def check_alerts():
    """Manually trigger alert check"""
    alerts = await alert_service.check_and_generate_alerts()
    return {"message": f"Generated {len(alerts)} new alerts", "alerts": [format_alert_response(a) for a in alerts]}

@api_router.put("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    """Mark alert as resolved"""
    success = await alert_service.resolve_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert resolved"}

# ============ DASHBOARD ============

@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    # Count products by status
    products = await db.products.find().to_list(1000)
    total_products = len(products)
    low_stock_items = sum(1 for p in products if p['status'] == 'low_stock')
    critical_items = sum(1 for p in products if p['status'] == 'critical')
    total_value = sum(p['current_stock'] * p['price'] for p in products)
    
    # Get current month sales
    from datetime import datetime
    current_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    monthly_sales_result = await db.sales.aggregate([
        {"$match": {"date": {"$gte": current_month_start}}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(1)
    
    monthly_sales = monthly_sales_result[0]['total'] if monthly_sales_result else 0
    
    # Get forecasted sales for current month
    forecast_result = await db.forecasts.aggregate([
        {
            "$match": {
                "forecast_date": {
                    "$gte": current_month_start,
                    "$lt": datetime.utcnow()
                }
            }
        },
        {"$group": {"_id": None, "total": {"$sum": "$predicted_sales"}}}
    ]).to_list(1)
    
    forecasted_sales = forecast_result[0]['total'] if forecast_result else monthly_sales * 1.08
    
    # Calculate growth rate
    growth_rate = ((forecasted_sales - monthly_sales) / monthly_sales * 100) if monthly_sales > 0 else 8.5
    
    return {
        "total_products": total_products,
        "low_stock_items": low_stock_items,
        "critical_items": critical_items,
        "total_value": round(total_value, 2),
        "monthly_sales": round(monthly_sales, 2),
        "forecasted_sales": round(forecasted_sales, 2),
        "growth_rate": round(growth_rate, 1)
    }

@api_router.get("/dashboard/chart-data")
async def get_chart_data():
    """Get sales vs forecast chart data"""
    chart_data = await forecast_service.get_aggregated_forecast_chart_data()
    return chart_data

# ============ CONTACT ============

@api_router.post("/contact")
async def submit_contact_form(form: ContactForm):
    """Handle contact form submission"""
    # Mock email sending
    logger.info(f"Contact form received from {form.name} ({form.email})")
    logger.info(f"Message: {form.message}")
    logger.info("📧 Email notification sent to admin (mocked)")
    
    return {"message": "Thank you for your message. We'll get back to you soon!"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()