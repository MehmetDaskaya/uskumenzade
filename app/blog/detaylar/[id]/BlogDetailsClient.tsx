"use client";
import Image from "next/image";
import { FaLink, FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

interface ContentSection {
  heading: string;
  body: string;
}

interface Blog {
  id: number;
  title: string;
  contentSections: ContentSection[];
  author: string;
  imageUrl: string;
  publishedDate: string;
  readTime: string;
  category: string;
  excerpt: string; // Include excerpt
  tags: string[]; // Include tags
}

interface BlogDetailsClientProps {
  blog: Blog;
}

export default function BlogDetailsClient({ blog }: BlogDetailsClientProps) {
  return (
    <div className="bg-[#f9f5eb] text-[#333] min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto pt-16 pb-10 px-4 lg:px-0 lg:py-16 flex flex-col lg:flex-row items-start justify-between">
        <div className="lg:w-3/5">
          <div className="mb-6 flex items-center space-x-2 text-sm">
            <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-bold text-[#333]">
              {blog.category}
            </span>
            <span>—</span>
            <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Image
              src="/author-avatar.jpg"
              alt={blog.author}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{blog.author}</p>
              <p className="text-gray-500">{blog.readTime} min to read</p>
            </div>
          </div>

          {/* Excerpt Section */}
          <p className="mt-4 mb-8 text-lg text-[#5e5c64]">{blog.excerpt}</p>
        </div>
        <div className="lg:w-2/5 relative mt-8 lg:mt-0">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            layout="responsive"
            width={1000}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-12 px-4 lg:px-0 py-10">
        {/* Blog Content */}
        <div className="lg:w-2/3 leading-relaxed text-lg text-[#5e5c64]">
          {blog.contentSections.map((section, index) => (
            <div key={index}>
              <h2 className="font-semibold text-xl mb-4">{section.heading}</h2>
              <p className="mb-6">{section.body}</p>
            </div>
          ))}

          {/* Tags Section */}
          <div className="mt-8">
            <h4 className="font-semibold text-lg mb-2">Etiketler:</h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-[#333]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="lg:w-1/3 lg:sticky lg:top-16 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">İçerik Tablosu</h3>
            <ul className="space-y-2 text-sm">
              {blog.contentSections.map((section, index) => (
                <li key={index}>
                  <a
                    href={`#${section.heading
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                    className="text-blue-600"
                  >
                    {index + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Sharing */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Bu bloğu paylaşın</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-200 p-2 rounded-full hover:bg-blue-600 hover:text-white transition"
              >
                <FaLink />
              </a>
              <a
                href="#"
                className="bg-gray-200 p-2 rounded-full hover:bg-blue-500 hover:text-white transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="bg-gray-200 p-2 rounded-full hover:bg-blue-700 hover:text-white transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="bg-gray-200 p-2 rounded-full hover:bg-blue-600 hover:text-white transition"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
