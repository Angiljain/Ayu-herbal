'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  MessageSquareCode,
  Loader2,
  RefreshCw,
  Phone,
  ExternalLink
} from 'lucide-react';
import { DashboardStats, Order } from '@/types';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadDashboardData() {
    try {
      const statsRes = await fetch('/api/analytics');
      const statsData = await statsRes.json();

      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();

      if (statsRes.ok && statsData.success && ordersRes.ok && ordersData.success) {
        setStats(statsData.stats);
        setRecentOrders(ordersData.orders || []);
      } else {
        toast.error('Failed to aggregate dashboard analytics');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string, newStatus: string) => {
    if (currentStatus === newStatus) return;

    const toastId = toast.loading(`Updating order status to ${newStatus}...`);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Order marked as ${newStatus}`, { id: toastId });
        // Update local list
        setRecentOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o))
        );
        // Refresh analytics numbers
        const statsRes = await fetch('/api/analytics');
        const statsData = await statsRes.json();
        if (statsRes.ok && statsData.success) setStats(statsData.stats);
      } else {
        toast.error(data.error || 'Failed to update status', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error updating status', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-700 animate-spin" />
        <p className="text-sm font-semibold text-brand-850">Opening administrative control panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Dashboard Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">System Terminal</h1>
          <p className="text-xs sm:text-sm text-brand-850/60 mt-0.5">Control Ayu Herbal store parameters and orders instantly</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 sm:px-4 sm:py-2 bg-white hover:bg-beige-100 border border-beige-200 rounded-xl transition-all shadow-sm flex items-center space-x-2 text-brand-700 text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Sync</span>
        </button>
      </div>

      {/* Grid Stats Counters */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-beige-200/60 p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-brand-850/60 uppercase tracking-wider block">Total Sales</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-900 mt-1 block">₹{stats.sales.total}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-beige-200/60 p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-brand-850/60 uppercase tracking-wider block">Pending Orders</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-900 mt-1 block">{stats.orders.pending}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-beige-200/60 p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-brand-850/60 uppercase tracking-wider block">Completed Orders</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-900 mt-1 block">{stats.orders.completed}</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-beige-200/60 p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-brand-850/60 uppercase tracking-wider block">Out of Stock</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-900 mt-1 block">{stats.products.outOfStock}</span>
            </div>
          </div>
        </div>
      )}

      {/* Categories & Product Health row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories count list */}
        <div className="bg-white rounded-2xl border border-beige-200/60 p-5 sm:p-6 shadow-sm space-y-4 md:col-span-1">
          <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider flex items-center space-x-2">
            <FolderOpen className="w-4 h-4 text-brand-700" />
            <span>Category Health</span>
          </h3>
          <hr className="border-beige-100" />
          {stats && stats.categories.length > 0 ? (
            <div className="space-y-3">
              {stats.categories.map((c) => (
                <div key={c.name} className="flex justify-between items-center text-sm font-medium">
                  <span className="text-brand-850/80">{c.name}</span>
                  <span className="bg-brand-50 text-brand-750 px-2.5 py-0.5 rounded-full border border-brand-100/50 font-bold text-xs">
                    {c.count} items
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-brand-850/50">No products uploaded yet</p>
          )}
        </div>

        {/* Order tracking logs */}
        <div className="bg-white rounded-2xl border border-beige-200/60 p-5 sm:p-6 shadow-sm space-y-4 md:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider flex items-center space-x-2">
              <MessageSquareCode className="w-4 h-4 text-brand-700" />
              <span>Real-time Order Requests</span>
            </h3>
            <hr className="border-beige-100" />

            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-brand-850/45">
                No orders requested by customers yet.
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[350px] pr-1">
                {recentOrders.slice(0, 10).map((order) => (
                  <div
                    key={order._id}
                    className="p-4 rounded-xl border border-beige-200/80 bg-beige-50/20 shadow-inner flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-brand-900 text-sm">{order.customerName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : order.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-brand-850/70">Phone: {order.customerPhone}</p>
                      
                      {/* Sub-item names */}
                      <div className="text-[11px] text-brand-800 font-medium">
                        Order:{' '}
                        {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-2.5">
                      <span className="font-black text-brand-700 text-sm">₹{order.totalAmount}</span>
                      
                      {/* Action buttons */}
                      <div className="flex items-center space-x-2">
                        {/* WhatsApp Action to chat */}
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[\s+]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg transition-colors cursor-pointer"
                          title="Contact on WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, order.status, 'Completed')}
                              className="px-2 py-1 bg-brand-700 hover:bg-brand-850 text-white rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, order.status, 'Cancelled')}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
