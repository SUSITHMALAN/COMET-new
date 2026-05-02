import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store';
import { showToast } from '../hooks/useToast';
import { motion } from 'framer-motion';

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
    <main className="flex items-center justify-center min-h-screen px-8 pt-32 pb-32 night-sky">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mx-auto mb-8 shadow-glow-violet">
            <span className="text-white font-black text-2xl">C</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Join the Constellation</h1>
          <p className="text-base text-white/40">Create your COMET account</p>
        </div>

        <div className="rounded-3xl bg-surface border border-white/[0.06] p-10">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="text-xs text-white/30 mb-2 block font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="input-dark"
              />
            </div>

            <div>
              <label className="text-xs text-white/30 mb-2 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-dark"
              />
            </div>

            <div>
              <label className="text-xs text-white/30 mb-2 block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="input-dark pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-500 text-white py-4 rounded-xl font-semibold text-base tracking-wide shadow-glow-violet hover:from-violet-500 hover:to-violet-400 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/[0.06] text-center">
            <p className="text-sm text-white/30 mb-4">Already have an account?</p>
            <Link to="/login" className="text-base font-medium text-violet-400 hover:text-violet-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
