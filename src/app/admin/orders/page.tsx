'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Loader2, Phone, Calendar, RefreshCw, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { Order } from '@/types';

const STATUS_FILTERS = [
  { id: 'all', name: 'All Orders' },
  { id: 'Pending', name: 'Pending' },
  { id: 'Completed', name: 'Completed' },
  { id: 'Cancelled', name: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  async function loadOrders() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();

      if (res.ok && data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error('Failed to retrieve order history');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error accessing database');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const toastId = toast.loading(`Marking order as ${newStatus}...`);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Order successfully marked as ${newStatus}`, { id: toastId });
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o))
        );
      } else {
        toast.error(data.error || 'Failed to update order status', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network database connection error', { id: toastId });
    }
  };

  // Filter orders on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-700 animate-spin" />
        <p className="text-sm font-semibold text-brand-850">Opening customer order logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">Order Request Log</h1>
          <p className="text-xs sm:text-sm text-brand-850/60 mt-0.5">Track, complete, and contact buyers for WhatsApp checkout confirmations</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 border border-beige-200 hover:bg-beige-50 bg-white rounded-xl transition-all shadow-sm flex items-center space-x-2 text-brand-700 text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Reload Logs</span>
        </button>
      </div>

      {/* Filter and search parameters */}
      <div className="bg-white rounded-2xl border border-beige-200/60 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-850/40">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-beige-50/50 text-sm"
          />
        </div>

        {/* Status filtering pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={`px-4 py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all border cursor-pointer ${
                statusFilter === filter.id
                  ? 'bg-brand-700 border-brand-700 text-white shadow-sm'
                  : 'bg-beige-50 border-beige-200 text-brand-850 hover:bg-beige-100'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* List of Orders */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center text-xs sm:text-sm text-brand-850/50 bg-white border border-beige-200/60 rounded-2xl p-8 shadow-sm">
          No order records match your selected filters.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-beige-200/60 shadow-sm overflow-hidden flex flex-col hover-lift"
            >
              {/* Header inside order card */}
              <div className="p-4 sm:p-5 border-b border-beige-100 bg-beige-50/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-brand-900">{order.customerName}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    order.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : order.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-brand-850/50 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Items listing */}
              <div className="p-4 sm:p-5 flex-1 space-y-4">
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-lg bg-beige-50 overflow-hidden border border-beige-200/50 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-900">{item.name}</p>
                          <p className="text-[10px] text-brand-850/60 mt-0.5">
                            ₹{item.price} each
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-brand-850">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and interactions */}
                <div className="border-t border-beige-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xs text-brand-850/65 font-medium">Total Amount Due:</span>
                    <span className="text-lg font-black text-brand-700">₹{order.totalAmount}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* WhatsApp instant contact */}
                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/[\s+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-[#25D366]/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>

                    {order.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Completed')}
                          className="px-4 py-2 bg-brand-700 hover:bg-brand-850 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-brand-700/10"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
