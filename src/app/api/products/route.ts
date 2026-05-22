import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { isAuthenticated, authResponseError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '8', 10);
    const showHidden = searchParams.get('showHidden') === 'true';

    // Build query filter
    const query: any = {};

    // Only show visible products unless requested (and authorized)
    if (!showHidden) {
      query.visible = true;
    } else {
      const authorized = isAuthenticated(req);
      if (!authorized) {
        return authResponseError();
      }
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    // Build sorting parameters
    let sortOption: any = { createdAt: -1 }; // newest fallback
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    // Count and paginate
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return authResponseError();
    }

    await dbConnect();
    const body = await req.json();

    const { name, price, category, image, description, stock, featured, benefits } = body;

    if (!name || !price || !category || !image || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required product fields' },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      category,
      image,
      description,
      stock: Number(stock || 50),
      featured: Boolean(featured),
      benefits: Array.isArray(benefits) ? benefits : [],
    });

    await newProduct.save();

    return NextResponse.json({
      success: true,
      product: newProduct,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
