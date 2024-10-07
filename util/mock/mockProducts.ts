// Define the ProductWithStock type if it's not already defined globally
export type ProductWithStock =
  | {
      id: number;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      stock: number;
      benefits: string[];
      usage: string;
      oldPrice?: undefined;
    }
  | {
      id: number;
      name: string;
      price: number;
      oldPrice: number;
      description: string;
      imageUrl: string;
      stock: number;
      benefits: string[];
      usage: string;
    };

// Export the products array
export const products: ProductWithStock[] = [
  {
    id: 1,
    name: "Dragon Pearls",
    price: 200.0,
    description:
      "Dragon Pearls, genç yapraklardan ve tomurcuklardan elle yuvarlanarak hazırlanan bir çaydır. Tatlı ve çiçeksi bir aromaya sahiptir, yasemin çiçeklerinin tazeliğini anımsatır. Demlendiğinde, inciler açılır ve pürüzsüz, kokulu ve hafif tatlı bir tat bırakır. Rahatlama ve meditasyon anları için mükemmel bir çaydır.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/14.1.jpg?v=1710816273",
    stock: 10,
    benefits: [
      "Bağışıklık sistemini güçlendirir",
      "Sindirim sistemine iyi gelir",
      "Stres ve anksiyeteyi hafifletir",
      "Hücre yenilenmesine yardımcı olur",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 5-7 dakika demleyin. Günde 2-3 fincan içilmesi önerilir.",
  },
  {
    id: 2,
    name: "Eleifend Vitae",
    price: 220.0,
    description:
      "Eleifend Vitae, toprak ve maltımsı tadıyla bilinen güçlü bir siyah çaydır. Süt veya limon ile mükemmel uyum sağlar, sabah veya öğleden sonra için mükemmel bir seçimdir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/5.1.jpg?v=1710816268",
    stock: 5,
    benefits: [
      "Enerji seviyesini artırır",
      "Odaklanmayı ve konsantrasyonu iyileştirir",
      "Sindirim sistemine yardımcı olur",
    ],
    usage:
      "1 çay kaşığı çayı kaynamış suyla 4-5 dakika demleyin. Süt veya limonla tüketebilirsiniz.",
  },
  {
    id: 3,
    name: "Hao Oolong",
    price: 220.0,
    description:
      "Hao Oolong, yarı fermente edilmiş bir çay olup çiçeksi ve meyvemsi bir aromaya sahiptir. Tatlı baldan kavrulmuş fındığa kadar değişen karmaşık tat katmanları ile bilinir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/1.1.jpg?v=1710816260",
    stock: 8,
    benefits: [
      "Metabolizmayı hızlandırır",
      "Kolesterolü düşürmeye yardımcı olur",
      "Antioksidan açısından zengindir",
      "Stresle mücadele eder",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 4-6 dakika demleyin. İdeal sonuçlar için gün boyunca 2-3 fincan için.",
  },
  {
    id: 4,
    name: "Hong Pao",
    price: 210.0,
    oldPrice: 230.0,
    description:
      "Hong Pao, derin, kavrulmuş tadıyla ünlü bir oolong çayıdır. Karamel ve bitter çikolata notaları içerir. Wuyi Dağları'nın kayalık topraklarında yetiştirilen çay yaprakları, mineral açısından zengin bir tat sağlar.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/16.1.jpg?v=1710816236",
    stock: 15,
    benefits: [
      "Bağışıklık sistemini güçlendirir",
      "Sindirim sistemine iyi gelir",
      "Antioksidan açısından zengindir",
    ],
    usage:
      "1 çay kaşığı çayı kaynamış suyla 4-5 dakika demleyin. Sabah veya öğleden sonra tüketilmesi tavsiye edilir.",
  },
  {
    id: 5,
    name: "Iced Peach",
    price: 250.0,
    description:
      "Iced Peach, şeftalinin doğal tatlılığı ile yeşil çayın hafif ferahlığını birleştiren bir meyve çayıdır. Yaz günleri için mükemmeldir, buzlu olarak servis edilir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/11.1.jpg?v=1710816256",
    stock: 0,
    benefits: [
      "Hücre yenilenmesine yardımcı olur",
      "Serinletici ve ferahlatıcıdır",
      "Antioksidan içerir",
    ],
    usage:
      "2 çay kaşığı çayı kaynamış suyla 5-7 dakika demleyin. Buzla soğutarak servis edin.",
  },
  {
    id: 6,
    name: "Jin Xuan",
    price: 200.0,
    oldPrice: 220.0,
    description:
      "Jin Xuan, kremalı, tereyağlı tadıyla bilinen bir oolong çayıdır. Yüksek dağlarda yetişen bu çay, hafif tatlı bir dokuya sahiptir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/6.1.jpg?v=1710816252",
    stock: 7,
    benefits: [
      "Rahatlama sağlar",
      "Sindirim sistemine yardımcı olur",
      "Vücudu rahatlatır ve stresten arındırır",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 5-7 dakika demleyin. Gün boyunca tüketebilirsiniz.",
  },
  {
    id: 7,
    name: "Lan Gui Ren",
    price: 230.0,
    oldPrice: 250.0,
    description:
      "Lan Gui Ren, ginseng ve oolong çayının karışımıdır. Güçlü, tatlı bir aromaya ve sağlık açısından faydalarına sahiptir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/8.1.jpg?v=1710816246",
    stock: 12,
    benefits: [
      "Enerji seviyesini artırır",
      "Bağışıklık sistemini güçlendirir",
      "Ruh halini iyileştirir",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 5-7 dakika demleyin. Günde 2-3 fincan içilmesi önerilir.",
  },
  {
    id: 8,
    name: "Lan Yin",
    price: 230.0,
    oldPrice: 250.0,
    description:
      "Lan Yin, tatlı, çimen kokulu ve narin bir tada sahip canlı bir yeşil çaydır. Bu çay, doğal antioksidanları korumak için özenle işlenir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/12.1.jpg?v=1710816244",
    stock: 6,
    benefits: [
      "Antioksidan açısından zengindir",
      "Bağışıklık sistemini güçlendirir",
      "Zihinsel odaklanmayı iyileştirir",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 3-4 dakika demleyin. Günlük tüketim için uygundur.",
  },
  {
    id: 9,
    name: "Silver Needle",
    price: 300.0,
    description:
      "Silver Needle, en kaliteli beyaz çaylardan biridir. Çay bitkisinin açılmamış tomurcuklarından yapılır ve hafif, yumuşak bir tat sunar.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/9.1.jpg",
    stock: 20,
    benefits: [
      "Antioksidan kaynağıdır",
      "Bağışıklık sistemini güçlendirir",
      "Cilt sağlığını iyileştirir",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 3-5 dakika demleyin. Sabah veya öğleden sonra içilmesi önerilir.",
  },
  {
    id: 10,
    name: "Genmaicha",
    price: 180.0,
    description:
      "Genmaicha, kavrulmuş kahverengi pirinçle harmanlanmış geleneksel bir Japon yeşil çayıdır. Toprak ve hafif tatlı bir tada sahiptir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/10.1.jpg",
    stock: 14,
    benefits: [
      "Sindirim sistemine yardımcı olur",
      "Rahatlatıcıdır",
      "Antioksidanlar içerir",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 3-4 dakika demleyin. Yemeklerle birlikte içilmesi uygundur.",
  },
  {
    id: 11,
    name: "Earl Grey",
    price: 190.0,
    description:
      "Earl Grey, bergamot portakalı esansı ile aşılanmış klasik bir siyah çaydır. Cesur çay tadı, narenciye kokusu ile mükemmel bir denge sağlar.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/11.1.jpg",
    stock: 18,
    benefits: [
      "Enerji verir",
      "Stresi azaltır",
      "Sindirim sistemine yardımcı olur",
    ],
    usage:
      "1 çay kaşığı çayı kaynamış suyla 4-5 dakika demleyin. Süt veya limon ekleyebilirsiniz.",
  },
  {
    id: 12,
    name: "Chamomile Dream",
    price: 150.0,
    description:
      "Chamomile Dream, papatya çiçeklerinden yapılan sakinleştirici bir bitki çayıdır. Rahatlatıcı özellikleriyle bilinir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/12.1.jpg",
    stock: 25,
    benefits: [
      "Uyku kalitesini artırır",
      "Stresi ve anksiyeteyi azaltır",
      "Sindirim sistemini rahatlatır",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 5-7 dakika demleyin. Yatmadan önce içilmesi önerilir.",
  },
  {
    id: 13,
    name: "Sencha",
    price: 210.0,
    description:
      "Sencha, canlı yeşil rengi ve taze, çimen kokulu tadıyla bilinen popüler bir Japon yeşil çayıdır. Hafifçe buharlanarak işlenir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/13.1.jpg",
    stock: 30,
    benefits: [
      "Bağışıklık sistemini güçlendirir",
      "Zihinsel odaklanmayı artırır",
      "Metabolizmayı hızlandırır",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 3-4 dakika demleyin. Gün boyunca tüketilebilir.",
  },
  {
    id: 14,
    name: "Rooibos Chai",
    price: 240.0,
    description:
      "Rooibos Chai, Güney Afrika rooibos çayı ve tarçın, kakule, zencefil gibi baharatlarla yapılan kafeinsiz bir bitki çayıdır.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/14.1.jpg",
    stock: 22,
    benefits: [
      "Bağışıklık sistemini güçlendirir",
      "Sindirim sistemini rahatlatır",
      "Stresi azaltır",
    ],
    usage:
      "1 çay kaşığı çayı kaynamış suyla 5-7 dakika demleyin. Sıcak veya soğuk içilebilir.",
  },
  {
    id: 15,
    name: "Darjeeling First Flush",
    price: 350.0,
    description:
      "Darjeeling First Flush, hafif, çiçeksi tadıyla bilinen ünlü bir siyah çaydır. Erken ilkbaharda hasat edilir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/15.1.jpg",
    stock: 8,
    benefits: [
      "Antioksidan açısından zengindir",
      "Bağışıklık sistemini güçlendirir",
      "Kalp sağlığını destekler",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 3-5 dakika demleyin. Hafif, çiçeksi tadını deneyimleyin.",
  },
  {
    id: 16,
    name: "Mint Bliss",
    price: 170.0,
    description:
      "Mint Bliss, nane ve yarpuz yapraklarından yapılan ferahlatıcı bir bitki çayıdır. Sindirime iyi gelir ve serinletici bir etkiye sahiptir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/16.1.jpg",
    stock: 10,
    benefits: [
      "Sindirim sistemini rahatlatır",
      "Baş ağrısını hafifletir",
      "Nefesi tazeler",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 5 dakika demleyin. Soğuk içilmesi de uygundur.",
  },
  {
    id: 17,
    name: "Chun Mee",
    price: 200.0,
    description:
      "Chun Mee, hafif asidik tadıyla bilinen geleneksel bir Çin yeşil çayıdır. 'Değerli Kaş' anlamına gelir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/9.1.jpg",
    stock: 16,
    benefits: [
      "Antioksidanlar açısından zengindir",
      "Zihinsel odaklanmayı iyileştirir",
      "Bağışıklık sistemini destekler",
    ],
    usage:
      "1 çay kaşığı çayı sıcak suyla 3-4 dakika demleyin. Günlük tüketime uygundur.",
  },
  {
    id: 18,
    name: "English Breakfast",
    price: 180.0,
    description:
      "English Breakfast, güçlü, maltımsı tadıyla bilinen klasik bir siyah çay harmanıdır. Sabah kahvaltılarında süt ve şekerle içilebilir.",
    imageUrl:
      "https://teami-store-demo.myshopify.com/cdn/shop/products/10.1.jpg",
    stock: 28,
    benefits: [
      "Enerji verir",
      "Odaklanmayı artırır",
      "Sindirim sistemini rahatlatır",
    ],
    usage:
      "1 çay kaşığı çayı kaynamış suyla 4-5 dakika demleyin. Süt ve şekerle servis edilebilir.",
  },
];
