// Product Schema Markup Template for Üskümenzade
// This file contains the schema markup that should be added to product detail pages
// No changes to existing code - just a template for future implementation

// Define Product interface based on your existing API structure
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discounted_price?: number;
  stock: number;
  images?: Array<{ url: string }>;
  category?: { name: string };
}

// Utility function to safely stringify JSON-LD
const safeStringify = (obj: Record<string, unknown>): string => {
  return JSON.stringify(obj, null, 0)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
};

interface ProductSchemaProps {
  product: Product;
}

export const ProductSchemaMarkup = ({ product }: ProductSchemaProps) => {
  // Generate the structured data for the product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map((img) => img.url) || [],
    brand: {
      "@type": "Brand",
      name: "Üskümenzade",
    },
    category: product.category?.name || "Doğal Ürünler",
    offers: {
      "@type": "Offer",
      price: product.discounted_price || product.price,
      priceCurrency: "TRY",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Üskümenzade",
        url: "https://uskumenzade.com",
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5", // This should come from your backend
      reviewCount: "127", // This should come from your backend
    },
    review: [
      // Example review structure - populate from your backend
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Müşteri Adı",
        },
        reviewBody: "Harika bir ürün, kesinlikle tavsiye ederim.",
      },
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Stok Durumu",
        value: product.stock > 0 ? "Stokta" : "Stokta Değil",
      },
      {
        "@type": "PropertyValue",
        name: "Kategori",
        value: product.category?.name || "",
      },
    ],
    url: `https://uskumenzade.com/urunler/detaylar/${product.id}`,
    identifier: product.id,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(productSchema),
      }}
    />
  );
};

// Alternative: Breadcrumb Schema Markup
export const BreadcrumbSchemaMarkup = ({ product }: ProductSchemaProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://uskumenzade.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ürünler",
        item: "https://uskumenzade.com/urunler",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category?.name || "Kategori",
        item: `https://uskumenzade.com/urunler?kategori=${encodeURIComponent(
          product.category?.name || ""
        )}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://uskumenzade.com/urunler/detaylar/${product.id}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(breadcrumbSchema),
      }}
    />
  );
};

// Organization Schema Markup for Homepage/About Page
export const OrganizationSchemaMarkup = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Üskümenzade",
    alternateName: "Pamukdede Ailesi",
    description:
      "1953'ten bugüne doğal ürünlerle sağlığınızı destekliyoruz. Bitkisel çaylar, doğal yağlar ve sağlıklı yaşam için blog yazıları.",
    url: "https://uskumenzade.com",
    logo: "https://uskumenzade.com/images/uskumenzade-logo.svg",
    image: "https://uskumenzade.com/images/uskumenzade-doga.webp",
    foundingDate: "1953",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mehmet Akif, 23 Nisan Cd. No:68",
      addressLocality: "Bucak",
      addressRegion: "Burdur",
      postalCode: "15300",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-551-988-8205",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
    sameAs: [
      "https://facebook.com/uskumenzade",
      "https://instagram.com/uskumenzade",
      "https://twitter.com/uskumenzade",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Üskümenzade Ürün Kataloğu",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Bitkisel Çaylar",
            description: "Doğal bitkisel çaylar",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Doğal Yağlar",
            description: "Şifalı bitki yağları",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Bitkisel Kremler",
            description: "Doğal krem ve merhemler",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(organizationSchema),
      }}
    />
  );
};

// Local Business Schema for Contact Page
export const LocalBusinessSchemaMarkup = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Üskümenzade",
    description:
      "Doğal bitkisel ürünler ve şifalı bitki çayları satan yerel işletme",
    url: "https://uskumenzade.com",
    telephone: "+90-551-988-8205",
    email: "destek@uskumenzade.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mehmet Akif, 23 Nisan Cd. No:68",
      addressLocality: "Bucak",
      addressRegion: "Burdur",
      postalCode: "15300",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "37.45316819368852",
      longitude: "30.58805108070374",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "₺₺",
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
    currenciesAccepted: "TRY",
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Doğal Ürünler Kataloğu",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(localBusinessSchema),
      }}
    />
  );
};

// Usage Instructions:
// 1. Import the schema components where needed:
//    import { ProductSchemaMarkup, BreadcrumbSchemaMarkup } from './Product_Schema_Markup_Template';
//
// 2. Add to your product detail page (e.g., ProductDetailsClient.tsx):
//    return (
//      <>
//        <ProductSchemaMarkup product={product} />
//        <BreadcrumbSchemaMarkup product={product} />
//        {/* Your existing component content */}
//      </>
//    );
//
// 3. Add to your homepage or about page:
//    import { OrganizationSchemaMarkup } from './Product_Schema_Markup_Template';
//
//    return (
//      <>
//        <OrganizationSchemaMarkup />
//        {/* Your existing component content */}
//      </>
//    );
//
// 4. Add to your contact page:
//    import { LocalBusinessSchemaMarkup } from './Product_Schema_Markup_Template';
//
//    return (
//      <>
//        <LocalBusinessSchemaMarkup />
//        {/* Your existing component content */}
//      </>
//    );
