import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { isAuthenticated, authResponseError } from '@/lib/auth';

const FALLBACK_PRODUCTS = [
  {
    _id: 'fallback-1',
    name: 'Bhringraj Herbal Hair Oil',
    price: 299,
    category: 'Herbal',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
    description: '100% natural Ayurvedic hair growth oil formulated with premium Bhringraj extracts, Sesame, Amla, and organic cold-pressed oils.',
    slug: 'bhringraj-herbal-hair-oil',
    stock: 55, featured: true, visible: true,
    benefits: ['Stimulates Hair Growth', 'Reduces Hair Fall & Split Ends', 'Fights Dandruff & Dry Scalp', '100% Organic & Chemical-Free'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-2',
    name: 'Pure Organic Gulab Jal',
    price: 149,
    category: 'Gulab Jal',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop',
    description: 'Authentic steam-distilled premium Rose Water crafted from fresh wild roses. Natural skin toner.',
    slug: 'pure-organic-gulab-jal',
    stock: 75, featured: true, visible: true,
    benefits: ['100% Pure Steam Distilled', 'Natural Hydrating Toner', 'Restores Skin pH Balance', 'No Added Alcohol or Fragrances'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-3',
    name: 'Handcrafted Brass Kalash',
    price: 499,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=600&auto=format&fit=crop',
    description: 'Exquisitely handcrafted pure brass Kalash, decorated with traditional patterns by skilled local artisans.',
    slug: 'handcrafted-brass-kalash',
    stock: 25, featured: true, visible: true,
    benefits: ['Exquisite Handcrafted Design', '100% Pure Brass Construction', 'Highly Durable', 'Supports Local Rural Artisans'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-4',
    name: 'Aloe Vera & Neem Skincare Gel',
    price: 199,
    category: 'Herbal',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop',
    description: 'Refreshing multi-purpose gel combining pure organic Aloe Vera with anti-bacterial Neem benefits.',
    slug: 'aloe-vera-neem-skincare-gel',
    stock: 40, featured: false, visible: true,
    benefits: ['Soothes Inflamed Skin', 'Prevents Acne', 'Non-Greasy', 'All Skin Types'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-5',
    name: 'Handmade Terracotta Diya Set',
    price: 120,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=600&auto=format&fit=crop',
    description: 'Beautifully hand-painted clay terracotta Diyas. A box of 6 unique designs perfect for Diwali and festive decor.',
    slug: 'handmade-terracotta-diya-set',
    stock: 60, featured: true, visible: true,
    benefits: ['Eco-friendly Natural Clay', 'Beautifully Hand-painted', 'Reusable & Biodegradable', 'Traditional Festive Vibe'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

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
    // If database is unreachable, return fallback static products
    console.warn('Products API: DB connection failed, serving fallback products.', error?.message);

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase() || '';

    let filtered = FALLBACK_PRODUCTS.filter(p => p.visible);
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (q) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      products: filtered,
      pagination: {
        total: filtered.length,
        page: 1,
        limit: filtered.length,
        totalPages: 1,
      },
    });
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
