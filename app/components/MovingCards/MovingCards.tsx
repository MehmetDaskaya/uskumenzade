// InfiniteMovingCardsData.tsx
import { InfiniteMovingCardsClient } from "./MovingCardsClient";

export const InfiniteMovingCards = () => {
  // Items data fetched or defined server-side for SSR
  const items = [
    {
      quote: "Harika çaylar! Her sabah keyifle içiyorum.",
      name: "Ahmet Yıldız",
    },
    {
      quote: "Doğal kremler cildime çok iyi geldi, teşekkürler!",
      name: "Fatma Kaya",
    },
    {
      quote: "Üskümenzade'den alışveriş yapmak bir zevk.",
      name: "Merve Çelik",
    },
    {
      quote: "Merhemler gerçekten işe yarıyor, herkese tavsiye ederim.",
      name: "Ali Demir",
    },
    {
      quote: "Organik çayların tadı mükemmel, doğal hissettiriyor.",
      name: "Ayşe Koç",
    },
    {
      quote: "Siparişim hızlı ve sorunsuz geldi, harikasınız!",
      name: "Hüseyin Arslan",
    },
  ];

  return (
    <>
      <InfiniteMovingCardsClient items={items} speed="normal" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TestimonialPage",
            name: "Infinite Moving Cards",
            review: items.map((item) => ({
              "@type": "Review",
              reviewBody: item.quote,
              author: { "@type": "Person", name: item.name },
            })),
          }),
        }}
      />
    </>
  );
};
