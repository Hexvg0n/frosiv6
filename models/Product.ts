// models/Product.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Definiuje podstawowe właściwości produktu
interface ProductBase {
  name: string;
  price: number;
  imageUrl: string;
  w2cLink: string;
  category: string; // Dodane pole kategorii
}

// Interfejs dokumentu Mongoose
export interface IProduct extends ProductBase, Document {}

// Czysty typ TypeScript, którego będziemy używać w aplikacji
export type ProductType = ProductBase & {
  _id: string;
  id: string;
};

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: [true, 'Please provide a product name.'] },
  price: { type: Number, required: [true, 'Please provide a price.'] },
  imageUrl: { type: String, required: [true, 'Please provide an image URL.'] },
  w2cLink: { type: String, required: [true, 'Please provide a W2C link.'] },
  category: { type: String, required: [true, 'Please provide a category.'] }, // Dodane pole do schematu
});

const ProductModel: Model<IProduct> = models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;