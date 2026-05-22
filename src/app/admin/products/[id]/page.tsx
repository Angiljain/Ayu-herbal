'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setProduct(data.product);
        } else {
          toast.error(data.error || 'Failed to retrieve product profile');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network connection error');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-700 animate-spin" />
        <p className="text-sm font-semibold text-brand-850">Accessing product registers...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center text-sm font-semibold text-brand-850 bg-white border border-beige-200 rounded-2xl">
        Product not found or has been deleted.
      </div>
    );
  }

  return (
    <div className="py-4 animate-fade-in">
      <ProductForm initialData={product} />
    </div>
  );
}
