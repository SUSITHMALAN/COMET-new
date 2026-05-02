import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  LogOut, Menu, X, ChevronRight, Layers
} from 'lucide-react';
import { useAuthStore } from '../../store';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Stock', href: '/admin/stock', icon: Layers },
  { label: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--grey-100)' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 68 : 240,
        background: 'var(--black)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transition: 'width 0.25s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '20px 0' : '20px 20px',
          borderBottom: '1px solid var(--grey-800)',
          height: 68,
        }}>
          {!collapsed && (
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.1em', color: 'var(--white)' }}>
              COMET<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'var(--grey-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navItems.map(({ label, href, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                to={href}
                title={collapsed ? label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '12px 0' : '12px 20px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  color: active ? 'var(--white)' : 'var(--grey-500)',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--white)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--grey-500)'; }}
              >
                <Icon size={18} />
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div style={{ borderTop: '1px solid var(--grey-800)', padding: collapsed ? '16px 0' : '16px 20px' }}>
          {!collapsed && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)' }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--grey-500)' }}>{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'var(--grey-500)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '13px', width: '100%',
              padding: collapsed ? '8px 0' : '8px 0',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--grey-500)')}
          >
            <LogOut size={16} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: collapsed ? 68 : 240,
        flex: 1,
        transition: 'margin-left 0.25s ease',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
