import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/ui/Toast';
import AdminLayout from './components/admin/AdminLayout';
import PageWrapper from './components/layout/PageWrapper';
import { useAuthStore } from './store';

// Public pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Admin pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminStockPage from './pages/AdminStockPage';
import AdminUsersPage from './pages/AdminUsersPage';

// Protected route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

// Public layout wrapper
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><PageWrapper><HomePage /></PageWrapper></PublicLayout>} />
        <Route path="/shop" element={<PublicLayout><PageWrapper><ShopPage /></PageWrapper></PublicLayout>} />
        <Route path="/product/:id" element={<PublicLayout><PageWrapper><ProductDetailPage /></PageWrapper></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><PageWrapper><CartPage /></PageWrapper></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><PageWrapper><LoginPage /></PageWrapper></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><PageWrapper><SignupPage /></PageWrapper></PublicLayout>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="stock" element={<AdminStockPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toast />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
