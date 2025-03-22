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
import {
  FaLeaf,
  FaShoppingCart,
  FaTruck,
  FaStar,
  FaMinus,
  FaPlus,
  FaChevronRight,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import LoadingSpinner from "../../../../app/components/LoadingSpinner/LoadingSpinner";
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
  length: number;
  width: number;
  height: number;
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);

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

        // Limit to maximum 4 related products
        setRelatedProducts(related.slice(0, 4));
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
              length: product.length,
              width: product.width,
              height: product.height,
            },
          })
        );
        setIsAddedToCart(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        router.push("/sepet");
      }
    } catch (error) {
      console.error("Error fetching user data or adding to cart:", error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const calculateDiscount = () => {
    if (product.discounted_price && product.discounted_price < product.price) {
      const discount =
        ((product.price - product.discounted_price) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const discountPercentage = calculateDiscount();
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div className="bg-gradient-to-r from-quaternary to-tertiary min-h-screen pb-12">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-8">
        <nav className="flex items-center text-sm font-medium text-white">
          <Link href="/" className="hover:text-background">
            Ana Sayfa
          </Link>
          <FaChevronRight className="mx-2 h-4 w-4 text-primary" />
          <Link href="/urunler" className="hover:text-background">
            Ürünler
          </Link>
          <FaChevronRight className="mx-2 h-4 w-4 text-primary" />
          <Link
            href={`/urunler/kategori/${product.category.id}`}
            className="hover:text-background"
          >
            {product.category.name}
          </Link>
          <FaChevronRight className="mx-2 h-4 w-4 text-primary" />
          <span className="text-background font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg animate-fadeIn flex items-center space-x-2">
          <MdVerified className="text-xl" />
          <p>Ürün sepete eklendi!</p>
        </div>
      )}

      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden px-4 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Product Image */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={product.images?.[selectedImage]?.url || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-full">
                  %{discountPercentage} İndirim
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {hasMultipleImages && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`relative w-20 h-20 border rounded-md overflow-hidden flex-shrink-0 ${
                      selectedImage === index
                        ? "border-green-600 ring-2 ring-green-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image.url || "/placeholder.png"}
                      alt={`${product.name} - Görsel ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:w-1/2 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar className="text-gray-300" />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                4.0 (28 değerlendirme)
              </span>
            </div>

            <div className="flex items-center space-x-4 my-4">
              {product.discounted_price !== null &&
              product.discounted_price !== undefined &&
              product.discounted_price > 0 &&
              product.discounted_price < product.price ? (
                <>
                  <p className="text-3xl font-bold text-gray-900">
                    {product.discounted_price.toFixed(0)} ₺
                  </p>
                  <p className="text-xl line-through text-gray-400">
                    {product.price.toFixed(0)} ₺
                  </p>
                </>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {product.price.toFixed(0)} ₺
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 10 ? (
                <div className="flex items-center text-green-600">
                  <MdVerified className="mr-2" />
                  <span className="font-medium">Stokta Mevcut</span>
                </div>
              ) : product.stock > 0 ? (
                <div className="text-orange-500 font-medium">
                  Son {product.stock} ürün!
                </div>
              ) : (
                <div className="text-red-600 font-medium">Stokta Yok</div>
              )}
            </div>

            {/* Dimensions */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Ürün Boyutları
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-gray-500">En</span>
                  <span className="font-medium">{product.width} cm</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-500">Boy</span>
                  <span className="font-medium">{product.height} cm</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-500">Uzunluk</span>
                  <span className="font-medium">{product.length} cm</span>
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity === 1}
                  aria-label="Azalt"
                >
                  <FaMinus className="h-3 w-3" />
                </button>
                <span className="px-6 py-2 text-lg font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity === product.stock}
                  aria-label="Artır"
                >
                  <FaPlus className="h-3 w-3" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:bg-gray-400 ${
                  isAddedToCart ? "bg-green-700" : ""
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

            {/* Shipping Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <FaTruck className="text-green-600 text-xl" />
                <div>
                  <p className="font-medium text-gray-900">Ücretsiz Kargo</p>
                  <p className="text-sm text-gray-600">
                    100₺ ve üzeri alışverişlerde geçerlidir
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Tahmini Teslimat:</span>
                <span className="font-medium text-gray-900">3-5 iş günü</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description and Benefits - Custom Tabs Implementation */}
      {/* Product Information Cards - New Approach without Tabs */}
      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span>Ürün Bilgileri</span>
          <div className="h-px bg-gray-200 flex-grow ml-4"></div>
        </h2>

        {/* Product Description Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transform transition-all hover:shadow-lg">
          <div className="bg-gradient-to-r from-green-600 to-green-500 py-4 px-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Ürün Açıklaması
            </h3>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600 shadow-sm">
                  <h4 className="font-medium text-green-800 mb-2">
                    Genel Bakış
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {product.name} hakkında özet bilgi ve kullanım alanları
                    aşağıda paylaşılmıştır.
                  </p>
                </div>

                {/* Product Badges */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      %100 Doğal İçerik
                    </span>
                  </div>

                  <div className="flex items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Uzman Onaylı
                    </span>
                  </div>

                  <div className="flex items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Kalite Garantili
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="prose max-w-none">
                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Benefits Card */}
        {healthBenefits.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transform transition-all hover:shadow-lg">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 py-4 px-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <FaLeaf className="mr-2" />
                Sağlığa Yararları
              </h3>
            </div>

            <div className="p-6 bg-gradient-to-b from-teal-50 to-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-lg shadow-sm border border-teal-100 hover:shadow-md transition-shadow flex"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-3">
                      <FaLeaf />
                    </div>
                    <div>
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center p-4 bg-teal-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-teal-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-gray-700">
                  Bu bilgiler genel bilgilendirme amaçlıdır ve tıbbi tavsiye
                  yerine geçmez. Herhangi bir sağlık sorununuz varsa, lütfen bir
                  sağlık uzmanına danışınız.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Information Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transform transition-all hover:shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Kullanım Bilgisi
            </h3>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-blue-50 rounded-lg p-4 mb-4 shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Önerilen Kullanım
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs font-bold">
                        1
                      </div>
                      <p className="text-sm text-gray-700">Düzenli kullanın</p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs font-bold">
                        2
                      </div>
                      <p className="text-sm text-gray-700">
                        Kuru yerde saklayın
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs font-bold">
                        3
                      </div>
                      <p className="text-sm text-gray-700">Talimatlara uyun</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-sm text-gray-700">
                      Çocukların ulaşamayacağı yerde saklayınız. Son kullanma
                      tarihinden sonra kullanmayınız.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-5">
                  <h4 className="font-medium text-blue-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Detaylı Kullanım Talimatları
                  </h4>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.how_to_use}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span>Benzer Ürünler</span>
            <div className="h-px bg-gray-200 flex-grow ml-4"></div>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/urunler/detaylar/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="relative pt-[100%]">
                    <Image
                      src={
                        relatedProduct.images?.[0]?.url || "/placeholder.png"
                      }
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {relatedProduct.discounted_price !== null &&
                      relatedProduct.discounted_price !== undefined &&
                      relatedProduct.discounted_price > 0 &&
                      relatedProduct.discounted_price <
                        relatedProduct.price && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          %
                          {Math.round(
                            ((relatedProduct.price -
                              relatedProduct.discounted_price) /
                              relatedProduct.price) *
                              100
                          )}{" "}
                          İndirim
                        </div>
                      )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="mt-auto">
                      <div className="flex items-center space-x-2">
                        {relatedProduct.discounted_price !== null &&
                        relatedProduct.discounted_price !== undefined &&
                        relatedProduct.discounted_price > 0 &&
                        relatedProduct.discounted_price <
                          relatedProduct.price ? (
                          <>
                            <p className="text-lg font-bold text-gray-900">
                              {relatedProduct.discounted_price.toFixed(0)} ₺
                            </p>
                            <p className="text-sm line-through text-gray-400">
                              {relatedProduct.price.toFixed(0)} ₺
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-gray-900">
                            {relatedProduct.price.toFixed(0)} ₺
                          </p>
                        )}
                      </div>
                      <div className="w-full mt-3 bg-gray-100 group-hover:bg-green-600 text-gray-700 group-hover:text-white px-4 py-2 rounded-lg font-medium transition duration-300 text-center">
                        Ürünü İncele
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl relative animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={closeModal}
              aria-label="Kapat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
              Sipariş vermek için giriş yapmalısınız
            </h2>

            <SignInPage isEmbedded />
          </div>
        </div>
      )}

      {/* Add to styles in global CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
