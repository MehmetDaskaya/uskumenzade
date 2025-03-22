"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchDiscounts, Discount } from "@/app/api/discount/discountApi";
import { FlipWords, ProductListings } from "../../app/components";
import { Snackbar } from "../../app/components/Snackbar/Snackbar";
import LoadingSpinner from "../../app/components/LoadingSpinner/LoadingSpinner";
import { InfiniteMovingCards } from "../components/MovingCards/MovingCards";
import herbalTea from "@/public/images/herbal-tea.webp";
import herbalOil from "@/public/images/herbal-oil.webp";
import herbalCream from "@/public/images/herbal-cream.webp";
import { Card } from "@/app/components/ui/AppleCardsCarousel/AppleCardsCarousel";
import { IoClose } from "react-icons/io5";
import { FaLeaf, FaShippingFast, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineHealthAndSafety, MdLocalOffer } from "react-icons/md";
import { RiPlantLine } from "react-icons/ri";

const words = ["Çaylar", "Kremler", "Yağlar"];

// Add this near your other constant declarations at the top of the file

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

const categories = [
  {
    name: "Bitkisel Çaylar",
    description: "Doğadan gelen lezzet ve sağlık",
    image: "/images/category-tea.webp",
    link: "/urunler/cay",
    icon: <RiPlantLine className="text-4xl text-primary" />,
  },
  {
    name: "Bitkisel Yağlar",
    description: "Cildinize doğal dokunuş",
    image: "/images/category-oil.webp",
    link: "/urunler/yag",
    icon: <FaLeaf className="text-4xl text-primary" />,
  },
  {
    name: "Bitkisel Kremler",
    description: "Doğal içeriklerle cilt bakımı",
    image: "/images/category-cream.webp",
    link: "/urunler/krem",
    icon: <MdOutlineHealthAndSafety className="text-4xl text-primary" />,
  },
];

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

export default function HomeContent() {
  const [loading, setLoading] = useState(true);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const newsletterRef = useRef<HTMLDivElement>(null);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const heroSlides = [
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
  ];

  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Simulate loading delay, or remove if actual loading required
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hasSeenPopupThisSession = sessionStorage.getItem("seenDiscountPopup");
    const lastPopupTime = localStorage.getItem("lastPopupTime");
    const currentTime = Date.now();

    // Delay only if popup hasn't been seen this session
    if (!hasSeenPopupThisSession) {
      const delay =
        !lastPopupTime || currentTime - parseInt(lastPopupTime) > 60000
          ? 15000 // Extended to 15s to give users time to explore first
          : 60000;

      const timer = setTimeout(async () => {
        try {
          if (!accessToken) {
            setIsGuest(true);
            setShowPopup(true);
            localStorage.setItem("lastPopupTime", currentTime.toString());
            sessionStorage.setItem("seenDiscountPopup", "true");
            return;
          }

          const discounts = await fetchDiscounts(accessToken);

          const eligibleDiscounts = discounts.filter((d) => {
            const isEligibleUser =
              d.all_users || d.eligible_users?.includes(accessToken || "");

            return d.is_active && isEligibleUser;
          });

          if (eligibleDiscounts.length > 0) {
            setDiscounts(eligibleDiscounts);
            setShowPopup(true);
            localStorage.setItem("lastPopupTime", currentTime.toString());
            sessionStorage.setItem("seenDiscountPopup", "true");
          }
        } catch (error) {
          console.error("Failed to fetch discounts:", error);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [accessToken]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSnackbar({ message: "Kod kopyalandı!", type: "success" });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setSnackbar({
        message: "Lütfen geçerli bir e-posta adresi girin",
        type: "error",
      });
      return;
    }

    // Here you would normally submit to your API
    setSnackbar({
      message: "Bültenimize başarıyla kaydoldunuz!",
      type: "success",
    });
    setEmailInput("");
  };

  const scrollToNewsletter = () => {
    newsletterRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-background text-gray-900 font-sans relative">
      {/* Discount Popup - Enhanced Version */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full relative overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-tertiary/20 rounded-full z-0" />

              {isGuest ? (
                <>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                  >
                    <MdLocalOffer className="text-5xl text-secondary mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      İndirimleri Kaçırmayın!
                    </h3>
                    <p className="text-gray-700 my-4 leading-relaxed">
                      Özel indirimlerimizden ve kampanyalarımızdan haberdar
                      olmak için hemen üye olun veya giriş yapın.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                      <Link href="/giris">
                        <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                          Giriş Yap
                        </button>
                      </Link>
                      <Link href="/uye-ol">
                        <button className="bg-white hover:bg-gray-100 text-secondary border border-secondary px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                          Üye Ol
                        </button>
                      </Link>
                    </div>
                    <button
                      onClick={scrollToNewsletter}
                      className="text-sm text-gray-500 hover:text-gray-700 underline mt-4 block mx-auto"
                    >
                      Veya bültenimize kaydolun
                    </button>
                  </motion.div>
                </>
              ) : discounts && discounts.length > 0 ? (
                <>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative z-10"
                  >
                    <div className="bg-tertiary/10 p-2 inline-block rounded-full mb-2">
                      <MdLocalOffer className="text-3xl text-tertiary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      Özel İndirimleriniz
                    </h3>
                  </motion.div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto px-1 custom-scrollbar relative z-10">
                    {discounts.map((d, index) => (
                      <motion.div
                        key={d.code}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="relative overflow-hidden group"
                      >
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                          <div className="flex items-center mb-3">
                            <div className="bg-secondary/10 rounded-full p-2 mr-3">
                              <span className="text-secondary font-bold">
                                {d.is_percentage
                                  ? `%${d.discount_value}`
                                  : `${d.discount_value}₺`}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-left">
                                {d.is_percentage
                                  ? `%${d.discount_value} İndirim`
                                  : `${d.discount_value}₺ İndirim`}
                              </h4>
                              <p className="text-xs text-gray-500 text-left">
                                Min. ₺{d.min_order_value} alışveriş
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="bg-white px-4 py-2 rounded-md border border-gray-200 border-dashed flex-1 mr-2">
                              <code className="text-gray-700 font-mono tracking-wider">
                                {d.code}
                              </code>
                            </div>
                            <button
                              onClick={() => handleCopyCode(d.code)}
                              className="bg-secondary hover:bg-tertiary text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                            >
                              Kopyala
                            </button>
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-tertiary/5 rounded-full transform translate-x-1/4 translate-y-1/4" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center relative z-10">
                    <button
                      onClick={() => {
                        setShowPopup(false);
                        localStorage.setItem(
                          "lastPopupTime",
                          Date.now().toString()
                        );
                      }}
                      className="bg-secondary hover:bg-tertiary text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 transform hover:scale-105"
                    >
                      Alışverişe Devam Et
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-700 relative z-10">
                  Şu an aktif bir indirim bulunmamaktadır.
                </p>
              )}

              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-full transition-colors duration-300 z-20"
                aria-label="Kapat"
              >
                <IoClose size={24} />
              </button>
            </motion.div>
          </motion.div>
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

      {/* Enhanced Benefits Section */}
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
                src="/images/family.webp" // Replace with your actual image
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
                1953'te dedemiz Hüseyin Bey'in kurduğu aktar işletmesinin
                mirasını 3. nesil olarak yaşatıyoruz. Geleneksel bilgiyle modern
                dünyayı birleştirerek, doğanın sunduğu şifalı bitkilerden ve
                doğal ürünlerden yararlanmayı kendimize misyon edindik.
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

      {/* Blog Section - Enhanced */}
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
            {/* Keep the original data and card mapping */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Enhanced Testimonials Section */}
      <section ref={testimonialsRef} className="py-16 bg-gray-50">
        <div className="mx-auto ">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ürünlerimizden memnun kalan müşterilerimizin yorumları
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={testimonialsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <InfiniteMovingCards />
          </motion.div>
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
