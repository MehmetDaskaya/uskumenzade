import Link from "next/link";
import { Product } from "../../mockData";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/urunler/${product.id}`}>
      <div className="border p-4 cursor-pointer hover:shadow-lg">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <h2 className="text-lg font-bold mt-4">{product.name}</h2>
        <p className="text-sm mt-2 text-gray-600">{product.description}</p>
        <p className="text-lg font-semibold mt-4">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};
