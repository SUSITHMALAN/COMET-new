import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store';
import { showToast } from '../hooks/useToast';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Register the user
      await authApi.register({ name, email, password });
      
      // 2. Automatically log them in after registration
      const loginRes = await authApi.login(email, password);
      const { access_token, user } = loginRes.data;
      
      setAuth(user, access_token);
      showToast('Account created successfully!', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      minHeight: 'calc(100vh - var(--nav-height) - 300px)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ color: 'var(--white)', fontSize: '28px', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
            CREATE ACCOUNT
          </h1>
          <p style={{ color: 'var(--grey-500)', fontSize: '14px', marginTop: 8 }}>
            Join us to manage your orders and get exclusive offers.
          </p>
        </div>

        <div style={{
          background: 'var(--grey-900)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          border: '1px solid var(--grey-800)',
        }}>
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--grey-400)' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="form-input"
                style={{ background: 'var(--grey-800)', border: '1.5px solid var(--grey-700)', color: 'var(--white)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--grey-400)' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                  minLength={6}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '14px', color: 'var(--grey-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--white)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
