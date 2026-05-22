'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, Plus, Trash2, Save, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';

interface ProductFormProps {
  initialData?: Product;
}

const CATEGORIES = ['Herbal', 'Gulab Jal', 'Handmade Crafts'];

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Herbal');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('50');
  const [featured, setFeatured] = useState(false);
  
  // Image handling
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Benefits list
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');

  // Populate data on edit mode
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setCategory(initialData.category);
      setDescription(initialData.description);
      setStock(initialData.stock.toString());
      setFeatured(initialData.featured);
      setImageUrl(initialData.image);
      setBenefits(initialData.benefits || []);
    }
  }, [initialData]);

  // Image change handler (uploads directly to Cloudinary via local API)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading('Compressing & uploading image to Cloudinary...');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setImageUrl(data.url);
        toast.success('Image uploaded successfully!', { id: toastId });
      } else {
        toast.error(data.error || 'Failed to upload image', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error during image upload', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    if (benefits.includes(newBenefit.trim())) {
      toast.error('Benefit already exists');
      return;
    }
    setBenefits([...benefits, newBenefit.trim()]);
    setNewBenefit('');
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price || !description.trim() || !imageUrl) {
      toast.error('Please fill in all required fields and upload an image');
      return;
    }

    const payload = {
      name: name.trim(),
      price: Number(price),
      category,
      description: description.trim(),
      stock: Number(stock),
      featured,
      image: imageUrl,
      benefits,
    };

    const submitToastId = toast.loading(isEditing ? 'Updating product details...' : 'Creating new product item...');

    try {
      const endpoint = isEditing ? `/api/products/${initialData._id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(isEditing ? 'Product details updated!' : 'New product created!', { id: submitToastId });
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to save product', { id: submitToastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to the database', { id: submitToastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-white border border-beige-200/60 p-6 sm:p-8 rounded-premium shadow-sm">
      {/* 1. Header with navigation */}
      <div className="flex items-center justify-between border-b border-beige-100 pb-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="p-2 border border-beige-200 hover:bg-beige-50 rounded-xl transition-colors cursor-pointer text-brand-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="font-extrabold text-brand-900 text-lg sm:text-xl">
            {isEditing ? 'Edit Product Details' : 'Register New Product'}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* 2. Image Picker & Upload for Mobile */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-brand-900/60 uppercase tracking-wider block">Product Media *</label>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-36 border-2 border-dashed border-beige-200 rounded-2xl bg-beige-50 flex items-center justify-center overflow-hidden flex-shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
              ) : uploading ? (
                <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
              ) : (
                <ImageIcon className="w-8 h-8 text-brand-850/30" />
              )}
            </div>

            <div className="space-y-2 flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                {/* Take Photo or File Select Button */}
                <label className="px-5 py-3 border border-beige-200 hover:bg-beige-50 rounded-xl transition-all font-semibold text-xs sm:text-sm text-brand-900 flex items-center justify-center space-x-2 cursor-pointer shadow-sm">
                  <Camera className="w-4 h-4 text-brand-750" />
                  <span>Choose Photo / Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-brand-850/50 leading-relaxed max-w-sm">
                Supported formats: PNG, JPG, WEBP. Fits standard squares. Photos taken are automatically compressed for high performance on Android devices.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Fields form inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-brand-900/60 uppercase tracking-wider block">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Cold Pressed Sesame Hair Oil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-900/60 uppercase tracking-wider block">Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              placeholder="e.g. 299"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-900/60 uppercase tracking-wider block">Inventory Stock count</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-900/60 uppercase tracking-wider block">Category Segment *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm text-brand-950 font-medium cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3 pt-6 pl-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 rounded-lg text-brand-700 focus:ring-brand-500 border-beige-200 cursor-pointer"
            />
            <label htmlFor="featured" className="text-xs sm:text-sm font-semibold text-brand-900 cursor-pointer">
              Mark as Best Seller (Featured)
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-brand-900/60 uppercase tracking-wider block">Product Description *</label>
          <textarea
            required
            rows={4}
            placeholder="Provide a detailed Ayurvedic or handcraft story. Highlights source, pure properties, organic bases..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm leading-relaxed"
          />
        </div>

        {/* 4. Dynamic benefits array inputs */}
        <div className="space-y-3 bg-beige-100/50 rounded-2xl p-4 sm:p-5 border border-beige-200/40">
          <label className="text-xs font-bold text-brand-900 uppercase tracking-wider block">Product Benefits & Highlights</label>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="e.g. 100% steam distilled"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddBenefit();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddBenefit}
              className="px-4 py-2.5 bg-brand-700 hover:bg-brand-850 text-white rounded-xl font-bold transition-all shadow text-sm flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {benefits.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-beige-200/45">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-beige-200/50 px-3 py-2 rounded-xl text-xs sm:text-sm text-brand-950 font-medium"
                >
                  <span className="truncate max-w-[85%]">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(idx)}
                    className="p-1 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Submit Action */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3.5 bg-brand-700 hover:bg-brand-850 text-white font-bold rounded-xl transition-all shadow-md shadow-brand-700/10 flex items-center justify-center space-x-2 cursor-pointer mt-4"
        >
          <Save className="w-4.5 h-4.5" />
          <span>Save & Sync Catalog</span>
        </button>
      </div>
    </form>
  );
}
