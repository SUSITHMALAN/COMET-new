from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import Optional, List
import json, os, uuid
from app.database import get_db
from app.models.models import Product, Category, Stock
from app.schemas.schemas import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryUpdate, CategoryResponse
from app.utils.auth import get_admin_user, get_current_user
from app.models.models import User
from PIL import Image
import shutil

router = APIRouter(prefix="/products", tags=["products"])

UPLOAD_DIR = "uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Categories
@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("/categories", response_model=CategoryResponse)
def create_category(data: CategoryCreate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    cat = Category(**data.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cat, key, value)
    
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category has products
    has_products = db.query(Product).filter(Product.category_id == category_id).first()
    if has_products:
        raise HTTPException(status_code=400, detail="Cannot delete category with associated products")

    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}

# Products
@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    is_new: Optional[bool] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    q = db.query(Product).filter(Product.is_active == True)
    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            q = q.filter(Product.category_id == cat.id)
    if featured is not None:
        q = q.filter(Product.is_featured == featured)
    if is_new is not None:
        q = q.filter(Product.is_new == is_new)
    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))
    return q.offset(skip).limit(limit).all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ProductResponse)
async def create_product(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    original_price: Optional[float] = Form(None),
    category_id: Optional[int] = Form(None),
    sizes: str = Form("[]"),
    colors: str = Form("[]"),
    is_featured: bool = Form(False),
    is_new: bool = Form(False),
    images: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    image_paths = []
    for img in images:
        if img.filename:
            ext = img.filename.split(".")[-1].lower()
            filename = f"{uuid.uuid4()}.{ext}"
            path = os.path.join(UPLOAD_DIR, filename)
            with open(path, "wb") as f:
                shutil.copyfileobj(img.file, f)
            image_paths.append(f"/uploads/products/{filename}")

    product = Product(
        name=name,
        description=description,
        price=price,
        original_price=original_price,
        category_id=category_id,
        sizes=sizes,
        colors=colors,
        is_featured=is_featured,
        is_new=is_new,
        images=json.dumps(image_paths)
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    original_price: Optional[float] = Form(None),
    category_id: Optional[int] = Form(None),
    sizes: Optional[str] = Form(None),
    colors: Optional[str] = Form(None),
    is_featured: Optional[bool] = Form(None),
    is_new: Optional[bool] = Form(None),
    is_active: Optional[bool] = Form(None),
    images: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if name: product.name = name
    if description is not None: product.description = description
    if price is not None: product.price = price
    if original_price is not None: product.original_price = original_price
    if category_id is not None: product.category_id = category_id
    if sizes is not None: product.sizes = sizes
    if colors is not None: product.colors = colors
    if is_featured is not None: product.is_featured = is_featured
    if is_new is not None: product.is_new = is_new
    if is_active is not None: product.is_active = is_active

    if images:
        existing = json.loads(product.images or "[]")
        for img in images:
            if img.filename:
                ext = img.filename.split(".")[-1].lower()
                filename = f"{uuid.uuid4()}.{ext}"
                path = os.path.join(UPLOAD_DIR, filename)
                with open(path, "wb") as f:
                    shutil.copyfileobj(img.file, f)
                existing.append(f"/uploads/products/{filename}")
        product.images = json.dumps(existing)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    db.commit()
    return {"message": "Product deleted"}

# Stock
@router.get("/{product_id}/stock")
def get_product_stock(product_id: int, db: Session = Depends(get_db)):
    stock = db.query(Stock).filter(Stock.product_id == product_id).all()
    return stock

@router.post("/{product_id}/stock")
def update_stock(
    product_id: int,
    size: str = Form(...),
    color: str = Form(...),
    quantity: int = Form(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    stock = db.query(Stock).filter(
        Stock.product_id == product_id,
        Stock.size == size,
        Stock.color == color
    ).first()
    if stock:
        stock.quantity = quantity
    else:
        stock = Stock(product_id=product_id, size=size, color=color, quantity=quantity)
        db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock

# Admin - get all products including inactive
@router.get("/admin/all", response_model=List[ProductResponse])
def get_all_products_admin(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(Product).all()
