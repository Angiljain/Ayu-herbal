import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  featured: boolean;
  visible: boolean;
  benefits: string[];
  slug: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, default: 50, min: 0 },
    featured: { type: Boolean, default: false, index: true },
    visible: { type: Boolean, default: true, index: true },
    benefits: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not present
ProductSchema.pre('validate', function (this: any) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-alphanumeric chars
      .replace(/[\s_-]+/g, '-') // replace spaces/underscores with single hyphen
      .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
  }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
