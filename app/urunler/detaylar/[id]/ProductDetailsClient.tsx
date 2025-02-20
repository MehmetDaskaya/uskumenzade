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
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [healthBenefits, setHealthBenefits] = useState<string[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

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
      setIsModalOpen(true);
      return;
    }

    try {
      const userData = await fetchCurrentUser(accessToken);
      const userEmail = userData?.email;

      if (!isAddedToCart) {
        dispatch(
          addItemToCart({
            userId: userEmail,
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
        setIsAddedToCart(true);
      } else {
        router.push("/sepet");
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
    <div className="bg-secondary min-h-screen py-8 px-4 sm:px-8">
      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto bg-background rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Column - Product Image */}
          <div className="lg:w-1/2 p-6 flex justify-center items-center">
            <Image
              src={product.images?.[0]?.url || "/placeholder.png"}
              alt={product.name}
              width={600}
              height={600}
              className="object-contain rounded-lg"
              priority
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-6">
              {product.price !== product.discounted_price ? (
                <>
                  <p className="text-3xl font-semibold text-green-600">
                    {product.discounted_price.toFixed(0)} ₺
                  </p>
                  <p className="text-xl line-through text-gray-400">
                    {product.price.toFixed(0)} ₺
                  </p>
                </>
              ) : (
                <p className="text-3xl font-semibold text-green-600">
                  {product.price.toFixed(0)} ₺
                </p>
              )}
            </div>

            <p className="text-gray-600 mb-6">
              Stok:{" "}
              <span className="font-semibold text-green-600">
                {product.stock} adet kaldı
              </span>
            </p>

            {/* Quantity Controls */}
            <div className="flex items-center  space-x-4 mb-6">
              <div className="flex items-center bg-white rounded-lg">
                <button
                  onClick={decreaseQuantity}
                  className="px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-l-lg"
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  className="px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-r-lg"
                  disabled={quantity === product.stock}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ${
                  isAddedToCart ? "animate-pulse" : ""
                }`}
              >
                <FaShoppingCart className="inline-block mr-2" />
                {isAddedToCart
                  ? "Sepete Git"
                  : product.stock <= 0
                  ? "Ürün Tükenmiştir"
                  : "Sepete Ekle"}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Kargo Bilgisi
              </h3>
              <div className="flex items-center space-x-3">
                <FaTruck className="text-green-600 text-2xl" />
                <div>
                  <p className="font-semibold">Ücretsiz Kargo</p>
                  <p className="text-sm text-gray-600">
                    100₺ ve üzeri alışverişlerde geçerlidir.
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Yaklaşık Kargo Süresi:{" "}
                <span className="font-semibold">3-5 iş günü</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description and Benefits */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ürün Açıklaması
          </h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Health Benefits */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Sağlığa Yararları
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {healthBenefits.length > 0 ? (
              healthBenefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center bg-green-50 rounded-lg p-4"
                >
                  <FaLeaf className="text-green-600 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-600">
                Bu ürün için sağlık yararları mevcut değil.
              </p>
            )}
          </ul>

          {/* How to Use */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Nasıl Kullanılır
          </h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              {product.how_to_use}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Bunlar da hoşunuza gidebilir
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Image
                src={relatedProduct.images?.[0]?.url || "/placeholder.png"}
                alt={relatedProduct.name}
                width={300}
                height={200}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {relatedProduct.name}
                </h3>
                <p className="text-green-600 font-semibold mb-4">
                  {relatedProduct.discounted_price.toFixed(0)} ₺
                </p>
                <Link href={`/urunler/detaylar/${relatedProduct.id}`}>
                  <div className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300 text-center">
                    Ürünü Görüntüle
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6">
            {isLoggedIn && <SignInPage />}
          </div>
        </Modal>
      )}
    </div>
  );
}
