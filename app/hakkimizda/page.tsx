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
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Hakkımızda</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Pamukdede Ailesi olarak 1953’ten beri doğanın şifalı bitkilerini
            modern dünyayla buluşturuyoruz. Sağlıklı yaşam yolculuğunuzda
            yanınızdayız.
          </p>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="container mx-auto py-16 px-4">
        <div className="container mx-auto py-10 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Image
                src="https://picsum.photos/seed/picsum/600/400"
                alt="Pamukdede Ailesi"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Biz Kimiz?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                1953’te dedemiz Hüseyin Bey’in kurduğu aktar işletmesinin
                mirasını 3. nesil olarak yaşatıyoruz. Geleneksel bilgiyle modern
                dünyayı birleştirerek, doğanın sunduğu şifalı bitkilerden ve
                doğal ürünlerden yararlanmayı kendimize misyon edindik.
              </p>
              <p className="text-lg text-gray-700">
                Bugün, uskumenzade.com üzerinden sizlere fitoterapi, alternatif
                tıp ve doğal sağlık yöntemleri konusunda bilimsel, güvenilir ve
                etkili bilgiler sunarken, aynı zamanda sağlığınızı destekleyecek
                ürünler sunuyoruz.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-8">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-lg text-gray-800 mb-4">
              Her zaman bilimsel verilere dayalı, şeffaf ve güvenilir bir
              şekilde hareket ediyoruz. Geliştirdiğimiz her ürün ve sunduğumuz
              her hizmet, sizin sağlığınızı ön planda tutarak tasarlanıyor.
            </p>
            <p className="text-lg text-gray-800">
              Bizim için işin özü; doğallık, güven ve insan sağlığı. Bu yüzden
              her adımımızı, attığımız her ürünü, paylaştığımız her bilgiyi, bu
              değerler üzerine inşa ediyoruz. Pamukdede Ailesi olarak geçmişten
              aldığımız ilhamla, geleceğe daha sağlıklı bir adım atmanızı
              sağlamak en büyük amacımız.
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

      <div className="bg-background min-h-screen">
        {/* Our Story Section */}

        {/* Mission and Vision Section */}
        <div className="bg-tertiary py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Misyonumuz ve Vizyonumuz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Misyonumuz
                </h3>
                <p className="text-lg text-gray-700">
                  Amacımız yalnızca ürün satmak değil, aynı zamanda insanlara
                  doğru, bilimsel ve güvenilir bilgiler sunarak sağlıklı yaşam
                  yolculuklarına katkıda bulunmaktır. İlk adımımızı bitkiler ve
                  yararlı tohumlar üzerine attık.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Vizyonumuz
                </h3>
                <p className="text-lg text-gray-700">
                  Bir sonraki adımda organik kozmetik ürünleri ve doğal kremler
                  üretmeyi planlıyoruz. Kimyasal içerikler yerine, doğanın
                  sunduğu en saf ve etkili malzemeleri kullanarak, cildinize
                  zarar vermeden en iyi bakımı sağlamayı hedefliyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="container mx-auto py-20 px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Doğallık
              </h3>
              <p className="text-lg text-gray-700">
                Doğanın en saf ve etkili malzemelerini kullanıyoruz.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Güven</h3>
              <p className="text-lg text-gray-700">
                Bilimsel verilere dayalı, şeffaf ve güvenilir bir şekilde
                hareket ediyoruz.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                İnsan Sağlığı
              </h3>
              <p className="text-lg text-gray-700">
                Geliştirdiğimiz her ürün, sizin sağlığınızı ön planda tutarak
                tasarlanıyor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      {/* <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-gray-900 font-bold text-center mb-12">
            Yolculuğumuz
          </h2>

          <div className="relative">
         
            <div className="absolute inset-0 left-1/2 transform -translate-x-1/2 w-1 bg-secondary"></div>

          
            <div className="space-y-12">
         
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
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold z-10">
                  2022
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>
             
              <div className="flex items-center justify-between w-full relative">
                <div className="w-1/2 pr-8"></div>
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold z-10">
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
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold z-10">
                  2024
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Testimonials Section */}
      <InfiniteMovingCards />

      {/* Call-to-Action Section */}
      <div className="bg-tertiary text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Bizimle Bu Yolculuğa Katılın
          </h2>
          <p className="text-lg mb-6">
            Doğanın en iyisini Üskümenzade ile deneyimleyin. Çay, yağ ve krem
            ürünlerimizi şimdi keşfedin.
          </p>
          <Link
            href="/urunler"
            className="bg-white text-tertiary px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Şimdi Alışveriş Yapın
          </Link>
        </div>
      </div>
    </div>
  );
}
