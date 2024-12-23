// app/urunler/detaylar/[id]/page.tsx

import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
import { getProductById } from "../../../api/product/productApi"; // Update this path based on your file structure

// Fetch product from backend

interface ProductDetailsPageProps {
  params: { id: string };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  console.log("Product ID:", params.id);
  const productId = params.id;
  const product = await getProductById(productId);

  if (!product) {
    console.error("Product not found:", productId);
    notFound();
  }

  return <ProductDetailsClient product={product} isLoggedIn={true} />;
}
