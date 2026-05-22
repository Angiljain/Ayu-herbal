'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Authenticating admin...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Access granted! Welcome, Admin.', { id: toastId });
        router.push('/admin');
        router.refresh();
      } else {
        toast.error(data.error || 'Invalid credentials', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to authentication server', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-premium border border-beige-200 shadow-xl p-8 space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-brand-700 rounded-full flex items-center justify-center text-white mx-auto shadow-md shadow-brand-700/10">
            <Leaf className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-900">Admin Control</h1>
            <p className="text-xs uppercase tracking-widest font-bold text-brand-600 mt-0.5">Ayu Herbal System</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-900/60 uppercase tracking-wider">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-850/45">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-900/60 uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-850/45">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-850/45 hover:text-brand-900 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-700/10 flex items-center justify-center space-x-2 cursor-pointer mt-2 disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authorizing Portal...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs font-semibold text-brand-700 hover:text-brand-950 transition-colors"
          >
            ← Back to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
