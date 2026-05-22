import React from 'react';
import Link from 'next/link';
import { Leaf, Award, HeartHandshake, Sparkles, MessageCircle, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-900 text-beige-100 mt-auto border-t border-brand-800">
      {/* Trust Pillars Bar */}
      <div className="bg-brand-800/60 py-8 px-4 border-b border-brand-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Leaf className="w-6 h-6 text-brand-300" />
            <h4 className="font-semibold text-sm">100% Pure & Organic</h4>
            <p className="text-xs text-beige-200/70 max-w-[150px]">Authentic Ayurvedic ingredients only</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Award className="w-6 h-6 text-brand-300" />
            <h4 className="font-semibold text-sm">Premium Quality</h4>
            <p className="text-xs text-beige-200/70 max-w-[150px]">Carefully handpicked and sourced</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <HeartHandshake className="w-6 h-6 text-brand-300" />
            <h4 className="font-semibold text-sm">Handcrafted with Love</h4>
            <p className="text-xs text-beige-200/70 max-w-[150px]">Support local handmade crafts</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Sparkles className="w-6 h-6 text-brand-300" />
            <h4 className="font-semibold text-sm">WhatsApp Orders</h4>
            <p className="text-xs text-beige-200/70 max-w-[150px]">Instant checkout without hassle</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-white">
                <Leaf className="w-4.5 h-4.5" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">Ayu Herbal</span>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-beige-200/75 leading-relaxed">
              Discover natural skincare, authentic organic formulations, and exquisitely handcrafted decor items. 
              Our commitment is to bring wholesome wellness, ancient secrets, and artistic purity to your everyday life.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product Categories</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-beige-200/70">
              <li>
                <Link href="/products?category=Herbal" className="hover:text-brand-300 transition-colors">
                  Herbal Skincare & Oils
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gulab%20Jal" className="hover:text-brand-300 transition-colors">
                  Gulab Jal & Toners
                </Link>
              </li>
              <li>
                <Link href="/products?category=Handmade" className="hover:text-brand-300 transition-colors">
                  Handmade Crafts & Puja items
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Contact</h3>
            <p className="text-xs sm:text-sm text-beige-200/70 leading-relaxed mb-4">
              Jain Trading Company<br />
              Need help or custom orders? Reach out directly.
            </p>
            <ul className="space-y-3 mb-5">
              <li>
                <a
                  href="tel:+918209940507"
                  className="inline-flex items-center space-x-2 text-beige-200/80 hover:text-brand-300 transition-colors text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4 text-brand-300" />
                  <span>+91 8209940507</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:n2570201@gmail.com"
                  className="inline-flex items-center space-x-2 text-beige-200/80 hover:text-brand-300 transition-colors text-xs sm:text-sm"
                >
                  <Mail className="w-4 h-4 text-brand-300" />
                  <span>n2570201@gmail.com</span>
                </a>
              </li>
            </ul>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2 rounded-full font-medium transition-colors shadow shadow-brand-900/30 text-xs sm:text-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Us</span>
            </a>
          </div>
        </div>

        <div className="border-t border-brand-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-beige-200/50">
          <p>© {new Date().getFullYear()} Ayu Herbal (Jain Trading Company). All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/admin" className="hover:text-beige-200 transition-colors">
              Administrative Control Room
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
