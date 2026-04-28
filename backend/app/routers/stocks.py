from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Stock
from app.schemas.schemas import StockResponse, StockCreate, StockUpdate
from app.utils.auth import get_admin_user
from app.models.models import User

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("", response_model=List[StockResponse])
def get_all_stocks(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(Stock).all()

@router.post("", response_model=StockResponse)
def create_or_update_stock(data: StockCreate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    existing = db.query(Stock).filter(
        Stock.product_id == data.product_id,
        Stock.size == data.size,
        Stock.color == data.color
    ).first()
    if existing:
        existing.quantity = data.quantity
        db.commit()
        db.refresh(existing)
        return existing
    stock = Stock(**data.dict())
    db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock

@router.put("/{stock_id}", response_model=StockResponse)
def update_stock(stock_id: int, data: StockUpdate, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    stock.quantity = data.quantity
    db.commit()
    db.refresh(stock)
    return stock

@router.delete("/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    db.delete(stock)
    db.commit()
    return {"message": "Stock deleted"}
