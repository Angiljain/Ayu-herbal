'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X, Leaf, ShieldCheck, HelpCircle } from 'lucide-react';
import CartDrawer from './CartDrawer';

const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-beige-200/50 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 bg-brand-700 rounded-full flex items-center justify-center text-white transition-transform group-hover:rotate-12 shadow-md shadow-brand-700/10">
                <Leaf className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-brand-700 flex items-center">
                  Ayu <span className="text-brand-900 font-medium ml-1">Herbal</span>
                </span>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest text-brand-600 font-semibold -mt-1">
                  Jain Trading Company
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-brand-700 border-b-2 border-brand-700 pb-1' : 'text-brand-900/70 hover:text-brand-700'
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`text-sm font-medium transition-colors ${
                  isActive('/products') ? 'text-brand-700 border-b-2 border-brand-700 pb-1' : 'text-brand-900/70 hover:text-brand-700'
                }`}
              >
                Products
              </Link>
              <Link
                href="/admin"
                className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100 hover:bg-brand-100 transition-colors"
              >
                Admin Panel
              </Link>
            </nav>

            {/* Interactive Actions */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-beige-100/80 hover:bg-beige-200/60 rounded-full transition-all text-brand-700 flex items-center justify-center cursor-pointer shadow-inner"
                aria-label="Open Cart"
              >
                <ShoppingCart className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-700 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-brand-700 hover:bg-beige-100 rounded-full transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-beige-100 border-b border-beige-200/80 py-4 px-6 animate-fade-in shadow-inner">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-semibold py-2 transition-colors ${
                  isActive('/') ? 'text-brand-700' : 'text-brand-900/70'
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-semibold py-2 transition-colors ${
                  isActive('/products') ? 'text-brand-700' : 'text-brand-900/70'
                }`}
              >
                Browse Products
              </Link>
              <hr className="border-beige-200" />
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center font-medium bg-brand-700 text-white py-2.5 rounded-xl transition-all shadow-md shadow-brand-700/10 text-sm"
              >
                Admin Control Room
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
