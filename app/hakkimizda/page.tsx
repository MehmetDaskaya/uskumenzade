import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { InfiniteMovingCards } from "../components/MovingCards/MovingCards";

export const metadata: Metadata = {
  title: "Hakkımızda - Uskumenzade",
  description:
    "Uskumenzade'nin yolculuğunu, misyonunu ve vizyonunu keşfedin. Doğadan gelen en iyileri çay, merhem ve kremlerle size nasıl sunduğumuzu öğrenin.",
  keywords: [
    "Uskumenzade",
    "Hakkımızda",
    "Çay",
    "Merhem",
    "Krem",
    "Doğal Ürünler",
    "Organik",
    "E-Ticaret",
  ],
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-yellow-500 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-lg">
            Özen ve gelenekle hazırlanan premium çaylar, doğal merhemler ve
            kremler için güvenilir kaynağınız.
          </p>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl text-gray-900 font-bold text-center mb-12">
          Sizin İçin Üskümenzade...
        </h2>
        <div className="flex flex-wrap md:flex-nowrap gap-8">
          <div className="w-full md:w-1/2">
            <Image
              src="https://picsum.photos/seed/picsum/600/400"
              alt="Üskümenzade, Sizin için"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-lg text-gray-800 mb-4">
              Uskumenzade olarak misyonumuz, doğal, sürdürülebilir ve yüksek
              kaliteli ürünlerle yaşam kalitenizi artırmaktır. En iyi çaylardan
              el yapımı merhem ve kremlere kadar her ürün, kaliteye olan
              bağlılığımızın bir yansımasıdır.
            </p>
            <p className="text-lg text-gray-800">
              Vizyonumuz, doğayı her eve daha yakın hale getirerek modern yaşam
              ile geleneksel çözümler arasında uyumlu bir denge sağlamaktır.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-8">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-lg text-gray-800 mb-4">
              Uskumenzade olarak misyonumuz, doğal, sürdürülebilir ve yüksek
              kaliteli ürünlerle yaşam kalitenizi artırmaktır. En iyi çaylardan
              el yapımı merhem ve kremlere kadar her ürün, kaliteye olan
              bağlılığımızın bir yansımasıdır.
            </p>
            <p className="text-lg text-gray-800">
              Vizyonumuz, doğayı her eve daha yakın hale getirerek modern yaşam
              ile geleneksel çözümler arasında uyumlu bir denge sağlamaktır.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src="https://picsum.photos/seed/picsum/600/400"
              alt="Üskümenzade, Sizin için"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-gray-900 font-bold text-center mb-12">
            Yolculuğumuz
          </h2>
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute inset-0 left-1/2 transform -translate-x-1/2 w-1 bg-yellow-500"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* Timeline Item */}
              <div className="flex items-center justify-between w-full relative">
                <div className="w-1/2 pr-8 text-right">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Başlangıç
                  </h3>
                  <p className="text-gray-600">
                    Uskumenzade, geleneksel çözümler ve en iyi çaylara olan
                    tutku ile küçük bir köyde kuruldu.
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold z-10">
                  2022
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>
              {/* Timeline Item */}
              <div className="flex items-center justify-between w-full relative">
                <div className="w-1/2 pr-8"></div>
                <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold z-10">
                  2023
                </div>
                <div className="w-1/2 pl-8">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Ulusal Büyüme
                  </h3>
                  <p className="text-gray-600">
                    Çaylarımız ve merhemlerimiz popülerlik kazandı ve ülke
                    çapında evlere ulaştı.
                  </p>
                </div>
              </div>
              {/* Timeline Item */}
              <div className="flex items-center justify-between w-full relative">
                <div className="w-1/2 pr-8 text-right">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Ürün Yelpazemizi Genişletiyoruz
                  </h3>
                  <p className="text-gray-600">
                    Çeşitli ihtiyaçlara hitap etmek için yeni doğal krem ve
                    organik çay serileri tanıttık.
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold z-10">
                  2024
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl text-gray-900 font-bold text-center mb-12">
          Ekibimizle Tanışın
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Member */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Image
              src="https://picsum.photos/seed/picsum/200/300"
              alt="Takım Üyesi"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl text-gray-800 font-semibold">Zeynep Kaya</h3>
            <p className="text-gray-500">Kurucu & Herbalist</p>
          </div>
          {/* Team Member */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Image
              src="https://picsum.photos/seed/picsum/200/300"
              alt="Takım Üyesi"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl text-gray-800 font-semibold">
              Mehmet Demir
            </h3>
            <p className="text-gray-500">Ürün Geliştirici</p>
          </div>
          {/* Team Member */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Image
              src="https://picsum.photos/seed/picsum/200/300"
              alt="Takım Üyesi"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl text-gray-800 font-semibold">Elif Yılmaz</h3>
            <p className="text-gray-500">Pazarlama Uzmanı</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <InfiniteMovingCards />

      {/* Call-to-Action Section */}
      <div className="bg-yellow-500 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Bizimle Bu Yolculuğa Katılın
          </h2>
          <p className="text-lg mb-6">
            Doğanın en iyisini Uskumenzade ile deneyimleyin. Çay, merhem ve krem
            koleksiyonumuzu şimdi keşfedin.
          </p>
          <Link
            href="/urunler"
            className="bg-white text-yellow-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Şimdi Alışveriş Yapın
          </Link>
        </div>
      </div>
    </div>
  );
}
