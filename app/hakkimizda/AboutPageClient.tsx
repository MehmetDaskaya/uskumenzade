"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { InfiniteMovingCards } from "../components/MovingCards/MovingCards";
import { useState, ReactNode } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
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

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("inception");

  const timelineEvents = [
    {
      id: "inception",
      year: "1953",
      title: "Başlangıç",
      description:
        "Dedemiz Hüseyin Bey'in kurduğu aktar işletmesiyle yolculuğumuz başladı.",
      image: "/images/about-us-pamukdede.webp",
    },
    {
      id: "growth",
      year: "2010",
      title: "Gelenekten Moderne",
      description:
        "Geleneksel bilgileri modern üretim teknikleriyle birleştirdik.",
      image: "/images/about-us-growth.webp",
    },
    {
      id: "expansion",
      year: "2022",
      title: "Üskümenzade'nin Doğuşu",
      description:
        "Çaylarımız ve merhemlerimiz ile Üskümenzade markasını hayata geçirdik.",
      image: "/images/about-us-expansion.webp",
    },
    {
      id: "present",
      year: "2024",
      title: "Bugün",
      description:
        "Organik ürün yelpazemizi genişleterek daha fazla müşteriye ulaşıyoruz.",
      image: "/images/about-us-present.webp",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Hero Section - Parallax Effect */}
      <div className="relative h-[70vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-us-banner.webp"
            alt="Doğadan ilham"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="brightness-50"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
            <span className="block">Pamukdede Ailesi</span>
            <span className="text-yellow-400">1953&#39;ten Beri Sizinle</span>
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md font-light leading-relaxed max-w-3xl mx-auto">
            Doğanın şifalı bitkilerini modern dünyayla buluşturuyoruz. Sağlıklı
            yaşam yolculuğunuzda yanınızdayız.
          </p>
          <div className="mt-10">
            <Link href="#story">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-secondary rounded-full font-semibold text-lg shadow-lg hover:bg-opacity-90 transition duration-300"
              >
                Hikayemizi Keşfedin
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

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
                1953&#39;te dedemiz Hüseyin Bey&#39;in kurduğu aktar
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

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInWhenVisible>
            <div className="space-y-6 order-2 lg:order-1">
              <h3 className="text-3xl font-semibold text-gray-900">
                Değerlerimiz
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Her zaman bilimsel verilere dayalı, şeffaf ve güvenilir bir
                şekilde hareket ediyoruz. Geliştirdiğimiz her ürün ve sunduğumuz
                her hizmet, sizin sağlığınızı ön planda tutarak tasarlanıyor.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Bizim için işin özü;{" "}
                <span className="font-semibold text-secondary">
                  doğallık, güven ve insan sağlığı
                </span>
                . Bu yüzden her adımımızı, attığımız her ürünü, paylaştığımız
                her bilgiyi, bu değerler üzerine inşa ediyoruz. Pamukdede Ailesi
                olarak geçmişten aldığımız ilhamla, geleceğe daha sağlıklı bir
                adım atmanızı sağlamak en büyük amacımız.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-tertiary">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    % 100 Doğal
                  </h4>
                  <p className="text-gray-600">
                    Ürünlerimizde katkı maddesi kullanmıyoruz
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-tertiary">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    Sertifikalı
                  </h4>
                  <p className="text-gray-600">
                    Tüm üretim süreçlerimiz belgelidir
                  </p>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -bottom-4 -right-4 w-72 h-72 md:w-80 md:h-80 bg-tertiary rounded-lg -z-10"></div>
              <Image
                src="/images/about-us-production.webp" // Replace with your actual image
                alt="Üretim Sürecimiz"
                width={600}
                height={400}
                className="rounded-lg shadow-xl object-cover w-full h-[400px]"
              />
              <div className="absolute -top-8 -left-8 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-tertiary font-bold text-lg">
                  Kalite kontrolü
                </p>
                <p className="text-gray-600">Her aşamada titizlikle yapılır</p>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Mission and Vision Cards */}
      <div className="bg-tertiary/10 py-24">
        <div className="container mx-auto px-4 md:px-8">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative">
              <span className="relative inline-block">
                Misyonumuz ve Vizyonumuz
                <span className="absolute -bottom-4 left-0 right-0 h-1 bg-secondary rounded"></span>
              </span>
            </h2>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <FadeInWhenVisible>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="h-3 bg-secondary"></div>
                <div className="p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Misyonumuz
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Amacımız yalnızca ürün satmak değil, aynı zamanda insanlara
                    doğru, bilimsel ve güvenilir bilgiler sunarak sağlıklı yaşam
                    yolculuklarına katkıda bulunmaktır. İlk adımımızı bitkiler
                    ve yararlı tohumlar üzerine attık.
                  </p>

                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 text-secondary mr-2"
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
                      <span>Doğadan gelen en kaliteli bitkileri seçmek</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 text-secondary mr-2"
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
                      <span>
                        Geleneksel yöntemleri modern tekniklerle birleştirmek
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 text-secondary mr-2"
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
                      <span>Sağlıklı yaşama katkıda bulunmak</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </FadeInWhenVisible>

            <FadeInWhenVisible>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="h-3 bg-tertiary"></div>
                <div className="p-8">
                  <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Vizyonumuz
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Bir sonraki adımda organik kozmetik ürünleri ve doğal
                    kremler üretmeyi planlıyoruz. Kimyasal içerikler yerine,
                    doğanın sunduğu en saf ve etkili malzemeleri kullanarak,
                    cildinize zarar vermeden en iyi bakımı sağlamayı
                    hedefliyoruz.
                  </p>

                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 text-tertiary mr-2"
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
                      <span>Organik kozmetik ürünleri üretmek</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 text-tertiary mr-2"
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
                      <span>Doğal cilt bakımı çözümleri sunmak</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 text-tertiary mr-2"
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
                      <span>Uluslararası pazarda söz sahibi olmak</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto py-24 px-4 md:px-8">
        <FadeInWhenVisible>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative">
            <span className="relative inline-block">
              Değerlerimiz
              <span className="absolute -bottom-4 left-0 right-0 h-1 bg-secondary rounded"></span>
            </span>
          </h2>
        </FadeInWhenVisible>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-48 bg-yellow-500 relative">
              <Image
                src="/images/about-us-natural.webp"
                alt="Doğallık"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Doğallık
              </h3>
              <p className="text-gray-700">
                Doğanın en saf ve etkili malzemelerini kullanıyoruz. Tüm
                ürünlerimiz doğal kaynaklardan elde edilir ve kimyasal katkı
                maddesi içermez.
              </p>
              <div className="mt-6 w-12 h-1 bg-yellow-500"></div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-48 bg-green-500 relative">
              <Image
                src="/images/about-us-trust.webp"
                alt="Güven"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Güven</h3>
              <p className="text-gray-700">
                Bilimsel verilere dayalı, şeffaf ve güvenilir bir şekilde
                hareket ediyoruz. Müşterilerimizle kurduğumuz ilişki karşılıklı
                güvene dayanır.
              </p>
              <div className="mt-6 w-12 h-1 bg-green-500"></div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-48 bg-blue-500 relative">
              <Image
                src="/images/about-us-health.webp"
                alt="İnsan Sağlığı"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                İnsan Sağlığı
              </h3>
              <p className="text-gray-700">
                Geliştirdiğimiz her ürün, sizin sağlığınızı ön planda tutarak
                tasarlanıyor. Sağlıklı yaşama katkıda bulunmak en büyük
                hedefimizdir.
              </p>
              <div className="mt-6 w-12 h-1 bg-blue-500"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Timeline Section - Improved */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 md:px-8">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative">
              <span className="relative inline-block">
                Yolculuğumuz
                <span className="absolute -bottom-4 left-0 right-0 h-1 bg-secondary rounded"></span>
              </span>
            </h2>
          </FadeInWhenVisible>

          <div className="flex flex-col md:flex-row gap-8 mt-12">
            <div className="md:w-1/3">
              <div className="sticky top-24 space-y-2">
                {timelineEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setActiveTab(event.id)}
                    className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-300 ${
                      activeTab === event.id
                        ? "bg-secondary text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-bold text-2xl">{event.year}</div>
                    <div>{event.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:w-2/3">
              {timelineEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeTab === event.id ? 1 : 0,
                    height: activeTab === event.id ? "auto" : 0,
                  }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    activeTab === event.id ? "block" : "hidden"
                  }`}
                >
                  <div className="h-64 relative">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <div className="text-4xl font-bold">{event.year}</div>
                        <h3 className="text-2xl font-semibold">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16">
        <FadeInWhenVisible>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 relative">
            <span className="relative inline-block">
              Müşterilerimiz Ne Diyor?
              <span className="absolute -bottom-4 left-0 right-0 h-1 bg-secondary rounded"></span>
            </span>
          </h2>
        </FadeInWhenVisible>
        <InfiniteMovingCards />
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-tertiary to-secondary text-white py-24">
        <div className="container mx-auto text-center px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bizimle Bu Yolculuğa Katılın
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Doğanın en iyisini Üskümenzade ile deneyimleyin. Çay, yağ ve krem
              ürünlerimizi şimdi keşfedin.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/urunler"
                className="bg-white text-secondary px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 inline-block shadow-lg"
              >
                Ürünlerimizi Keşfedin
              </Link>
            </motion.div>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
}
