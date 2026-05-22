import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { ChevronRight, ArrowLeft, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import ProductDetailInteraction from '@/components/store/ProductDetailInteraction';
import ProductCard from '@/components/store/ProductCard';
import type { Metadata } from 'next';

export const revalidate = 0; // Dynamic updates

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate SEO Metadata dynamically for each product page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const product = await Product.findOne({ slug, visible: true });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Ayu Herbal`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Ayu Herbal`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  await dbConnect();

  // Find product
  const productDoc = await Product.findOne({ slug, visible: true });
  if (!productDoc) {
    notFound();
  }

  // Convert to plain object
  const product = {
    ...productDoc.toObject(),
    _id: productDoc._id.toString(),
    createdAt: productDoc.createdAt.toISOString(),
    updatedAt: productDoc.updatedAt.toISOString(),
  };

  // Fetch Category Recommendations (AI product suggestions)
  const recommendationDocs = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    visible: true,
  }).limit(4);

  const recommendations = recommendationDocs.map((doc) => {
    const p = doc.toObject();
    return {
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  });

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1. Breadcrumbs / Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-brand-850/60">
          <Link href="/" className="hover:text-brand-700 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-brand-700 transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-brand-900 truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-900 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* 2. Main Product Info Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white rounded-premium border border-beige-200/60 p-6 sm:p-8 md:p-12 shadow-sm">
        {/* Left Column: Premium Gallery Display */}
        <div className="relative aspect-square w-full bg-beige-50 rounded-2xl overflow-hidden shadow-inner border border-beige-200/40">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Right Column: Details & CTA */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-md inline-block">
              {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-brand-700">₹{product.price}</span>
              <span className="text-xs text-brand-850/50 line-through">₹{Math.round(product.price * 1.25)}</span>
              <span className="text-[10px] sm:text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 rounded-md px-2 py-0.5">
                Save 20%
              </span>
            </div>

            <p className="text-sm sm:text-base text-brand-850/75 leading-relaxed font-light font-sans">
              {product.description}
            </p>
          </div>

          {/* Benefits Section */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="space-y-3 bg-beige-100/55 rounded-2xl p-4 sm:p-5 border border-beige-200/40">
              <h3 className="text-xs sm:text-sm font-bold text-brand-900 tracking-wide uppercase flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-brand-700" />
                <span>Key Benefits & Features</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                {product.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-brand-850 font-medium">
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-700 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client Purchase Panel */}
          <ProductDetailInteraction product={product} />
        </div>
      </div>

      {/* 3. Category recommendations (AI choice matching) */}
      {recommendations.length > 0 && (
        <section className="space-y-6 pt-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-900 tracking-tight">Recommended for You</h2>
            <p className="text-sm text-brand-800/70 mt-1">Based on the {product.category} category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recommendations.map((rec) => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
