// app/urunler/detaylar/[id]/ProductDetailsClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addItemToCart } from "@/redux/slices/cartSlice";
import { getProducts } from "@/app/api/product/productApi";
import { fetchCurrentUser } from "@/app/api/auth/authApi";
import { getHealthBenefits } from "@/app/api/benefits/benefitsApi";
import { FaLeaf, FaShoppingCart, FaTruck } from "react-icons/fa";
import LoadingSpinner from "../../../../app/components/LoadingSpinner/LoadingSpinner";
import Modal from "../../../../app/components/Modal/Modal";
import Link from "next/link";

import SignInPage from "@/app/giris/page";

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
  category: {
    id: string;
    name: string;
  };
}

interface ProductDetailsClientProps {
  product: Product;
  isLoggedIn: boolean;
}

interface Benefit {
  item_id: string;
  benefit: string;
}

export default function ProductDetailsClient({
  product,
  isLoggedIn,
}: ProductDetailsClientProps) {
  const router = useRouter();

  const dispatch = useDispatch(); // Redux dispatch
  const [quantity, setQuantity] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [healthBenefits, setHealthBenefits] = useState<string[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken); // Move useSelector here

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

    // Fetch health benefits
    const fetchHealthBenefits = async () => {
      try {
        const benefits: Benefit[] = await getHealthBenefits(0, 1000);
        const productBenefits = benefits.filter(
          (benefit) => benefit.item_id === product.id
        );
        setHealthBenefits(productBenefits.map((b) => b.benefit));
      } catch (error) {
        console.error("Failed to fetch health benefits:", error);
      }
    };

    fetchHealthBenefits();

    return () => clearTimeout(timer);
  }, [product.id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const products = await getProducts(0, 1000);
        let related = products.filter(
          (p: Product) =>
            p.category.id === product.category.id && p.id !== product.id
        );

        if (related.length === 0) {
          related = products.filter((p: Product) => p.id !== product.id);
        }

        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!accessToken) {
      // If no access token, open the login modal
      setIsModalOpen(true);
      return;
    }

    try {
      // Fetch the current user to get the email
      const userData = await fetchCurrentUser(accessToken);
      const userEmail = userData?.email;

      if (!isAddedToCart) {
        dispatch(
          addItemToCart({
            userId: userEmail, // Use email as the unique identifier
            item: {
              id: product.id,
              name: product.name,
              price: product.price,
              discounted_price: product.discounted_price,
              imageUrl: product.images?.[0]?.url || "/placeholder.png",
              stock: product.stock,
              quantity,
            },
          })
        );
        setIsAddedToCart(true); // Mark as added to cart
      } else {
        router.push("/sepet"); // Navigate to cart
      }
    } catch (error) {
      console.error("Error fetching user data or adding to cart:", error);
    }
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

              {/* Health Benefits Section */}
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Sağlığa Yararları
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {healthBenefits.length > 0 ? (
                  healthBenefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-700 bg-green-50 rounded-lg p-3 shadow-sm"
                    >
                      <FaLeaf className="text-green-500 mr-3" />
                      <span>{benefit}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-600">
                    Bu ürün için sağlık yararları mevcut değil.
                  </p>
                )}
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
              <div className="flex items-center space-x-4 justify-between mb-6">
                <button
                  onClick={decreaseQuantity}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
                  disabled={quantity === product.stock}
                >
                  +
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center justify-center ${
                    isAddedToCart ? "animate-pulse" : ""
                  }`}
                >
                  <FaShoppingCart className="mr-2" />
                  {isAddedToCart
                    ? "Sepete Git"
                    : product.stock <= 0
                    ? "Ürün Tükenmiştir"
                    : "Sepete Ekle"}
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
        <div className="bg-white mt-6 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Bunlar da hoşunuza gidebilir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105"
              >
                <Image
                  src={relatedProduct.images?.[0]?.url || "/placeholder.png"}
                  alt={relatedProduct.name}
                  width={300}
                  height={200}
                  layout="responsive"
                  className="object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-green-600 font-semibold mb-4">
                    {relatedProduct.discounted_price.toFixed(0)} ₺
                  </p>
                  <Link href={`/urunler/detaylar/${relatedProduct.id}`}>
                    <div className="w-full bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition duration-300 text-center block">
                      Ürünü Görüntüle
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="max-w-sm max-h-[540px] w-full h-full mx-auto rounded-lg shadow-lg overflow-hidden">
            {isLoggedIn && <SignInPage />}
          </div>
        </Modal>
      )}
    </div>
  );
}
