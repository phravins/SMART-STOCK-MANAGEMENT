from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Product Models
class ProductBase(BaseModel):
    sku: str
    name: str
    category: str
    current_stock: int
    threshold: int
    price: float

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str = Field(alias="_id")
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    status: str

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Sales Models
class SaleBase(BaseModel):
    sku: str
    quantity: int
    amount: float

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: str = Field(alias="_id")
    product_id: str
    date: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Alert Models
class Alert(BaseModel):
    id: str = Field(alias="_id")
    type: str
    product_id: str
    product_name: str
    message: str
    timestamp: datetime
    severity: str
    resolved: bool = False

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Forecast Models
class Forecast(BaseModel):
    id: str = Field(alias="_id")
    product_id: str
    sku: str
    forecast_date: datetime
    predicted_sales: float
    confidence_lower: Optional[float] = None
    confidence_upper: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Dashboard Models
class DashboardStats(BaseModel):
    total_products: int
    low_stock_items: int
    critical_items: int
    total_value: float
    monthly_sales: float
    forecasted_sales: float
    growth_rate: float

class ChartDataPoint(BaseModel):
    month: str
    sales: Optional[float]
    forecast: float

# Inventory Operations
class StockOperation(BaseModel):
    sku: str
    quantity: int
    notes: Optional[str] = None

# Contact Form
class ContactForm(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    message: str