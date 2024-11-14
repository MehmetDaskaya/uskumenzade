// blogs/page.tsx
import React from "react";
import Link from "next/link";
import { mockBlogData } from "../../util/mock/mockBlogData";

const BlogsPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Üskümenzade Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockBlogData.map((blog) => (
          <div
            key={blog.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4">
                {blog.publishedDate} tarihinde {blog.author} tarafından yazıldı.
              </p>
              <p className="text-gray-800 mb-4">{blog.excerpt}</p>
              <Link href={`/blog/detaylar/${blog.id}`}>
                <div className="text-blue-500 hover:underline">
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
