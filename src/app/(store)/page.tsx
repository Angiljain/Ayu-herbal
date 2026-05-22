import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { seedProductsIfNeeded } from '@/lib/seed';
import { Leaf, ArrowRight, ShoppingBag, Gift, ShieldAlert, Sparkles } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

export const revalidate = 0; // Ensure fresh data on admin changes

export default async function HomePage() {
  // Automatically seed database on first visit if empty
  await seedProductsIfNeeded();

  await dbConnect();
  
  // Fetch featured products
  const rawFeaturedProducts = await Product.find({ featured: true, visible: true })
    .sort({ createdAt: -1 })
    .limit(4);

  // Convert Mongoose documents to plain objects for frontend serialization
  const featuredProducts = rawFeaturedProducts.map(doc => {
    const p = doc.toObject();
    return {
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  });

  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-premium bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white shadow-2xl py-16 px-6 sm:px-12 md:py-24 md:px-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
            alt="Organic leaf background"
            fill
            className="object-cover"
          />
        </div>

        {/* Brand visual leaf graphic */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-brand-700/60 px-4 py-1.5 rounded-full border border-brand-500/30 text-xs sm:text-sm font-semibold tracking-wide text-brand-300">
            <Sparkles className="w-4 h-4" />
            <span>100% Pure, Handcrafted & Organic</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-beige-100">
            Ancient Wellness,<br />
            <span className="text-brand-300">Handcrafted Purity.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-beige-200/90 leading-relaxed max-w-2xl font-light">
            Bring home authentic Ayurvedic herbal oils, refreshing steam-distilled Gulab Jal, and beautiful handmade crafts made by local rural artisans. Experience the gentle power of nature, optimized for your natural life.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href="/products"
              className="bg-beige-100 hover:bg-beige-200 text-brand-900 font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-brand-950/20 text-center flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Explore Products</span>
            </Link>
            <Link
              href="/products?category=Handmade%20Crafts"
              className="border border-brand-400 hover:bg-white/10 text-white font-medium px-8 py-3.5 rounded-xl transition-all text-center flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>Handmade Crafts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">Shop by Category</h2>
          <p className="text-sm text-brand-800/70">Pure natural formulations and rich traditional handmade decorations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Category 1 */}
          <Link
            href="/products?category=Herbal"
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-square md:aspect-[4/3] bg-brand-900 shadow-md hover-lift"
          >
            <Image
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop"
              alt="Herbal category"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent p-6 flex flex-col justify-end">
              <span className="text-white font-bold text-lg sm:text-xl flex items-center space-x-2">
                <span>Herbal Oils & Skincare</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </span>
              <p className="text-xs text-beige-200/75 mt-1 font-light">Hair growth oils, body balms & pure gel extracts</p>
            </div>
          </Link>

          {/* Category 2 */}
          <Link
            href="/products?category=Gulab%20Jal"
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-square md:aspect-[4/3] bg-brand-900 shadow-md hover-lift"
          >
            <Image
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop"
              alt="Gulab Jal category"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent p-6 flex flex-col justify-end">
              <span className="text-white font-bold text-lg sm:text-xl flex items-center space-x-2">
                <span>Gulab Jal & Toners</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </span>
              <p className="text-xs text-beige-200/75 mt-1 font-light">Steam distilled, authentic rose flower elixirs</p>
            </div>
          </Link>

          {/* Category 3 */}
          <Link
            href="/products?category=Handmade%20Crafts"
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-square md:aspect-[4/3] bg-brand-900 shadow-md hover-lift"
          >
            <Image
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop"
              alt="Handmade category"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent p-6 flex flex-col justify-end">
              <span className="text-white font-bold text-lg sm:text-xl flex items-center space-x-2">
                <span>Handmade Crafts</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </span>
              <p className="text-xs text-beige-200/75 mt-1 font-light">Brass kalash, festive diya sets & traditional decor</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">Best Sellers</h2>
            <p className="text-sm text-brand-800/70">Top recommended wellness choices and handcrafted arts</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-brand-700 hover:text-brand-900 flex items-center space-x-1.5 group cursor-pointer"
          >
            <span>See All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Why Choose Us / Info Banner */}
      <section className="bg-white/80 rounded-premium border border-beige-200/60 p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-700">
            <Leaf className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-brand-900 tracking-tight">Pure Herbal Formulations & Artisan Handmade Crafts</h3>
            <p className="text-sm sm:text-base text-brand-800/80 leading-relaxed font-light">
              At Ayu Herbal, we blend traditional secrets of Ayurveda with delicate artisan craftsmanship. 
              Our hair oils use cold-pressed bases and freshly harvested wild plants. 
              Our handmade products represent local arts passed down across generations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-brand-950">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-brand-700" />
              <span>Chemical-Free Oils</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-brand-700" />
              <span>Artisan-Empowered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-brand-700" />
              <span>Pure Distillations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-brand-700" />
              <span>Direct-to-WhatsApp Orders</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop"
            alt="Ayurveda beauty preparation"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>
    </div>
  );
}
