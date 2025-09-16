"use client";

import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ProductListings } from "../../app/components";
import { Snackbar } from "../../app/components/Snackbar/Snackbar";
import herbalTea from "@/public/images/herbal-tea.webp";
import herbalOil from "@/public/images/herbal-oil.webp";
import herbalCream from "@/public/images/herbal-cream.webp";
import { Card } from "@/app/components/ui/AppleCardsCarousel/AppleCardsCarousel";

import { FaLeaf, FaShippingFast, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";

import { useDiscountModal } from "../hooks/useDiscountModal";
import { HomeDiscountModal } from "../components/Modal/HomeDiscountModal";
import { fetchBanners } from "@/app/api/banner/bannerApi";

const ProductsContent = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 leading-relaxed">
        Doğadan gelen şifalı bitkilerle hazırlanan ürünlerimiz hakkında detaylı
        bilgiler ve kullanım önerileri için blog yazılarımızı
        inceleyebilirsiniz.
      </p>
      <div className="flex items-center text-secondary">
        <span className="font-medium">Devamını Oku</span>
        <svg
          className="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </div>
    </div>
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const FadeInWhenVisible = ({ children }: { children: ReactNode }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  );
};

// USP - Unique Selling Propositions
const benefits = [
  {
    icon: <FaLeaf className="text-3xl" />,
    title: "100% Doğal İçerikler",
    description:
      "Tüm ürünlerimiz tamamen doğal ve organik içeriklerle hazırlanmaktadır.",
  },
  {
    icon: <MdOutlineHealthAndSafety className="text-3xl" />,
    title: "Sağlık Odaklı",
    description:
      "Ürünlerimiz sağlığınızı desteklemek için özenle formüle edilmiştir.",
  },
  {
    icon: <FaShippingFast className="text-3xl" />,
    title: "Hızlı Teslimat",
    description: "Siparişleriniz 24 saat içinde kargoya verilir.",
  },
];

export default function TestHomeContent() {
  const { showModal, modalType, discounts, isLoggedIn, dismissModal } =
    useDiscountModal();

  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [heroSlides, setHeroSlides] = useState<
    {
      image: string;
      title: string;
      subtitle: string;
      cta: string;
      link: string;
    }[]
  >([
    {
      image: "/images/hero1.webp",
      title: "Doğanın Şifası",
      subtitle: "Üskümenzade bitkisel çaylarıyla",
      cta: "Çayları Keşfet",
      link: "/urunler/cay",
    },
    {
      image: "/images/hero2.webp",
      title: "Sağlığınıza İyi Gelen",
      subtitle: "Doğal bitkisel ürünler",
      cta: "Çaylarımız Hakkında Bilgi Alın",
      link: "/blog",
    },
    {
      image: "/images/hero3.webp",
      title: "Geleneksel Tarifler",
      subtitle: "Modern bilimle buluşuyor",
      cta: "Hakkımızda",
      link: "/hakkimizda",
    },
  ]);

  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const loadBanners = async () => {
      try {
        // Remove token — assuming public access
        const banners = await fetchBanners(""); // public fetch (no token)

        console.log("🧠 Loaded banners:", banners);

        if (banners.length > 0) {
          const formatted = banners.map((b) => ({
            image: b.image?.url ?? "", // fallback if missing
            title: b.title,
            subtitle: b.description,
            cta: "Keşfet",
            link: b.href,
          }));

          setHeroSlides(formatted);
        } else {
          console.log("⚠️ No banners found, using static ones.");
        }
      } catch (err) {
        console.error("❌ Banner fetch error:", err);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSnackbar({ message: "Kod kopyalandı!", type: "success" });
    setTimeout(() => setSnackbar(null), 3000);
  };

  return (
    <div className="bg-background text-gray-900 font-sans relative">
      {/* Discount Popup - Enhanced Version */}
      <AnimatePresence>
        {showModal && (
          <HomeDiscountModal
            modalType={modalType}
            discounts={discounts}
            isLoggedIn={isLoggedIn}
            dismissModal={dismissModal}
            handleCopyCode={handleCopyCode}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Hero Section with Slideshow */}
      <section className="relative h-[85vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeHeroSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-20"></div>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center z-30">
              <div className="container mx-auto px-6">
                <motion.div
                  key={activeHeroSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-xl"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white mb-8">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.link}>
                    <button className="bg-secondary hover:bg-tertiary text-white font-medium py-3 px-8 rounded-full shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center">
                      {slide.cta}
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        ))}

        {/* Dots navigation */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeHeroSlide === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Öne Çıkan Ürünlerimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En çok tercih edilen doğal ürünlerimiz
            </p>
          </div>

          <ProductListings />
        </div>
      </section>

      {/* Our Story Section with Images */}
      <div id="story" className="container mx-auto py-20 px-4 md:px-8">
        <FadeInWhenVisible>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative">
            <span className="relative inline-block">
              Biz Kimiz?
              <span className="absolute -bottom-4 left-0 right-0 h-1 bg-secondary rounded"></span>
            </span>
          </h2>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInWhenVisible>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 md:w-80 md:h-80 bg-secondary rounded-lg -z-10"></div>
              <Image
                src="/images/family.png" // Replace with your actual image
                alt="Pamukdede Ailesi"
                width={600}
                height={400}
                className="rounded-lg shadow-xl object-cover w-full h-[400px]"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-secondary font-bold text-lg">
                  Üç nesil boyunca...
                </p>
                <p className="text-gray-600">Geleneksel bilgiyi yaşatıyoruz</p>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-gray-900">
                Geçmişten Geleceğe
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                1953&rsquo;te dedemiz Hüseyin Bey&rsquo;in kurduğu aktar
                işletmesinin mirasını 3. nesil olarak yaşatıyoruz. Geleneksel
                bilgiyle modern dünyayı birleştirerek, doğanın sunduğu şifalı
                bitkilerden ve doğal ürünlerden yararlanmayı kendimize misyon
                edindik.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Bugün,{" "}
                <span className="font-semibold text-secondary">
                  uskumenzade.com
                </span>{" "}
                üzerinden sizlere fitoterapi, alternatif tıp ve doğal sağlık
                yöntemleri konusunda bilimsel, güvenilir ve etkili bilgiler
                sunarken, aynı zamanda sağlığınızı destekleyecek ürünler
                sunuyoruz.
              </p>
              <div className="pt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary/10">
                    <svg
                      className="h-6 w-6 text-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Bilimsel Yaklaşım
                    </h4>
                    <p className="text-gray-600">
                      Her ürünümüz bilimsel verilerle desteklenir
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary/10">
                    <svg
                      className="h-6 w-6 text-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8 4-8-4m16 0v10l-8 4m-8-4V7m16 10l-8-4m0 0L4 17m8-4v10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Güvenilir Tedarik
                    </h4>
                    <p className="text-gray-600">
                      En kaliteli hammaddelerden üretim yapıyoruz
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Blog Yazılarımız
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Doğal ürünlerimiz hakkında bilgiler ve sağlıklı yaşam önerileri
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch">
              {data.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card
                    key={index}
                    card={{
                      ...card,
                      src: { src: card.src.src },
                      link: card.link ?? "#",
                    }}
                    index={index}
                  />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/blog">
                <button className="bg-white hover:bg-gray-100 text-secondary border-2 border-secondary font-medium py-3 px-8 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md flex items-center mx-auto">
                  Tüm Blog Yazılarını Görüntüle
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-tertiary/10 rounded-full -z-10 animate-pulse-slow"></div>
              <Image
                src="/images/uskumenzade-doga.webp"
                alt="Üskümenzade Doğal Ürünler"
                width={500}
                height={500}
                className="relative z-10 rounded-2xl shadow-lg object-cover"
              />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/10 rounded-full -z-10"></div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Doğaya ve Size Bağlıyız
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Üskümenzade olarak, doğadan gelen en iyiyi sizlerle buluşturmayı
                hedefliyoruz. %100 doğal içeriklerle hazırlanan ürünlerimizle,
                sağlığınızı destekliyor ve yaşamınıza doğallık katıyoruz.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaRegCheckCircle className="text-secondary text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Organik & Doğal Hammaddeler
                    </h3>
                    <p className="text-gray-600">
                      Tüm ürünlerimiz doğadan elde edilen organik hammaddeler
                      kullanılarak hazırlanmaktadır.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaRegCheckCircle className="text-secondary text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Çevre Dostu & Sürdürülebilir Üretim
                    </h3>
                    <p className="text-gray-600">
                      Üretim süreçlerimizde çevre dostu yöntemler kullanıyor,
                      doğaya saygılı bir yaklaşım benimsiyoruz.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaRegCheckCircle className="text-secondary text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Geleneksel & Modern Yöntemlerin Harmanı
                    </h3>
                    <p className="text-gray-600">
                      Yüzyıllardır süregelen geleneksel bilgiyi, modern bilimsel
                      yaklaşımlarla birleştiriyoruz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/hakkimizda">
                  <button className="bg-secondary hover:bg-tertiary text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center">
                    Daha Fazla Bilgi
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Benefits Section */}
      <section
        ref={benefitsRef}
        className="py-16 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Neden Üskümenzade?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Yüzyıllardır süregelen geleneksel bilgiyi, modern bilimle
              birleştiriyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center mb-6 text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Snackbar for notifications */}
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
