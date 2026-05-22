'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, ClipboardList, LogOut, Store, Leaf, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // Client-side auth guard: verify JWT cookie on every protected admin page
  useEffect(() => {
    // If we are on the login page, don't check auth here, login page handles itself
    if (pathname === '/admin/login') {
      setAuthChecked(true);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/verify');
        if (!res.ok) {
          router.replace('/admin/login');
        } else {
          setAuthChecked(true);
        }
      } catch {
        router.replace('/admin/login');
      }
    }
    checkAuth();
  }, [router, pathname]);

  // If we are on the login page, just render the child login panel directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-brand-700 animate-spin" />
          <p className="text-sm font-semibold text-brand-850">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...');
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out successfully', { id: toastId });
        router.push('/admin/login');
        router.refresh();
      } else {
        toast.error('Logout failed', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error logging out', { id: toastId });
    }
  };

  const isLinkActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders Log', path: '/admin/orders', icon: ClipboardList },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-beige-50">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-900 text-white border-r border-brand-850 p-6 space-y-8 flex-shrink-0">
        {/* Branding header */}
        <Link href="/" className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 bg-brand-700 rounded-full flex items-center justify-center text-white">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">
              Ayu <span className="text-brand-300 font-medium">Admin</span>
            </span>
            <span className="text-[8px] uppercase tracking-widest text-brand-400 font-semibold block -mt-1">
              Mobile Control
            </span>
          </div>
        </Link>

        {/* Sidebar Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  active
                    ? 'bg-brand-700 text-white shadow-md'
                    : 'text-beige-200/70 hover:text-white hover:bg-brand-800'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer options */}
        <div className="space-y-2 pt-6 border-t border-brand-800">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-beige-200/50 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Go to Shop</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-all cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-brand-900 text-white py-4 px-6 flex items-center justify-between border-b border-brand-850 shadow-sm">
        <Link href="/admin" className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-brand-300" />
          <span className="text-base font-bold tracking-wider">Ayu Admin</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-beige-200/60 hover:text-white transition-colors">
            <Store className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Main Dashboard Workspace viewport */}
      <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* 4. Mobile Bottom Tab-Bar Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-beige-200 flex items-center justify-around py-2.5 px-4 shadow-lg rounded-t-3xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center space-y-1 transition-colors px-3 py-1 rounded-xl ${
                active ? 'text-brand-700 font-semibold' : 'text-brand-900/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
