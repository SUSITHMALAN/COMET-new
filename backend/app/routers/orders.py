from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Order, OrderItem, Product, Stock
from app.schemas.schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from app.utils.auth import get_admin_user, get_optional_user
from app.models.models import User

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    total = sum(item.price * item.quantity for item in data.items)
    
    order = Order(
        user_id=current_user.id if current_user else None,
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        customer_email=data.customer_email,
        shipping_address=data.shipping_address,
        notes=data.notes,
        total_amount=total,
        status="pending"
    )
    db.add(order)
    db.flush()

    for item_data in data.items:
        item = OrderItem(
            order_id=order.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            size=item_data.size,
            color=item_data.color,
            price=item_data.price
        )
        db.add(item)

        # Deduct stock
        if item_data.size and item_data.color:
            stock = db.query(Stock).filter(
                Stock.product_id == item_data.product_id,
                Stock.size == item_data.size,
                Stock.color == item_data.color
            ).first()
            if stock and stock.quantity >= item_data.quantity:
                stock.quantity -= item_data.quantity

    db.commit()
    db.refresh(order)
    return order

@router.get("", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Login required")
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/status")
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = data.status
    db.commit()
    return {"message": "Status updated", "status": data.status}

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"message": "Order deleted"}
