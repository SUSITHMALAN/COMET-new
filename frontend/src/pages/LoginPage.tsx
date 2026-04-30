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
    <main className="container flex items-center justify-center py-32 animate-soft-fade min-h-[80vh]">
      <div className="w-full max-w-lg">
        <div className="text-center mb-16">
          <p className="text-label-caps text-primary tracking-[0.3em] mb-4">Membership</p>
          <h1 className="text-headline-lg mb-6">SIGN IN</h1>
          <p className="text-body text-[14px] opacity-60 max-w-xs mx-auto leading-relaxed">Enter your credentials to access your archival collection.</p>
        </div>

        <div className="bg-surface p-12 rounded-[48px] border border-outline/10 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-4">
              <label className="text-label-caps text-[10px] opacity-40 ml-4">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-surface-container-low border border-outline/10 rounded-full px-8 py-5 text-[14px] focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-label-caps text-[10px] opacity-40 ml-4">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-container-low border border-outline/10 rounded-full px-8 py-5 text-[14px] focus:outline-none focus:border-primary transition-all pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-background transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-pill-primary w-full h-16 text-[13px] font-bold tracking-widest mt-4"
            >
              {loading ? 'AUTHENTICATING...' : 'SECURE SIGN IN'}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-outline/10 text-center">
            <p className="text-[11px] text-on-surface-variant opacity-40 font-medium tracking-widest uppercase mb-6">
              New to the fleet?
            </p>
            <Link to="/signup" className="text-label-caps text-[11px] font-bold tracking-widest text-on-background hover:text-primary transition-all border-b border-primary/30 pb-1">
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
