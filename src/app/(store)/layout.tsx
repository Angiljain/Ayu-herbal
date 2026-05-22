import React from 'react';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import { CartProvider } from '@/context/CartContext';
import { MessageCircle } from 'lucide-react';
import AIChatbot from '@/components/store/AIChatbot';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-beige-50">
        {/* Navigation Bar */}
        <Header />

        {/* Content Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Floating WhatsApp Action Button */}
        <a
          href="https://wa.me/918209940507?text=Hi%20Ayu%20Herbal%20%F0%9F%8D%83%20I%20have%20a%20question%20about%20your%20products."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center cursor-pointer shadow-[#25D366]/40"
          title="Chat with Ayu Herbal on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 animate-pulse" />
        </a>

        {/* Floating AI Chatbot assistant */}
        <AIChatbot />

        {/* Brand Footer */}
        <Footer />
      </div>
    </CartProvider>
  );
}
