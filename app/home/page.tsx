// src/pages/home.tsx
import { FlipWords, ProductListings } from "../components";
import Image from "next/image";
import {
  Carousel,
  Card,
} from "@/app/components/ui/AppleCardsCarousel/AppleCardsCarousel";
import herbalTea from "@/public/images/herbal-tea.webp";
import herbalOil from "@/public/images/herbal-oil.webp";
import herbalCream from "@/public/images/herbal-cream.webp";
import Link from "next/link";

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
  },
  {
    category: "Bitkisel Yağlar",
    title: "Bitkisel yağlarımızın faydalarını öğrenin.",
    src: herbalOil,
    content: <ProductsContent />,
  },

  {
    category: "Bitkisel Kremler",
    title: "Doğal bitkisel kremlerimizin faydalarını keşfedin.",
    src: herbalCream,
    content: <ProductsContent />,
  },
];

export default function Home() {
  interface Card {
    src: { src: string };
    link?: string;
  }
  const cards = data.map((card, index) => (
    <Card
      key={index}
      card={{
        ...card,
        src: { src: card.src.src },
        link: (card as Card).link ?? "#",
      }}
      index={index}
    />
  ));
  return (
    <div className="bg-gray-50 text-gray-900 font-sans relative">
      <div className="leaf-decoration leaf-left"></div>
      <div className="leaf-decoration leaf-right"></div>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[40vh] sm:h-[80vh] flex items-center justify-center sm:justify-start px-4 sm:px-8"
        style={{ backgroundImage: "url('/images/teahero.png')" }}
      >
        {/* Add a pseudo-element for the dark overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 sm:left-32 text-center sm:text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Üskümenzade
          </h2>
          <div className="text-xl sm:text-2xl text-white mt-4">
            Bitkisel <FlipWords words={words} /> Burada.
          </div>

          <div className="mt-6 sm:mt-8">
            <Link href="/products">
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                Ürünleri Gör
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="w-full h-full py-20">
        <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-yellow-500  font-sans">
          Ürünlerimiz Hakkında Bilgi Edinin
        </h2>
        <Carousel items={cards} />
      </div>

      <ProductListings />
    </div>
  );
}
