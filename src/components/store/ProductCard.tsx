'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: any; // Plain product object passed from server components
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-beige-200/60 overflow-hidden shadow-sm hover-lift flex flex-col h-full">
      {/* Product Image Link */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] bg-beige-50 overflow-hidden w-full">
        {/* Featured Tag */}
        {product.featured && (
          <span className="absolute top-3 left-3 z-10 bg-brand-700 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow">
            Best Seller
          </span>
        )}
        
        {/* Out of Stock Tag */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 bg-brand-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
              Sold Out
            </span>
          </div>
        )}

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          unoptimized
        />
      </Link>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] sm:text-xs font-semibold text-brand-700 tracking-wider uppercase block bg-brand-50 rounded-md py-0.5 px-2 w-max leading-none">
            {product.category}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-brand-900 text-sm sm:text-base line-clamp-1 group-hover:text-brand-700 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-brand-800/65 line-clamp-2 leading-relaxed font-light font-sans">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-xs text-brand-900/50 leading-none">Price</span>
            <span className="text-base sm:text-lg font-bold text-brand-700 mt-0.5">₹{product.price}</span>
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="p-2 sm:p-2.5 bg-beige-200 text-brand-900/40 rounded-xl cursor-not-allowed text-xs font-medium"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="p-2 sm:p-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl transition-all shadow-md shadow-brand-700/10 cursor-pointer flex items-center justify-center"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
