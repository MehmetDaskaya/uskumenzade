import React from "react";
import { fetchBlogsWithSSR } from "../api/blog/blogSSR"; // Adjust the path if necessary
import { BlogsEffect } from "../components/BlogsEffect/BlogsEffect";

// Define the Blog type
interface Blog {
  id: string;
  title: string;
  category: string;
  author: string;
  created_at: string;
  images: { url: string }[]; // Assuming multiple images
  content: string;
  tags?: { name: string }[];
}

async function getData() {
  try {
    const blogs: Blog[] = await fetchBlogsWithSSR();

    // Extract categories from blogs and include the first tag as a category
    const categories = [
      "Tümü",
      ...Array.from(
        new Set(
          blogs.flatMap((blog) => [
            blog.category,
            blog.tags?.[0]?.name, // Include the first tag's name if available
          ])
        )
      ).filter(Boolean), // Remove undefined or null values
    ];

    return { blogs, categories };
  } catch (error) {
    console.error("Error fetching blogs data:", error);
    return { blogs: [], categories: ["Tümü"] }; // Provide fallback
  }
}

interface BlogsPageProps {
  searchParams: { kategori?: string };
}

const BlogsPage = async ({ searchParams }: BlogsPageProps) => {
  const { blogs, categories } = await getData();

  // Filter blogs based on the selected category
  const filteredBlogs =
    searchParams.kategori && searchParams.kategori !== "Tümü"
      ? blogs.filter(
          (blog) =>
            blog.category === searchParams.kategori ||
            blog.tags?.[0]?.name === searchParams.kategori
        )
      : blogs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-yellow-500 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Üskümenzade Blog</h1>
          <p className="text-lg">
            İlham verici hikayeler ve bilgiler için en yeni blog yazılarımıza
            göz atın.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="container mx-auto py-16 px-4 flex gap-8">
        {/* Blog Posts */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            {searchParams.kategori && searchParams.kategori !== "Tümü"
              ? `${searchParams.kategori} Kategorisindeki Bloglar`
              : "En Yeni Blog Yazılarımız"}
          </h2>
          <BlogsEffect
            items={filteredBlogs.map((blog) => ({
              title: blog.title,
              description: `${blog.author} tarafından ${new Date(
                blog.created_at
              ).toLocaleDateString("tr-TR")} tarihinde yazıldı.`,
              link: `/blog/detaylar/${blog.id}`,
              image: blog.images[0]?.url || "/placeholder.jpg",
            }))}
          />
        </div>

        {/* Vertical Line Divider */}
        <div className="w-px bg-gray-300"></div>

        {/* Categories */}
        <div className="w-1/4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Kategoriler</h2>
          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href={`?kategori=${category}`}
                  className={`w-full text-left text-lg text-gray-700 hover:text-yellow-500 transition-colors ${
                    searchParams.kategori === category
                      ? "font-bold text-yellow-500"
                      : ""
                  }`}
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-yellow-500 text-white py-16">
        <div className="container mx-auto text-center px-4">
          {blogs.length > 6 ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Keşfetmeye Devam Edin</h2>
              <p className="text-lg mb-6">
                Daha fazla bilgi ve hikaye için diğer bloglarımızı inceleyin.
              </p>
              <a
                href="/blog/detaylar"
                className="bg-white text-yellow-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
              >
                Tüm Blogları Gör
              </a>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Ürünlerimizi Keşfedin</h2>
              <p className="text-lg mb-6">
                Daha fazlası için ürünlerimize göz atın.
              </p>
              <a
                href="/urunler"
                className="bg-white text-yellow-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
              >
                Ürünlere Git
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
