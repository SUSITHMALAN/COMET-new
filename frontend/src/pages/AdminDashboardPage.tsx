import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { usersApi, ordersApi } from '../api';
import { DashboardStats, Order } from '../types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([usersApi.getStats(), ordersApi.getAll()])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Revenue', value: `LKR ${stats.total_revenue.toLocaleString()}`, icon: DollarSign, color: '#22c55e', bg: '#dcfce7' },
    { label: 'Total Orders', value: stats.total_orders, icon: ShoppingBag, color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Products', value: stats.total_products, icon: Package, color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Customers', value: stats.total_users, icon: Users, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Pending Orders', value: stats.pending_orders, icon: Clock, color: '#ef4444', bg: '#fee2e2' },
  ] : [];

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '0.06em', marginBottom: 4 }}>
          DASHBOARD
        </h1>
        <p style={{ color: 'var(--grey-500)', fontSize: '14px' }}>
          Welcome back. Here's what's happening with COMET.
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={color} />
                  </div>
                  <TrendingUp size={14} color="var(--grey-300)" />
                </div>
                <div>
                  <p style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2 }}>{value}</p>
                  <p style={{ fontSize: '12px', color: 'var(--grey-500)', marginTop: 4, fontWeight: 500 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--grey-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Orders</h2>
              <Link to="/admin/orders" className="btn btn-ghost btn-sm">View all</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--grey-100)' }}>
                    {['Order ID', 'Customer', 'Phone', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--grey-500)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600 }}>#{order.id}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>{order.customer_name}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--grey-500)' }}>{order.customer_phone}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600 }}>LKR {order.total_amount.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge badge-${order.status}`}>{order.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--grey-400)' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--grey-400)', fontSize: '14px' }}>No orders yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
