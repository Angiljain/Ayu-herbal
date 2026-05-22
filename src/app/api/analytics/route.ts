import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { isAuthenticated, authResponseError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return authResponseError();
    }

    await dbConnect();

    // 1. Order stats
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // 2. Sales sum
    const completedOrderList = await Order.find({ status: 'Completed' });
    const totalSales = completedOrderList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // 3. Product stats
    const totalProducts = await Product.countDocuments({});
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const featuredProducts = await Product.countDocuments({ featured: true });

    // 4. Category product distribution
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
        sales: {
          total: totalSales,
        },
        products: {
          total: totalProducts,
          outOfStock: outOfStockProducts,
          featured: featuredProducts,
        },
        categories: categories.map((cat) => ({
          name: cat._id,
          count: cat.count,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
