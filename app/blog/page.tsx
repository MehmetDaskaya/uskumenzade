"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBlogs } from "../api/blog/blogApi"; // Adjust the import path as necessary

// Define the Blog type
interface Blog {
  id: string;
  title: string;
  category: string;
  author: string;
  created_at: string;
  images: { url: string }[]; // Assuming multiple images
  content: string;
}

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]); // Use the Blog[] type for the state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs(); // Use the fetchBlogs function from blogApi.ts
        setBlogs(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-500">
          Bir hata oluştu: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Üskümenzade Blog
      </h1>
      <p className="text-center text-gray-600 mb-8 text-lg">
        İlham verici hikayeler ve bilgiler için en son blog yazılarımıza göz
        atın.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Blog Image */}
            <img
              src={blog.images[0]?.url || "/placeholder.jpg"}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              {/* Blog Title */}
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                {blog.title}
              </h2>
              {/* Blog Metadata */}
              <p className="text-gray-600 mb-4 text-sm">
                <span className="font-semibold">{blog.author}</span> tarafından{" "}
                <span>
                  {new Date(blog.created_at).toLocaleDateString("tr-TR")}
                </span>{" "}
                tarihinde yazıldı.
              </p>
              {/* Read More Link */}
              <Link href={`/blog/detaylar/${blog.id}`}>
                <div className="text-blue-500 hover:underline text-sm font-medium">
                  Ayrıntılı Blog Yazısını Gör
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
