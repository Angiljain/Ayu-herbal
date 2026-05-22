'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Leaf } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const CHAT_RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['hair', 'oil', 'hair fall', 'dandruff', 'hair loss', 'growth'],
    answer: "🌿 For hair fall, dandruff, and strengthening follicles, we highly recommend our **Bhringraj Herbal Hair Oil** (₹299)! It uses organic Bhringraj extracts, cold-pressed Sesame oil, and Amla. Customers report noticeable reduction in hair fall within weeks!"
  },
  {
    keywords: ['rose water', 'gulab jal', 'skin', 'toner', 'glow', 'acne'],
    answer: "🌹 For organic skin hydration, balanced pH, and a natural refreshing glow, our **Pure Organic Gulab Jal** (₹149) is perfect! It's 100% steam distilled from wild fresh roses and contains no artificial fragrance or alcohol. Great for acne-prone skin!"
  },
  {
    keywords: ['crafts', 'kalash', 'diya', 'handmade', 'puja', 'brass', 'terracotta'],
    answer: "🎨 We offer authentic traditional **Handmade Crafts** created by local rural artisans. Highlights include our **Handcrafted Brass Kalash** (₹499) for puja rituals and festive decor, and our hand-painted **Terracotta Clay Diya Set** (₹120)!"
  },
  {
    keywords: ['order', 'buy', 'checkout', 'pay', 'purchase', 'whatsapp'],
    answer: "💬 Ordering is extremely simple! Just add your favorite products to the **Shopping Bag** (cart), enter your name and phone, and click 'Order Instantly via WhatsApp'. Your order request will open directly in WhatsApp to confirm with us. No credit cards or pre-payment required!"
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'help', 'menu'],
    answer: "👋 Namaste! Welcome to Ayu Herbal support. I can recommend natural wellness products or traditional crafts for you! Try asking:\n- *Which oil is good for hair fall?*\n- *Do you have rose water?*\n- *How do I order?*"
  }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: "Namaste! 👋 I am your Ayu Herbal helper. Ask me anything about our organic oils, steam-distilled Gulab Jal, or handmade crafts!" }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // Predefined logic search matching keywords
    setTimeout(() => {
      const normalizedText = userText.toLowerCase();
      let matchedAnswer = "I couldn't quite match that question. We offer Bhringraj Hair Growth Oil, steam-distilled Rose Water, Brass Kalash, and hand-painted Clay Diyas! Feel free to ask about hair care, skin care, handmade crafts, or ordering!";

      for (const response of CHAT_RESPONSES) {
        const found = response.keywords.some(keyword => normalizedText.includes(keyword));
        if (found) {
          matchedAnswer = response.answer;
          break;
        }
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: matchedAnswer }]);
    }, 450);
  };

  return (
    <>
      {/* Floating Badge Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-brand-700 hover:bg-brand-950 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center cursor-pointer shadow-brand-700/30 border border-brand-500/20"
        title="Ask Ayu Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[340px] sm:max-w-[380px] h-[480px] bg-white border border-beige-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-fade-in font-sans">
          {/* Header */}
          <div className="bg-brand-700 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-brand-800 rounded-full flex items-center justify-center">
                <Leaf className="w-4.5 h-4.5 text-brand-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center">
                  <span>Ayu Assistant</span>
                </h4>
                <span className="text-[10px] text-brand-200 font-medium">Ayurveda expert adviser</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-brand-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-beige-50/45 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm font-light ${
                    msg.sender === 'user'
                      ? 'bg-brand-700 text-white rounded-tr-none'
                      : 'bg-white text-brand-900 border border-beige-200 rounded-tl-none font-normal'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-beige-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask: 'Which oil is good for hair fall?'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-beige-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/40 text-xs sm:text-sm"
            />
            <button
              type="submit"
              className="p-2 bg-brand-700 hover:bg-brand-850 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
