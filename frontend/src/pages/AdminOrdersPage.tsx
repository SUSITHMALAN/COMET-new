import React, { useEffect, useState } from 'react';
import { Eye, Trash2, MessageCircle, ChevronDown } from 'lucide-react';
import { ordersApi } from '../api';
import { Order } from '../types';
import { showToast } from '../hooks/useToast';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState('all');

  const fetchOrders = () => {
    setLoading(true);
    ordersApi.getAll()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: number, status: string) => {
    await ordersApi.updateStatus(orderId, status);
    showToast('Order status updated', 'success');
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this order?')) return;
    await ordersApi.delete(id);
    showToast('Order deleted', 'success');
    setSelectedOrder(null);
    fetchOrders();
  };

  const handleWhatsApp = (order: Order) => {
    const msg = `Hi ${order.customer_name}! Your COMET order #${order.id} status: *${order.status.toUpperCase()}*. Total: LKR ${order.total_amount.toLocaleString()}. Thank you for shopping with us! 🚀`;
    window.open(`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '0.06em' }}>ORDERS</h1>
        <p style={{ color: 'var(--grey-500)', fontSize: '14px' }}>{orders.length} total orders</p>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: 24, alignItems: 'start' }}>
          {/* Table */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--grey-100)' }}>
                  {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--grey-500)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--grey-100)', cursor: 'pointer', background: selectedOrder?.id === order.id ? 'var(--grey-50)' : undefined }}
                    onClick={() => setSelectedOrder(order)}>
                    <td style={{ padding: '14px', fontWeight: 700, fontSize: '14px' }}>#{order.id}</td>
                    <td style={{ padding: '14px' }}>
                      <p style={{ fontWeight: 600, fontSize: '13px' }}>{order.customer_name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--grey-400)' }}>{order.customer_phone}</p>
                    </td>
                    <td style={{ padding: '14px', fontSize: '13px', color: 'var(--grey-500)' }}>{order.items.length}</td>
                    <td style={{ padding: '14px', fontWeight: 600, fontSize: '14px' }}>LKR {order.total_amount.toLocaleString()}</td>
                    <td style={{ padding: '14px' }}>
                      <select
                        value={order.status}
                        onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        style={{
                          padding: '4px 8px', borderRadius: 2, border: 'none',
                          fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                          background: order.status === 'delivered' ? '#dcfce7' : order.status === 'cancelled' ? '#fee2e2' : '#f5f5f5',
                          textTransform: 'capitalize',
                        }}
                      >
                        {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '14px', fontSize: '12px', color: 'var(--grey-400)', whiteSpace: 'nowrap' }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); handleWhatsApp(order); }} title="Contact on WhatsApp" style={{ padding: '6px 8px', color: '#25D366' }}>
                          <MessageCircle size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); handleDelete(order.id); }} style={{ padding: '6px 8px', color: 'var(--error)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 60, textAlign: 'center', color: 'var(--grey-400)' }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selectedOrder && (
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 24, position: 'sticky', top: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: '16px' }}>Order #{selectedOrder.id}</h3>
                <button className="btn btn-ghost btn-sm" style={{ padding: 6 }} onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Customer</p>
                  <p style={{ fontWeight: 600 }}>{selectedOrder.customer_name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--grey-500)' }}>{selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && <p style={{ fontSize: '13px', color: 'var(--grey-500)' }}>{selectedOrder.customer_email}</p>}
                </div>

                <div>
                  <p style={{ fontSize: '11px', color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Delivery Address</p>
                  <p style={{ fontSize: '13px' }}>{selectedOrder.shipping_address}</p>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Notes</p>
                    <p style={{ fontSize: '13px' }}>{selectedOrder.notes}</p>
                  </div>
                )}

                <div>
                  <p style={{ fontSize: '11px', color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Items</p>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: '1px solid var(--grey-100)' }}>
                      <div>
                        <p style={{ fontWeight: 600 }}>{item.product?.name || `Product #${item.product_id}`}</p>
                        <p style={{ color: 'var(--grey-400)', fontSize: '12px' }}>{item.size} · {item.color} · ×{item.quantity}</p>
                      </div>
                      <p style={{ fontWeight: 600 }}>LKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', marginTop: 12 }}>
                    <span>Total</span>
                    <span>LKR {selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm" onClick={() => handleWhatsApp(selectedOrder)}
                    style={{ flex: 1, background: '#25D366', color: 'white', border: 'none' }}>
                    <MessageCircle size={14} /> WhatsApp
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(selectedOrder.id)}
                    style={{ color: 'var(--error)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
