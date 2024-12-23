// app/urunler/detaylar/[id]/ProductDetailsClient.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/slices/cartSlice";
import { FaLeaf, FaShoppingCart, FaTruck } from "react-icons/fa";
import LoadingSpinner from "../../../../app/components/LoadingSpinner/LoadingSpinner";
import Modal from "../../../../app/components/Modal/Modal";
import CheckOutModalContent from "../../../../app/components/Modal/CheckOutModalContent";
import LoginModalContent from "../../../../app/components/Modal/LoginModalContent";

interface Product {
  id: string;
  name: string;
  price: number;
  discounted_price: number;
  description: string;
  images: { id: string; url: string }[];
  stock: number;
  health_benefits: string[];
  how_to_use: string;
}

interface ProductDetailsClientProps {
  product: Product;
  isLoggedIn: boolean;
}

export default function ProductDetailsClient({
  product,
  isLoggedIn,
}: ProductDetailsClientProps) {
  const dispatch = useDispatch(); // Redux dispatch

  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        discounted_price: product.discounted_price,
        imageUrl: product.images?.[0]?.url || "/placeholder.png",
        stock: product.stock,
        quantity: 1, // Add 1 item initially
      })
    );
    setIsAddedToCart(true);
    setIsModalOpen(false); // Ensure modal doesn't prevent the cart update
  };

  const closeModal = () => setIsModalOpen(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-yellow-500 min-h-screen py-8 px-8">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden rounded-t-3xl bg-gray-100">
        <Image
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          className="transition-transform duration-500 transform hover:scale-110"
        />
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 tracking-wide">
              {product.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-4">
                {product.name} Hakkında Bilgiler
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                {product.description}
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Sağlığa Yararları
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {product.health_benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 bg-green-50 rounded-lg p-3 shadow-sm"
                  >
                    <FaLeaf className="text-green-500 mr-3" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Nasıl Kullanılır
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {product.how_to_use}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                {product.name}
              </h2>
              <div className="flex items-center space-x-4 mb-6">
                <p className="text-3xl font-semibold text-yellow-500">
                  {product.discounted_price.toFixed(0)} ₺
                </p>
                <p className="text-xl line-through text-gray-400">
                  {product.price.toFixed(0)} ₺
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                Stok:{" "}
                <span className="font-semibold text-green-600">
                  {product.stock} adet kaldı
                </span>
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className={`w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center justify-center ${
                    isAddedToCart ? "animate-pulse" : ""
                  }`}
                >
                  <FaShoppingCart className="mr-2" />
                  {isAddedToCart ? "Sepette!" : "Sepete Ekle"}
                </button>
              </div>

              {/* Shipping Section */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Kargo Bilgisi
                </h3>
                <div className="flex items-center text-gray-700 mb-4">
                  <FaTruck className="text-green-500 mr-3 text-2xl" />
                  <div>
                    <p className="font-semibold">Ücretsiz Kargo</p>
                    <p className="text-sm">
                      100₺ ve üzeri alışverişlerde geçerlidir.
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Yaklaşık Kargo Süresi:{" "}
                  <span className="font-semibold">3-5 iş günü</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Bunlar da hoşunuza gidebilir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105"
              >
                <Image
                  src={product.images?.[0]?.url || "/placeholder.png"}
                  alt="Related Product"
                  width={300}
                  height={200}
                  layout="responsive"
                  className="object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-green-600 font-semibold mb-4">
                    {product.discounted_price.toFixed(0)} ₺
                  </p>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition duration-300">
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {isLoggedIn ? <CheckOutModalContent /> : <LoginModalContent />}
        </Modal>
      )}
    </div>
  );
}
