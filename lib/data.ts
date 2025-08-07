// lib/data.ts
import dbConnect from './mongodb';
import ProductModel, { ProductType } from '@/models/Product';

export type { ProductType as Product };

type ProductInput = Omit<ProductType, '_id' | 'id'>;

const serializeProduct = (doc: any): ProductType => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id.toString(),
    id: obj._id.toString(),
  };
};

export async function getProducts(): Promise<ProductType[]> {
  await dbConnect();
  const products = await ProductModel.find({}).lean();
  return products.map(p => ({ ...p, _id: p._id.toString(), id: p._id.toString() }));
}

export async function getProductById(id: string): Promise<ProductType | null> {
  await dbConnect();
  try {
    const product = await ProductModel.findById(id).lean();
    if (!product) return null;
    return { ...product, _id: product._id.toString(), id: product._id.toString() };
  } catch (error) {
    return null;
  }
}

export async function addProduct(productData: ProductInput): Promise<ProductType> {
  await dbConnect();
  const newProduct = await ProductModel.create(productData);
  return serializeProduct(newProduct);
}

export async function updateProduct(id: string, data: Partial<ProductInput>): Promise<ProductType | null> {
  await dbConnect();
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!updatedProduct) return null;
  return { ...updatedProduct, _id: updatedProduct._id.toString(), id: updatedProduct._id.toString() };
}

export async function deleteProduct(id: string): Promise<boolean> {
  await dbConnect();
  const result = await ProductModel.deleteOne({ _id: id });
  return result.deletedCount === 1;
}