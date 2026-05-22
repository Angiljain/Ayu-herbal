'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Plus, Minus, Send, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Please provide name and phone number');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting order request...');

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      // 1. Submit to database for admin tracing
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: orderItems,
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit order');
      }

      toast.success('Order request recorded!', { id: toastId });

      // 2. Generate WhatsApp message & Redirect
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
      
      let itemDetails = '';
      cart.forEach((item, index) => {
        itemDetails += `\n📦 ${index + 1}. *${item.product.name}*\n   Qty: ${item.quantity} | Price: ₹${item.product.price} each`;
      });

      const messageText = `Hi Ayu Herbal 👋\n\nI want to place an order:\n${itemDetails}\n\n*Total Amount:* ₹${totalPrice}\n\n*Customer Details:*\n👤 *Name:* ${customerName}\n📞 *Phone:* ${customerPhone}\n\nPlease confirm my order!`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(messageText)}`;

      // Clear local cart
      clearCart();
      onClose();

      // Redirect user to WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay background */}
      <div
        className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out">
          <div className="h-full flex flex-col bg-beige-100 shadow-2xl border-l border-beige-200">
            {/* Header */}
            <div className="p-6 border-b border-beige-200 flex items-center justify-between bg-brand-700 text-white">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-lg font-semibold tracking-wide">Your Shopping Bag</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-brand-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-beige-200 rounded-full flex items-center justify-center text-brand-700">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brand-900">Your bag is empty</h3>
                    <p className="text-sm text-brand-800/70 mt-1">Add organic herbal products or handmade crafts to get started!</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-brand-700 text-white rounded-full font-medium hover:bg-brand-800 transition-colors shadow-md shadow-brand-700/10 text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex space-x-4 bg-white p-3 rounded-2xl shadow-sm border border-beige-200"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 bg-beige-50 rounded-xl overflow-hidden">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-brand-900 text-sm sm:text-base leading-tight">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-md inline-block mt-1">
                            {item.product.category}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-brand-800 text-sm sm:text-base">
                            ₹{item.product.price * item.quantity}
                          </span>
                          <div className="flex items-center border border-beige-200 rounded-full bg-beige-50">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="p-1 text-brand-700 hover:text-brand-900"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="p-1 text-brand-700 hover:text-brand-900"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart summary & Checkout details */}
            {cart.length > 0 && (
              <div className="border-t border-beige-200 bg-white p-6 rounded-t-3xl">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-semibold text-brand-900/70">Total Amount</span>
                  <span className="text-2xl font-bold text-brand-700">₹{totalPrice}</span>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-900/60 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-900/60 uppercase tracking-wider mb-1">
                      Your WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 mt-4 cursor-pointer hover:shadow-lg disabled:opacity-70 text-sm"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Order Instantly via WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
