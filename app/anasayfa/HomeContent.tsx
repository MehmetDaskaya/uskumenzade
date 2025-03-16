// src/components/HomeContent.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchDiscounts, Discount } from "@/app/api/discount/discountApi";
import { FlipWords, ProductListings } from "../../app/components";
import { Snackbar } from "../../app/components/Snackbar/Snackbar"; // Import Snackbar component

import LoadingSpinner from "../../app/components/LoadingSpinner/LoadingSpinner";

import {
  Carousel,
  Card,
} from "@/app/components/ui/AppleCardsCarousel/AppleCardsCarousel";

import { InfiniteMovingCards } from "../components/MovingCards/MovingCards";
import herbalTea from "@/public/images/herbal-tea.webp";
import herbalOil from "@/public/images/herbal-oil.webp";
import herbalCream from "@/public/images/herbal-cream.webp";
import { IoClose } from "react-icons/io5";

const words = ["Çaylar", "Kremler", "Yağlar"];

const ProductsContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"herbal-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Doğanın şifasını keşfedin: Üskümenzade&apos;nin bitkisel
                ürünleri.
              </span>{" "}
              Sağlıklı bir yaşam için doğal çözümler sunuyoruz. Çaylarımız,
              kremlerimiz ve yağlarımız, geleneksel bilgelik ve modern bilimin
              birleşimiyle hazırlanmıştır. Her bir ürün, sizin için özenle
              seçilmiş bitkilerden elde edilmiştir.
            </p>
            <div className="w-full flex justify-center mt-4">
              <Image
                src="/images/herbal-products.webp"
                alt="Üskümenzade Bitkisel Ürünler"
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Bitkisel Çaylar",
    title: "Bitkisel formüllü çaylarımızı keşfedin.",
    src: herbalTea,
    content: <ProductsContent />,
    link: "/blog",
  },
  {
    category: "Bitkisel Yağlar",
    title: "Bitkisel yağlarımızın faydalarını öğrenin.",
    src: herbalOil,
    content: <ProductsContent />,
    link: "/blog",
  },
  {
    category: "Bitkisel Kremler",
    title: "Doğal bitkisel kremlerimizin faydalarını keşfedin.",
    src: herbalCream,
    content: <ProductsContent />,
    link: "/blog",
  },
];

export default function HomeContent() {
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    // Simulate loading delay, or remove if actual loading required
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadDiscounts = async () => {
      if (!accessToken) {
        setIsGuest(true);
        setShowPopup(true);
        localStorage.setItem("lastPopupTime", Date.now().toString()); // Store the first appearance
        return;
      }

      try {
        const discounts = await fetchDiscounts(accessToken);
        const validDiscount = discounts.find(
          (discount) =>
            discount.is_active &&
            (discount.all_users ||
              (discount.eligible_users &&
                discount.eligible_users.includes(accessToken)))
        );

        if (validDiscount) {
          setDiscount(validDiscount);

          const lastPopupTime = localStorage.getItem("lastPopupTime");
          const currentTime = Date.now();

          if (
            !lastPopupTime ||
            currentTime - parseInt(lastPopupTime) >= 60000
          ) {
            setShowPopup(true);
            localStorage.setItem("lastPopupTime", currentTime.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch discounts:", error);
      }
    };

    const lastPopupTime = localStorage.getItem("lastPopupTime");
    const currentTime = Date.now();
    const initialDelay = !lastPopupTime ? 10000 : 60000; // First time: 10s, otherwise: 1 min

    setTimeout(() => {
      loadDiscounts();
    }, initialDelay);
  }, [accessToken]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const cards = data.map((card, index) => (
    <Card
      key={index}
      card={{
        ...card,
        src: { src: card.src.src },
        link: card.link ?? "#",
      }}
      index={index}
    />
  ));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSnackbar({ message: "Kod kopyalandı!", type: "success" });
    setTimeout(() => setSnackbar(null), 3000); // Hide snackbar after 3 seconds
  };

  return (
    <div className="bg-background  text-gray-900 font-sans relative">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full transform transition-all duration-300 scale-100 animate-popupSlideIn">
            {isGuest ? (
              <>
                <h3 className="text-xl font-bold text-primary">
                  İndirimleri Kaçırmayın!
                </h3>
                <p className="text-gray-700 my-2">
                  Aktif indirimlerimizden faydalanmak için giriş yapmalısınız.
                </p>
                <Link href="/giris">
                  <button className="mt-4 bg-secondary text-white px-4 py-2 rounded hover:bg-tertiary transition-transform transform hover:scale-105">
                    Giriş Yap
                  </button>
                </Link>
              </>
            ) : discount ? (
              <>
                <h3 className="text-xl font-bold text-primary">
                  Özel İndirim!
                </h3>
                <p className="text-gray-700 my-2">
                  Site içi satın alımlarınıza özel{" "}
                  <strong>%{discount.percentage_discount} indirim</strong>{" "}
                  kazandınız!
                </p>
                <p className="text-gray-900 font-bold bg-gray-200 p-2 rounded text-lg tracking-wider flex justify-between items-center">
                  {discount.code}
                  <button
                    onClick={() => handleCopyCode(discount.code)}
                    className="ml-3 px-3 py-1 bg-secondary text-white text-sm font-medium rounded hover:bg-tertiary transition-transform transform hover:scale-105"
                  >
                    Kodu Kopyala
                  </button>
                </p>
              </>
            ) : (
              <p className="text-gray-700">
                Şu an aktif bir indirim bulunmamaktadır.
              </p>
            )}

            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-transform transform hover:scale-110"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[40vh] sm:h-[80vh] flex items-center justify-center sm:justify-start px-4 sm:px-8"
        style={{ backgroundImage: "url('/images/teahero.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 sm:left-32 text-center sm:text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Üskümenzade
          </h2>
          <div className="text-xl sm:text-2xl text-white mt-4">
            Bitkisel <FlipWords className="text-white" words={words} /> Burada.
          </div>

          <div className="mt-6 sm:mt-8">
            <Link href="/urunler">
              <button className="bg-secondary hover:bg-tertiary text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                Ürünleri Gör
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="w-full h-full py-20">
        <h2 className="max-w-6xl pl-4 mx-auto text-xl md:text-4xl font-bold text-primary font-sans">
          Ürünlerimiz Hakkında Bilgi Edinin
        </h2>
        <Carousel items={cards} />
      </div>
      <div className="md:w-full bg-secondary">
        <ProductListings />
      </div>

      {/* 🌿 Mission & Values Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-12">
          🌿 Doğaya ve Size Bağlıyız
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              Üskümenzade olarak, doğadan gelen en iyiyi sizlerle buluşturmayı
              hedefliyoruz. %100 doğal içeriklerle hazırlanan ürünlerimizle,
              sağlığınızı destekliyor ve yaşamınıza doğallık katıyoruz.
            </p>
            <ul className="mt-6 space-y-3 text-lg text-gray-600">
              <li>✅ Organik & Doğal Hammaddeler</li>
              <li>✅ Çevre Dostu & Sürdürülebilir Üretim</li>
              <li>✅ Geleneksel & Modern Yöntemlerin Harmanı</li>
            </ul>
          </div>
          <div className="relative w-full flex justify-center mt-4">
            <Image
              src="/images/uskumenzade-doga.webp"
              alt="Üskümenzade Bitkisel Ürünler"
              width={400}
              height={400}
              className="object-contain relative z-0 rounded-lg shadow-lg w-[80%] md:w-[400px] h-auto"
            />
            <Image
              src="/images/uskumenzade-doga.webp"
              alt="Doğal ürünler"
              width={250}
              height={250}
              className="absolute bottom-[-20px] left-[0%] md:bottom-[-40px] md:left-[-40px] z-10 rounded-lg shadow-lg w-[40%] md:w-[250px] h-auto"
            />
          </div>
        </div>
      </section>

      <InfiniteMovingCards />

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}
