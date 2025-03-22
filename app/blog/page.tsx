import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogsWithSSR } from "../api/blog/blogSSR";
import { BlogsEffect } from "../components/BlogsEffect/BlogsEffect";
import { FiSearch, FiClock, FiUser, FiTag, FiArrowRight } from "react-icons/fi";

// Define the Blog type
interface Blog {
  id: string;
  title: string;
  category: string;
  author: string;
  created_at: string;
  images: { url: string }[];
  content: string;
  tags?: { name: string }[];
}

// Metadata for SEO
export const metadata: Metadata = {
  title: "Sağlıklı Yaşam ve Bitkisel Ürünler Blogu | Üskümenzade",
  description:
    "Doğal ürünler, alternatif tıp, şifalı bitkiler ve sağlıklı yaşam hakkında uzman makaleler ve bilgiler. Üskümenzade'nin doğal çözümleri ile tanışın.",
  keywords:
    "bitkisel çay, doğal ürünler, alternatif tıp, şifalı bitkiler, sağlıklı yaşam, Üskümenzade blog",
  openGraph: {
    title: "Sağlıklı Yaşam ve Bitkisel Ürünler Blogu | Üskümenzade",
    description:
      "Doğal ürünler, alternatif tıp, şifalı bitkiler ve sağlıklı yaşam hakkında uzman makaleler ve bilgiler.",
    url: "https://uskumenzade.com/blog",
    siteName: "Üskümenzade",
    images: [
      {
        url: "https://uskumenzade.com/images/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Üskümenzade Blog",
      },
    ],
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sağlıklı Yaşam ve Bitkisel Ürünler Blogu | Üskümenzade",
    description:
      "Doğal ürünler, alternatif tıp, şifalı bitkiler ve sağlıklı yaşam hakkında uzman makaleler ve bilgiler.",
    images: ["https://uskumenzade.com/images/blog-og-image.jpg"],
  },
  alternates: {
    canonical: "https://uskumenzade.com/blog",
  },
};

// Main data fetching function
async function getData() {
  try {
    const blogs: Blog[] = await fetchBlogsWithSSR();

    // Extract unique first tags from blogs as categories
    const categories = [
      "Tümü",
      ...Array.from(
        new Set(
          blogs
            .map((blog) => blog.tags?.[0]?.name)
            .filter((name): name is string => typeof name === "string")
        )
      ),
    ];

    // Group blogs by categories for statistics
    const categoryStats = categories.reduce((acc, category) => {
      if (category === "Tümü") {
        acc[category] = blogs.length;
      } else {
        acc[category] = blogs.filter((blog) =>
          blog.tags?.some((tag) => tag.name === category)
        ).length;
      }
      return acc;
    }, {} as Record<string, number>);

    // Get featured blogs (newest 3)
    const featuredBlogs = [...blogs]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 3);

    // Get popular tags (all tags, not just the first one)
    const allTags = blogs
      .flatMap((blog) => blog.tags || [])
      .map((tag) => tag.name);

    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      blogs,
      categories,
      categoryStats,
      featuredBlogs,
      popularTags,
    };
  } catch (error) {
    console.error("Error fetching blogs data:", error);
    return {
      blogs: [],
      categories: ["Tümü"],
      categoryStats: { Tümü: 0 },
      featuredBlogs: [],
      popularTags: [],
    };
  }
}

interface BlogsPageProps {
  searchParams: {
    kategori?: string;
    ara?: string;
    sayfa?: string;
  };
}

// Helper function to get excerpt from content
function getExcerpt(content?: string, maxLength: number = 150) {
  if (!content) return "";

  const plainText = content.replace(/<[^>]+>/g, "");

  if (plainText.length <= maxLength) return plainText;

  const lastSpace = plainText.substring(0, maxLength).lastIndexOf(" ");
  return plainText.substring(0, lastSpace) + "...";
}

// Format date in Turkish
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("tr-TR", options);
}

const ITEMS_PER_PAGE = 9;

const BlogsPage = async ({ searchParams }: BlogsPageProps) => {
  const { blogs, categories, categoryStats, featuredBlogs, popularTags } =
    await getData();

  // Filter blogs based on the selected category and search query
  let filteredBlogs = [...blogs];

  if (searchParams.kategori && searchParams.kategori !== "Tümü") {
    filteredBlogs = filteredBlogs.filter((blog) =>
      blog.tags?.some((tag) => tag.name === searchParams.kategori)
    );
  }

  if (searchParams.ara) {
    const searchTerm = searchParams.ara.toLowerCase();
    filteredBlogs = filteredBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.content.toLowerCase().includes(searchTerm) ||
        blog.author.toLowerCase().includes(searchTerm) ||
        blog.tags?.some((tag) => tag.name.toLowerCase().includes(searchTerm))
    );
  }

  // Sort blogs by date (newest first)
  filteredBlogs.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Pagination
  const currentPage = searchParams.sayfa ? parseInt(searchParams.sayfa) : 1;
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Generate structured data for blog posts (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Üskümenzade Blog",
    description:
      "Doğal ürünler, alternatif tıp, şifalı bitkiler ve sağlıklı yaşam hakkında uzman makaleler ve bilgiler.",
    url: "https://uskumenzade.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Üskümenzade",
      logo: {
        "@type": "ImageObject",
        url: "https://uskumenzade.com/logo.png",
      },
    },
    blogPost: blogs.slice(0, 10).map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      datePublished: blog.created_at,
      author: {
        "@type": "Person",
        name: blog.author,
      },
      image: blog.images[0]?.url,
      url: `https://uskumenzade.com/blog/detaylar/${blog.id}`,
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section with Parallax Effect */}
        <div className="relative h-[50vh] overflow-hidden">
          {/* Background Image with Parallax */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: "url('/images/blog-hero-bg.webp')",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-primary/70"></div>
          </div>

          <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                Sağlıklı Yaşam ve Doğal Çözümler
              </h1>
              <p className="text-xl text-white/90 mb-6 leading-relaxed">
                Şifalı bitkiler, doğal ürünler ve sağlıklı yaşam hakkında uzman
                bilgilerini keşfedin.
              </p>

              {/* Search Bar */}
              <form action="/blog" method="get" className="relative max-w-xl">
                {searchParams.kategori && (
                  <input
                    type="hidden"
                    name="kategori"
                    value={searchParams.kategori}
                  />
                )}
                <input
                  type="text"
                  name="ara"
                  placeholder="Blog yazılarında ara..."
                  defaultValue={searchParams.ara || ""}
                  className="w-full py-3 px-5 pl-12 rounded-full text-gray-700 bg-white/95 focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <FiSearch size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Featured Blogs Section (visible only on homepage) */}
        {(!searchParams.kategori || searchParams.kategori === "Tümü") &&
          !searchParams.ara &&
          currentPage === 1 &&
          featuredBlogs.length > 0 && (
            <div className="bg-white py-16 border-b border-gray-100">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center">
                  <span className="w-10 h-1 bg-secondary inline-block mr-3"></span>
                  Öne Çıkan Yazılar
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredBlogs.map((blog) => (
                    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <Link
                        href={`/blog/detaylar/${blog.id}`}
                        className="block"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={
                              blog.images[0]?.url ||
                              "/images/blog-placeholder.webp"
                            }
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority
                          />
                          {blog.tags?.[0] && (
                            <span className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                              {blog.tags[0].name}
                            </span>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="flex items-center text-gray-500 text-sm mb-3">
                            <FiUser className="mr-1" />
                            <span>{blog.author}</span>
                            <span className="mx-2">•</span>
                            <FiClock className="mr-1" />
                            <span>{formatDate(blog.created_at)}</span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-secondary transition-colors duration-300">
                            {blog.title}
                          </h3>

                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {getExcerpt(blog.content, 120)}
                          </p>

                          <div className="text-secondary font-medium flex items-center">
                            Devamını Oku
                            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Main Content Area */}
        <div className="container mx-auto py-16 px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar - Categories & Tags */}
            <aside className="lg:w-1/4 order-2 lg:order-1">
              <div className="sticky top-24">
                {/* Categories Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                    Kategoriler
                  </h2>
                  <ul className="space-y-3">
                    {categories.map((category) => (
                      <li key={category} className="group">
                        <Link
                          href={`/blog?kategori=${encodeURIComponent(
                            category
                          )}`}
                          className={`
                            flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200
                            ${
                              searchParams.kategori === category
                                ? "bg-secondary text-white font-medium"
                                : "text-gray-700 hover:bg-gray-50 hover:text-secondary"
                            }
                          `}
                        >
                          <span>{category}</span>
                          <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                            {categoryStats[category] || 0}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Popular Tags */}
                {popularTags.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                      Popüler Etiketler
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Link
                          key={tag.name}
                          href={`/blog?kategori=${encodeURIComponent(
                            tag.name
                          )}`}
                          className="inline-block bg-gray-100 hover:bg-secondary hover:text-white text-gray-700 px-3 py-1 rounded-full text-sm transition-colors duration-200"
                        >
                          {tag.name} ({tag.count})
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-white">
                  <h3 className="text-xl font-bold mb-3">
                    Bültenimize Abone Olun
                  </h3>
                  <p className="mb-4 text-white/80">
                    Yeni blog yazılarımızdan ve indirimlerden haberdar olmak
                    için e-posta listemize kaydolun.
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-white text-primary font-medium py-3 rounded-lg hover:bg-white/90 transition-colors duration-200"
                    >
                      Abone Ol
                    </button>
                  </form>
                </div>
              </div>
            </aside>

            {/* Main Content - Blog Listings */}
            <main className="lg:w-3/4 order-1 lg:order-2">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {searchParams.kategori && searchParams.kategori !== "Tümü"
                    ? `${searchParams.kategori} Yazıları`
                    : searchParams.ara
                    ? `"${searchParams.ara}" için Sonuçlar`
                    : "Blog Yazılarımız"}
                </h2>
                <p className="text-gray-500 mt-2 sm:mt-0">
                  {filteredBlogs.length} yazı bulundu
                </p>
              </div>

              {/* No Results Message */}
              {paginatedBlogs.length === 0 && (
                <div className="bg-white rounded-xl p-10 text-center justify-center items-center shadow-sm">
                  <div className="text-gray-400 text-7xl mx-auto mb-6 text-center">
                    <FiSearch />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Aradığınız kriterlere uygun yazı bulunamadı
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Farklı bir kategori seçmeyi veya başka bir arama yapmayı
                    deneyebilirsiniz.
                  </p>
                  <Link
                    href="/blog"
                    className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary transition-colors duration-200"
                  >
                    Tüm Yazıları Göster
                  </Link>
                </div>
              )}

              {/* Blog Grid */}
              {paginatedBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
                    >
                      <Link
                        href={`/blog/detaylar/${blog.id}`}
                        className="block flex-1 flex flex-col"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={
                              blog.images[0]?.url ||
                              "/images/blog-placeholder.webp"
                            }
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                          {/* Tags */}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {blog.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag.name}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full inline-flex items-center"
                                >
                                  <FiTag size={12} className="mr-1" />
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}

                          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-secondary transition-colors duration-200 line-clamp-2">
                            {blog.title}
                          </h3>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                            {getExcerpt(blog.content)}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-2">
                                <FiUser size={14} />
                              </div>
                              <span className="text-sm text-gray-700">
                                {blog.author}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(blog.created_at)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-2">
                    {/* Previous Page */}
                    {currentPage > 1 && (
                      <Link
                        href={{
                          pathname: "/blog",
                          query: {
                            ...searchParams,
                            sayfa: currentPage - 1,
                          },
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                      >
                        &laquo;
                      </Link>
                    )}

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Link
                          key={page}
                          href={{
                            pathname: "/blog",
                            query: {
                              ...searchParams,
                              sayfa: page,
                            },
                          }}
                          className={`
                          w-10 h-10 flex items-center justify-center rounded-full
                          ${
                            currentPage === page
                              ? "bg-secondary text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }
                        `}
                        >
                          {page}
                        </Link>
                      )
                    )}

                    {/* Next Page */}
                    {currentPage < totalPages && (
                      <Link
                        href={{
                          pathname: "/blog",
                          query: {
                            ...searchParams,
                            sayfa: currentPage + 1,
                          },
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                      >
                        &raquo;
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Call-to-Action Section with Parallax Background */}
        <div
          className="relative py-20"
          style={{
            backgroundImage: "url('/images/blog-bg.webp')",
            backgroundAttachment: "fixed",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-primary/80"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Doğanın Şifasını Keşfedin
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Üskümenzade'nin şifalı bitki çayları ve doğal ürünleriyle
                sağlıklı yaşamın kapılarını aralayın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/urunler/cay"
                  className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-white/90 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Bitkisel Çaylarımız
                </Link>
                <Link
                  href="/urunler"
                  className="bg-secondary text-white px-8 py-4 rounded-lg font-bold hover:bg-secondary/90 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Tüm Ürünleri Keşfet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsPage;
