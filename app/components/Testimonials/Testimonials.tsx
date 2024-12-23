import React from "react";
import "./styles.css";

interface Testimonial {
  text: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Harika çaylar! Her sabah keyifle içiyorum.",
    author: "Ahmet Yıldız",
  },
  {
    text: "Doğal kremler cildime çok iyi geldi, teşekkürler!",
    author: "Fatma Kaya",
  },
  { text: "Üskümenzade'den alışveriş yapmak bir zevk.", author: "Merve Çelik" },
  {
    text: "Merhemler gerçekten işe yarıyor, herkese tavsiye ederim.",
    author: "Ali Demir",
  },
  {
    text: "Organik çayların tadı mükemmel, doğal hissettiriyor.",
    author: "Ayşe Koç",
  },
  {
    text: "Siparişim hızlı ve sorunsuz geldi, harikasınız!",
    author: "Hüseyin Arslan",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-16"
      aria-labelledby="testimonials-title"
    >
      {/* SEO-Friendly Heading */}
      <div className="container mx-auto px-4">
        <h2
          id="testimonials-title"
          className="text-3xl text-gray-900 font-bold text-center mb-12"
        >
          Müşteri Yorumları
        </h2>

        {/* Testimonial Slider */}
        <div className="relative overflow-hidden">
          <div className="testimonial-slider flex">
            {testimonials.map((testimonial, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 text-center flex-shrink-0 w-80 border border-gray-200"
                aria-label={`Müşteri yorumu: ${testimonial.author}`}
              >
                <blockquote>
                  <p className="text-gray-700 italic mb-4">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </blockquote>
                <hr className="border-t border-gray-300 mb-4" />
                <footer>
                  <p className="text-sm font-semibold text-gray-600">
                    {testimonial.author}
                  </p>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TestimonialPage",
            name: "Müşteri Yorumları",
            review: testimonials.map((testimonial) => ({
              "@type": "Review",
              reviewBody: testimonial.text,
              author: { "@type": "Person", name: testimonial.author },
            })),
          }),
        }}
      />
    </section>
  );
};
