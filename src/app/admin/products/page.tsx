'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?showHidden=true&q=${search}&page=${page}&limit=6`);
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pagination.totalPages || 1);
      } else {
        toast.error('Failed to load catalog');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const searchDelay = setTimeout(() => {
      loadProducts();
    }, search ? 300 : 0);
    return () => clearTimeout(searchDelay);
  }, [search, page]);

  const handleToggleVisibility = async (product: Product) => {
    const updatedVisible = !product.visible;
    const toastId = toast.loading(`${updatedVisible ? 'Showing' : 'Hiding'} product in catalog...`);

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: updatedVisible }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Product is now ${updatedVisible ? 'visible' : 'hidden'}`, { id: toastId });
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, visible: updatedVisible } : p))
        );
      } else {
        toast.error(data.error || 'Failed to update visibility', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to communicate with DB', { id: toastId });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this product? This action is permanent.')) {
      return;
    }

    const toastId = toast.loading('Deleting product from catalog...');

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Product deleted successfully', { id: toastId });
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        toast.error(data.error || 'Failed to delete product', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error deleting product', { id: toastId });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">Product Catalog</h1>
          <p className="text-xs sm:text-sm text-brand-850/60 mt-0.5">Manage products visibility, stock logs and add new items</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-brand-700 hover:bg-brand-850 text-white px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Input Box */}
      <div className="relative bg-white p-3 rounded-2xl border border-beige-200/60 shadow-sm max-w-md">
        <span className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-brand-850/40">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Filter catalog by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
        />
      </div>

      {/* Grid of Products */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-brand-700 animate-spin" />
          <p className="text-sm font-semibold text-brand-850">Opening catalog archives...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-xs sm:text-sm text-brand-850/50 bg-white rounded-2xl border border-beige-200/60 p-8 shadow-sm">
          No products matched search or catalog is currently empty.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className={`bg-white rounded-2xl border border-beige-200/60 overflow-hidden shadow-sm flex flex-col justify-between hover-lift ${
                  !product.visible ? 'opacity-70 bg-beige-50/40' : ''
                }`}
              >
                {/* Product photo with visibility tag */}
                <div className="relative aspect-video w-full bg-beige-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                    unoptimized
                  />
                  {!product.visible && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                      Hidden from Store
                    </span>
                  )}
                  {product.featured && (
                    <span className="absolute top-3 right-3 bg-brand-700 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                      Best Seller
                    </span>
                  )}
                </div>

                {/* Body details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-md inline-block">
                      {product.category}
                    </span>
                    <h3 className="font-extrabold text-brand-900 text-base line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-4 pt-1 text-xs text-brand-850/60 font-semibold">
                      <span>Price: ₹{product.price}</span>
                      <span>•</span>
                      <span className={product.stock === 0 ? 'text-red-650' : ''}>
                        Stock: {product.stock} left
                      </span>
                    </div>
                  </div>

                  {/* Admin tools */}
                  <div className="flex items-center justify-between border-t border-beige-100 pt-3">
                    <button
                      onClick={() => handleToggleVisibility(product)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        product.visible
                          ? 'bg-brand-50 border border-brand-100 text-brand-700 hover:bg-brand-100'
                          : 'bg-red-50 border border-red-100 text-red-600 hover:bg-red-100'
                      }`}
                      title={product.visible ? 'Hide from Storefront' : 'Show on Storefront'}
                    >
                      {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="p-2 bg-beige-100 hover:bg-beige-200 border border-beige-200 text-brand-900 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 border border-beige-200 rounded-xl bg-white hover:bg-beige-50 disabled:opacity-40 disabled:hover:bg-white text-brand-900 transition-colors cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-brand-850/60">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 border border-beige-200 rounded-xl bg-white hover:bg-beige-50 disabled:opacity-40 disabled:hover:bg-white text-brand-900 transition-colors cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
