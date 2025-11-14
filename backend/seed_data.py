import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import random
import math
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample products
PRODUCTS = [
    {"_id": str(uuid.uuid4()), "sku": "PROD-001", "name": "Wireless Mouse", "category": "Electronics", "current_stock": 45, "threshold": 20, "price": 29.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-002", "name": "USB-C Cable", "category": "Accessories", "current_stock": 12, "threshold": 15, "price": 12.99, "last_updated": datetime.utcnow(), "status": "low_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-003", "name": "Mechanical Keyboard", "category": "Electronics", "current_stock": 67, "threshold": 25, "price": 89.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-004", "name": "Laptop Stand", "category": "Accessories", "current_stock": 5, "threshold": 10, "price": 39.99, "last_updated": datetime.utcnow(), "status": "critical"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-005", "name": "Webcam HD", "category": "Electronics", "current_stock": 89, "threshold": 30, "price": 59.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-006", "name": "Monitor 24 inch", "category": "Electronics", "current_stock": 15, "threshold": 18, "price": 199.99, "last_updated": datetime.utcnow(), "status": "low_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-007", "name": "Office Chair", "category": "Furniture", "current_stock": 23, "threshold": 15, "price": 249.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-008", "name": "Desk Lamp", "category": "Lighting", "current_stock": 34, "threshold": 20, "price": 45.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-009", "name": "Headphones", "category": "Electronics", "current_stock": 8, "threshold": 12, "price": 79.99, "last_updated": datetime.utcnow(), "status": "low_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-010", "name": "Phone Stand", "category": "Accessories", "current_stock": 56, "threshold": 25, "price": 19.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-011", "name": "External SSD 1TB", "category": "Storage", "current_stock": 42, "threshold": 20, "price": 129.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-012", "name": "Bluetooth Speaker", "category": "Electronics", "current_stock": 19, "threshold": 15, "price": 69.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-013", "name": "USB Hub", "category": "Accessories", "current_stock": 71, "threshold": 30, "price": 34.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-014", "name": "Webcam Cover", "category": "Accessories", "current_stock": 3, "threshold": 8, "price": 7.99, "last_updated": datetime.utcnow(), "status": "critical"},
    {"_id": str(uuid.uuid4()), "sku": "PROD-015", "name": "Cable Organizer", "category": "Accessories", "current_stock": 88, "threshold": 40, "price": 14.99, "last_updated": datetime.utcnow(), "status": "in_stock"},
]

async def seed_database():
    print("Starting database seeding...")

    # Clear existing data
    await db.products.delete_many({})
    await db.sales.delete_many({})
    await db.forecasts.delete_many({})
    await db.alerts.delete_many({})
    print("✓ Cleared existing data")

    # Insert products
    await db.products.insert_many(PRODUCTS)
    print(f"✓ Inserted {len(PRODUCTS)} products")

    # Generate historical sales data (90 days)
    sales_data = []
    end_date = datetime.utcnow()
    
    for product in PRODUCTS:
        base_daily_sales = random.randint(2, 15)
        
        for days_ago in range(90, 0, -1):
            sale_date = end_date - timedelta(days=days_ago)
            
            # Add some variation and seasonality
            variation = random.uniform(0.5, 1.5)
            seasonality = 1 + 0.3 * math.sin(days_ago / 10)  # Simulate trends
            
            quantity = max(1, int(base_daily_sales * variation * seasonality))
            
            # Random chance of sale (80%)
            if random.random() < 0.8:
                sales_data.append({
                    "_id": str(uuid.uuid4()),
                    "product_id": product['_id'],
                    "sku": product['sku'],
                    "quantity": quantity,
                    "amount": quantity * product['price'],
                    "date": sale_date
                })
    
    await db.sales.insert_many(sales_data)
    print(f"✓ Generated {len(sales_data)} historical sales records")

    print("\n✓ Database seeding completed successfully!")
    print("\nSummary:")
    print(f"  - Products: {len(PRODUCTS)}")
    print(f"  - Sales records: {len(sales_data)}")
    print(f"  - Time period: Last 90 days")

if __name__ == "__main__":
    asyncio.run(seed_database())
    print("\nDone! You can now start the server.")