// pages/blog/[id].tsx
import { GetServerSideProps } from "next";
import Head from "next/head";

interface Blog {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  imageUrl: string;
}

interface BlogPostPageProps {
  blog: Blog;
}

const BlogPostPage = ({ blog }: BlogPostPageProps) => {
  return (
    <>
      <Head>
        <title>{blog.title} - Herbal Shop</title>
        <meta
          name="description"
          content={blog.subtitle || blog.content.slice(0, 150)}
        />
      </Head>

      <div className="container mx-auto py-8">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-auto object-cover"
        />
        <h1 className="text-4xl font-bold mt-6">{blog.title}</h1>
        <h2 className="text-2xl mt-4">{blog.subtitle}</h2>
        <p className="mt-6">{blog.content}</p>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const res = await fetch(`https://your-api.com/blogs/${id}`);
  const blog = await res.json();

  return {
    props: { blog },
  };
};

export default BlogPostPage;
