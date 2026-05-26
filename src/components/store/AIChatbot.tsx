'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Leaf } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: "Namaste! 👋 I am your Ayu Assistant. Ask me anything about our organic wellness products, handmade crafts, or how to place your order!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    // 1. Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Format history for API request
      const formattedMessages = messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Add the latest user message
      formattedMessages.push({
        role: 'user',
        content: userText,
      });

      // 3. Request `/api/chat` route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: formattedMessages }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        throw new Error(data.error || 'Invalid API response');
      }
    } catch (error) {
      console.error('Failed to communicate with chat API:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I apologize, but I am experiencing connectivity issues. 😔 Please try again shortly or feel free to contact us directly at +91 8209940507!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
                <span className="text-[10px] text-brand-200 font-medium font-sans">Ayurveda expert adviser</span>
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
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm font-sans ${
                    msg.sender === 'user'
                      ? 'bg-brand-700 text-white rounded-tr-none font-normal'
                      : 'bg-white text-brand-900 border border-beige-200 rounded-tl-none font-normal'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Bouncing Dots Loading Animation */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-beige-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-beige-200 flex items-center gap-2">
            <input
              type="text"
              disabled={isLoading}
              placeholder={isLoading ? "Please wait..." : "Ask: 'Which oil is good for hair fall?'"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-beige-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/40 text-xs sm:text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-brand-700 hover:bg-brand-850 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
