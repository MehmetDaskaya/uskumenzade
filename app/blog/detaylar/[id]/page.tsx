import { notFound } from "next/navigation";
import { mockBlogData } from "../../../../util/mock/mockBlogData";
import BlogDetailsClient from "./BlogDetailsClient";
import Head from "next/head"; // Import Head for SEO

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
  excerpt: string;
  tags: string[];
}

async function getBlogById(id: number): Promise<Blog | undefined> {
  const blog = mockBlogData.find((b) => Number(b.id) === id);
  if (!blog) {
    notFound();
  }
  return blog;
}

interface BlogDetailsPageProps {
  params: { id: string };
}

export default async function BlogDetailsPage({
  params,
}: BlogDetailsPageProps) {
  const blogId = Number(params.id);
  const blog = await getBlogById(blogId);

  if (!blog) {
    return <p>Blog not found</p>;
  }

  return (
    <>
      <Head>
        <title>{blog.title} | My Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta name="keywords" content={blog.tags.join(", ")} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.imageUrl} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://yourwebsite.com/blogs/${blog.id}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.imageUrl} />
      </Head>
      <BlogDetailsClient blog={blog} />
    </>
  );
}
