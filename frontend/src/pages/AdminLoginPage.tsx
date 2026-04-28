import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store';
import { showToast } from '../hooks/useToast';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      const { access_token, user } = res.data;
      if (user.role !== 'admin') {
        showToast('Access denied. Admin only.', 'error');
        return;
      }
      setAuth(user, access_token);
      showToast('Welcome back, Admin!', 'success');
      navigate('/admin');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `radial-gradient(ellipse at 30% 40%, rgba(255,60,0,0.06) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', letterSpacing: '0.1em', color: 'var(--white)' }}>
            COMET<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <p style={{ color: 'var(--grey-500)', fontSize: '13px', marginTop: 8, letterSpacing: '0.08em' }}>
            ADMIN PORTAL
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--grey-900)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          border: '1px solid var(--grey-800)',
        }}>
          <h1 style={{ color: 'var(--white)', fontSize: '22px', fontWeight: 700, marginBottom: 32 }}>
            Sign in to your account
          </h1>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--grey-400)' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@comet.com"
                required
                className="form-input"
                style={{ background: 'var(--grey-800)', border: '1.5px solid var(--grey-700)', color: 'var(--white)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--grey-400)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                  style={{ background: 'var(--grey-800)', border: '1.5px solid var(--grey-700)', color: 'var(--white)', paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-500)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent"
              style={{ width: '100%', marginTop: 8, fontSize: '15px', padding: '14px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius)', fontSize: '12px', color: 'var(--grey-500)' }}>
            <strong style={{ color: 'var(--grey-400)' }}>Default credentials:</strong><br />
            admin@comet.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
