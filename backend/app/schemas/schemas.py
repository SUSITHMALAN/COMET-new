from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Any

class LoginRequest(BaseModel):
    email: str
    password: str

# User
class UserCreate(BaseModel):
    email: str
    name: str
    phone: Optional[str] = None
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    phone: Optional[str]
    role: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Category
class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    class Config:
        from_attributes = True

# Product
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    category_id: Optional[int] = None
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    is_featured: Optional[bool] = False
    is_new: Optional[bool] = False

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    category_id: Optional[int] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_new: Optional[bool] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    original_price: Optional[float]
    category_id: Optional[int]
    category: Optional[CategoryResponse]
    images: str
    sizes: str
    colors: str
    is_active: bool
    is_featured: bool
    is_new: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Stock
class StockCreate(BaseModel):
    product_id: int
    size: str
    color: str
    quantity: int

class StockUpdate(BaseModel):
    quantity: int

class StockResponse(BaseModel):
    id: int
    product_id: int
    size: str
    color: str
    quantity: int
    updated_at: datetime
    class Config:
        from_attributes = True

# Order
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    size: Optional[str] = None
    color: Optional[str] = None
    price: float

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    shipping_address: str
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    size: Optional[str]
    color: Optional[str]
    price: float
    product: Optional[ProductResponse]
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    customer_phone: str
    customer_email: Optional[str]
    shipping_address: str
    total_amount: float
    status: str
    notes: Optional[str]
    whatsapp_sent: bool
    created_at: datetime
    items: List[OrderItemResponse]
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str
