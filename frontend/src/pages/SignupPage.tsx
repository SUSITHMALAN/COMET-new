import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store';
import { showToast } from '../hooks/useToast';

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
      await authApi.register({ name, email, password });
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
    <main className="container flex items-center justify-center py-32 animate-soft-fade min-h-[80vh]">
      <div className="w-full max-w-lg">
        <div className="text-center mb-16">
          <p className="text-label-caps text-primary tracking-[0.3em] mb-4">Onboarding</p>
          <h1 className="text-headline-lg mb-6">JOIN THE FLEET</h1>
          <p className="text-body text-[14px] opacity-60 max-w-xs mx-auto leading-relaxed">Create your profile to access early drops and archival technical gear.</p>
        </div>

        <div className="bg-surface p-12 rounded-[48px] border border-outline/10 shadow-sm">
          <form onSubmit={handleSignup} className="space-y-8">
            <div className="space-y-4">
              <label className="text-label-caps text-[10px] opacity-40 ml-4">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-surface-container-low border border-outline/10 rounded-full px-8 py-5 text-[14px] focus:outline-none focus:border-primary transition-all"
              />
            </div>

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
                  minLength={6}
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
              className="btn-pill btn-pill-primary w-full h-16 text-[13px] font-bold tracking-widest mt-6"
            >
              {loading ? 'CREATING PROFILE...' : 'INITIALIZE ACCOUNT'}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-outline/10 text-center">
            <p className="text-[11px] text-on-surface-variant opacity-40 font-medium tracking-widest uppercase mb-6">
              Already registered?
            </p>
            <Link to="/login" className="text-label-caps text-[11px] font-bold tracking-widest text-on-background hover:text-primary transition-all border-b border-primary/30 pb-1">
              SIGN IN HERE
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
