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
    <main className="container flex items-center justify-center py-20 fade-in min-h-[70vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-headline-xl text-white mb-4">JOIN THE FLEET</h1>
          <p className="text-on-surface-variant text-sm tracking-widest font-bold">CREATE YOUR COMET PROFILE</p>
        </div>

        <div className="bg-surface-container border-2 border-white/10 p-10">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-label-caps text-[10px] text-white">FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
                placeholder="JOHN DOE"
                required
                className="input-minimal w-full bg-surface-container-low"
              />
            </div>

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
                  minLength={6}
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
              {loading ? 'CREATING PROFILE...' : 'INITIALIZE ACCOUNT'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t-2 border-white/5 text-center">
            <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mb-4">
              ALREADY REGISTERED?
            </p>
            <Link to="/login" className="text-label-caps text-white hover:text-primary transition-colors border-b-2 border-primary pb-1">
              SIGN IN HERE
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
