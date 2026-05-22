import dbConnect from './db';
import Product from '@/models/Product';

const SAMPLE_PRODUCTS = [
  {
    name: 'Bhringraj Herbal Hair Oil',
    price: 299,
    category: 'Herbal',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
    description: '100% natural Ayurvedic hair growth oil formulated with premium Bhringraj extracts, Sesame, Amla, and organic cold-pressed oils. Prevents hair fall, strengthens hair follicles, and helps reduce dandruff naturally.',
    stock: 55,
    featured: true,
    visible: true,
    benefits: ['Stimulates Hair Growth', 'Reduces Hair Fall & Split Ends', 'Fights Dandruff & Dry Scalp', '100% Organic & Chemical-Free'],
  },
  {
    name: 'Pure Organic Gulab Jal',
    price: 149,
    category: 'Gulab Jal',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop',
    description: 'Authentic steam-distilled premium Rose Water crafted from fresh wild roses. Natural skin toner that hydrates, balances pH levels, tightens pores, and gives an instant refreshing glow.',
    stock: 75,
    featured: true,
    visible: true,
    benefits: ['100% Pure Steam Distilled', 'Natural Hydrating Toner', 'Restores Skin pH Balance', 'No Added Alcohol or Fragrances'],
  },
  {
    name: 'Handcrafted Brass Kalash',
    price: 499,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=600&auto=format&fit=crop',
    description: 'Exquisitely handcrafted pure brass Kalash, decorated with traditional patterns by skilled local artisans. Perfect for puja rituals, home decor, festive occasions, and spiritual offerings.',
    stock: 25,
    featured: true,
    visible: true,
    benefits: ['Exquisite Handcrafted Design', '100% Pure Brass Construction', 'Highly Durable & Easy to Clean', 'Supports Local Rural Artisans'],
  },
  {
    name: 'Aloe Vera & Neem Skincare Gel',
    price: 199,
    category: 'Herbal',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop',
    description: 'Refreshing multi-purpose gel combining the soothing power of pure organic Aloe Vera with the anti-bacterial benefits of Neem. Heals acne, cools sunburnt skin, and hydrates deeply without grease.',
    stock: 40,
    featured: false,
    visible: true,
    benefits: ['Soothes Inflamed & Sunburnt Skin', 'Prevents & Heals Acne Breakouts', 'Light Non-Greasy Formulation', 'Suitable for All Skin Types'],
  },
  {
    name: 'Handmade Terracotta Diya Set',
    price: 120,
    category: 'Handmade Crafts',
    image: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=600&auto=format&fit=crop',
    description: 'Beautifully hand-painted clay terracotta Diyas. Prepared organically by local pottery artists using natural earth clay. A box of 6 unique designs perfect for Diwali, decorations, and spiritual rooms.',
    stock: 60,
    featured: true,
    visible: true,
    benefits: ['Eco-friendly Natural Clay', 'Beautifully Hand-painted Artwork', 'Reusable & Biodegradable', 'Brings Traditional Festive Vibe'],
  }
];

export async function seedProductsIfNeeded() {
  await dbConnect();
  const count = await Product.countDocuments({});
  if (count === 0) {
    console.log('No products found in DB. Seeding sample Ayu Herbal products...');
    await Product.insertMany(SAMPLE_PRODUCTS);
    console.log('Sample products seeded successfully.');
  }
}
