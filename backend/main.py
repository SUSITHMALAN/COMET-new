from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from app.database import engine, SessionLocal, Base
from app.models.models import User, Category, Product, Stock
from app.utils.auth import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create admin user
        admin = db.query(User).filter(User.email == os.getenv("ADMIN_EMAIL")).first()
        if not admin:
            admin = User(
                email=os.getenv("ADMIN_EMAIL", "admin@comet.com"),
                name="Admin",
                hashed_password=get_password_hash(os.getenv("ADMIN_PASSWORD", "admin123")),
                role="admin",
                is_active=True
            )
            db.add(admin)
        
        # Seed categories
        if db.query(Category).count() == 0:
            categories = [
                Category(name="T-Shirts", slug="t-shirts", description="Casual and graphic tees"),
                Category(name="Hoodies", slug="hoodies", description="Premium hoodies and sweatshirts"),
                Category(name="Pants", slug="pants", description="Trousers and joggers"),
                Category(name="Jackets", slug="jackets", description="Outer wear and jackets"),
                Category(name="Accessories", slug="accessories", description="Caps, bags and more"),
            ]
            for cat in categories:
                db.add(cat)
        
        db.commit()

        # Seed sample products
        if db.query(Product).count() == 0:
            import json
            cat = db.query(Category).filter(Category.slug == "t-shirts").first()
            hoodie_cat = db.query(Category).filter(Category.slug == "hoodies").first()
            sample_products = [
                Product(
                    name="COMET Classic Tee",
                    description="Our signature classic fit tee. Made from 100% premium cotton with a relaxed fit for all-day comfort.",
                    price=2990,
                    original_price=3990,
                    category_id=cat.id if cat else None,
                    sizes=json.dumps(["XS", "S", "M", "L", "XL", "XXL"]),
                    colors=json.dumps(["Black", "White", "Grey"]),
                    images=json.dumps([]),
                    is_featured=True,
                    is_new=True
                ),
                Product(
                    name="COMET Oversized Hoodie",
                    description="Premium heavyweight hoodie with embroidered COMET logo. Perfect for cooler days.",
                    price=5990,
                    original_price=7490,
                    category_id=hoodie_cat.id if hoodie_cat else None,
                    sizes=json.dumps(["S", "M", "L", "XL", "XXL"]),
                    colors=json.dumps(["Black", "Charcoal", "Navy"]),
                    images=json.dumps([]),
                    is_featured=True,
                    is_new=False
                ),
                Product(
                    name="COMET Logo Tee",
                    description="Bold graphic tee featuring the COMET comet logo. Made from soft cotton blend.",
                    price=2490,
                    category_id=cat.id if cat else None,
                    sizes=json.dumps(["XS", "S", "M", "L", "XL"]),
                    colors=json.dumps(["White", "Black"]),
                    images=json.dumps([]),
                    is_featured=False,
                    is_new=True
                ),
            ]
            for p in sample_products:
                db.add(p)
            db.commit()

    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="COMET API",
    description="Backend API for COMET Clothing Brand",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads/products", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from app.routers import auth, products, orders, users, stocks
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(stocks.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "COMET API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
