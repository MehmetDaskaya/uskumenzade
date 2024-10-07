// app/products/details/[id]/page.tsx
import { notFound } from "next/navigation";
import { products } from "../../../../util/mock/mockProducts";
import ProductDetailsClient from "./ProductDetailsClient";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  imageUrl: string;
  stock: number;
  benefits: string[];
  usage: string;
}

async function getProductById(id: number): Promise<Product | undefined> {
  const product = products.find((p) => p.id === id);
  if (!product) {
    notFound();
  }
  return product;
}

interface ProductDetailsPageProps {
  params: { id: string };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const productId = Number(params.id);
  const product = await getProductById(productId);

  if (!product) {
    return <p>Product not found</p>;
  }

  // Pass the product data to the client component
  return <ProductDetailsClient product={product} />;
}
