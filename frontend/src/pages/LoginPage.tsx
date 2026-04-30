import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store';
import { showToast } from '../hooks/useToast';

export default function LoginPage() {
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
      setAuth(user, access_token);
      showToast('Welcome back!', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container flex items-center justify-center py-20 fade-in min-h-[70vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-headline-xl text-white mb-4">SIGN IN</h1>
          <p className="text-on-surface-variant text-sm tracking-widest font-bold">ACCESS YOUR URBAN FRONTIER ACCOUNT</p>
        </div>

        <div className="bg-surface-container border-2 border-white/10 p-10">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-label-caps text-[10px] text-white">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="YOU@EXAMPLE.COM"
                required
                className="input-minimal w-full bg-surface-container-low"
              />
            </div>

            <div className="space-y-2">
              <label className="text-label-caps text-[10px] text-white">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-minimal w-full bg-surface-container-low pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-brutalist w-full py-4 text-sm"
            >
              {loading ? 'AUTHENTICATING...' : 'SECURE SIGN IN'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t-2 border-white/5 text-center">
            <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mb-4">
              NEW TO THE FLEET?
            </p>
            <Link to="/signup" className="text-label-caps text-white hover:text-primary transition-colors border-b-2 border-primary pb-1">
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
