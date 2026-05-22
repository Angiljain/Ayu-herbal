'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/store/ProductCard';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', name: '🌿 All Products' },
  { id: 'Herbal', name: '💆 Herbal Oils' },
  { id: 'Gulab Jal', name: '🌹 Gulab Jal' },
  { id: 'Handmade Crafts', name: '🎨 Handmade Crafts' },
];

const SORTS = [
  { id: 'newest', name: 'Newest Arrivals' },
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
];

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch products from API on filter change
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          q: search,
          category,
          sort,
          page: page.toString(),
          limit: '8', // Paginated sizes
        });

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setProducts(data.products || []);
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.total || 0);
        } else {
          toast.error(data.error || 'Failed to load products');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network error loading products');
      } finally {
        setLoading(false);
      }
    }

    // Debounce search slightly to optimize performance on mobile
    const delayDebounce = setTimeout(() => {
      loadProducts();
    }, search ? 300 : 0);

    return () => clearTimeout(delayDebounce);
  }, [search, category, sort, page]);

  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    setPage(1);
  };

  const handleSortChange = (sortId: string) => {
    setSort(sortId);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-brand-900">Explore Catalog</h1>
        <p className="text-sm text-brand-800/70">
          Showing {totalCount} authentic Ayurvedic products and handmade crafts
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl border border-beige-200/60 p-4 sm:p-6 shadow-sm space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-800/40">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search products (e.g. hair oil, brass)..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
            />
          </div>

          <div className="flex items-center space-x-3">
            <SlidersHorizontal className="w-4 h-4 text-brand-800/50" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm text-brand-900 font-medium cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Pillbox */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all border cursor-pointer ${
                category === cat.id
                  ? 'bg-brand-700 border-brand-700 text-white shadow-sm'
                  : 'bg-beige-50 border-beige-200 text-brand-850 hover:bg-beige-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid Section */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-brand-700 animate-spin" />
          <p className="text-sm font-medium text-brand-850">Curating the finest organic items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-beige-200/60 p-8 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 bg-beige-200 rounded-full flex items-center justify-center text-brand-700 mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-950">No products match your criteria</h3>
            <p className="text-sm text-brand-800/70 mt-1">
              Try modifying your search text, selecting another category, or adjusting filters!
            </p>
          </div>
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
              setSort('newest');
            }}
            className="px-6 py-2 bg-brand-700 text-white rounded-full font-semibold hover:bg-brand-800 transition-colors shadow shadow-brand-700/10 text-xs sm:text-sm cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Mobile-first 2 columns, tablet 3, desktop 4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Component */}
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

              <div className="flex items-center space-x-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                      page === p
                        ? 'bg-brand-700 border-brand-700 text-white shadow-sm'
                        : 'bg-white border-beige-200 text-brand-900 hover:bg-beige-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

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
