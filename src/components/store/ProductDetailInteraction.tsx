'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Send, Plus, Minus, ShieldCheck, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductDetailInteractionProps {
  product: any;
}

const ProductDetailInteraction: React.FC<ProductDetailInteractionProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const isOutOfStock = product.stock <= 0;

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    if (val > product.stock) {
      toast.error(`Only ${product.stock} items left in stock`);
      return;
    }
    setQty(val);
  };

  const handleWhatsAppBuy = async () => {
    try {
      // 1. Submit order intent to local API first
      const orderItems = [{
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
      }];

      // Save order in background database trace
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Quick Buy Customer',
          customerPhone: '9100000000',
          items: orderItems,
          totalAmount: product.price * qty,
        }),
      });

      // 2. Open WhatsApp deep link with direct message
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
      const messageText = `Hi Ayu Herbal 👋\n\nI want to buy this product directly:\n📦 *${product.name}*\nQty: ${qty}\nPrice: ₹${product.price} each\n\n*Total:* ₹${product.price * qty}\n\nPlease confirm stock and share details!`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(messageText)}`;
      
      window.open(whatsappUrl, '_blank');
      toast.success('Redirecting to WhatsApp...');
    } catch (e) {
      console.error(e);
      toast.error('Failed to trigger buy flow');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stock availability banner */}
      <div>
        {isOutOfStock ? (
          <span className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
            Out of Stock
          </span>
        ) : product.stock < 10 ? (
          <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 animate-pulse">
            Only {product.stock} left in stock!
          </span>
        ) : (
          <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full border border-brand-200">
            In Stock & Ready to Ship
          </span>
        )}
      </div>

      {/* Quantity & Actions Block */}
      {!isOutOfStock && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-brand-900/60 uppercase tracking-wider">Quantity</span>
            <div className="flex items-center border border-beige-200 rounded-xl bg-white shadow-inner p-1">
              <button
                onClick={() => handleQtyChange(qty - 1)}
                className="p-1.5 hover:bg-beige-100 rounded-lg text-brand-700 hover:text-brand-950 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-brand-950 min-w-[24px] text-center">{qty}</span>
              <button
                onClick={() => handleQtyChange(qty + 1)}
                className="p-1.5 hover:bg-beige-100 rounded-lg text-brand-700 hover:text-brand-950 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Primary Buy Now - WhatsApp checkout */}
            <button
              onClick={handleWhatsAppBuy}
              className="flex-1 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer transform hover:-translate-y-0.5"
            >
              <Send className="w-4.5 h-4.5" />
              <span>Buy Now via WhatsApp</span>
            </button>

            {/* Local Shopping Cart Add */}
            <button
              onClick={() => addToCart(product, qty)}
              className="px-6 py-3.5 bg-brand-700 hover:bg-brand-850 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-700/10 cursor-pointer flex items-center justify-center space-x-2 text-sm"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      )}

      {/* Out of Stock visual fallback */}
      {isOutOfStock && (
        <div className="pt-2">
          <button
            disabled
            className="w-full py-3.5 bg-beige-200 text-brand-900/40 rounded-xl cursor-not-allowed font-semibold text-center text-sm"
          >
            Sold Out Temporary
          </button>
        </div>
      )}

      {/* Fast checkout security disclaimer */}
      <div className="border-t border-beige-200/80 pt-4 flex items-center space-x-3 text-xs text-brand-850/60 leading-relaxed font-sans">
        <ShieldCheck className="w-5 h-5 text-brand-700 flex-shrink-0" />
        <span>Secure WhatsApp order tracking. No credit cards or pre-payment required. Pay on delivery/confirm directly.</span>
      </div>
    </div>
  );
};

export default ProductDetailInteraction;
