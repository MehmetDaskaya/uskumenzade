// InfiniteMovingCardsData.tsx
import { InfiniteMovingCardsClient } from "./MovingCardsClient";
import { testimonialsData } from "@/util/testimonialsData";

export const InfiniteMovingCards = () => {
  return (
    <>
      <InfiniteMovingCardsClient reviews={testimonialsData} speed="slow" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ReviewPage",
            name: "Customer Reviews",
            review: testimonialsData.map((review) => ({
              "@type": "Review",
              reviewBody: review.comment,
              reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating,
                bestRating: 5,
              },
              author: {
                "@type": "Person",
                name: review.name,
                image: review.userImage,
              },
              itemReviewed: {
                "@type": "Product",
                name: review.product,
                image: review.productImage,
              },
            })),
          }),
        }}
      />
    </>
  );
};
