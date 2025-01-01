import { notFound } from "next/navigation";
import BlogDetailsClient from "./BlogDetailsClient";
import { fetchBlogById } from "../../../api/blog/blogApi"; // Adjust the path as needed
import { Metadata } from "next";

interface BlogDetailsPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  try {
    const blog = await fetchBlogById(params.id);

    if (!blog) {
      return {
        title: "Blog Not Found",
        description: "The requested blog does not exist.",
      };
    }

    return {
      title: blog.title,
      description: blog.description,
      keywords: blog.meta_tags
        .map((tag: { name: string }) => tag.name) // Explicitly type `tag`
        .join(", "),
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while fetching blog details.",
    };
  }
}

export default async function BlogDetailsPage({
  params,
}: BlogDetailsPageProps) {
  try {
    const blog = await fetchBlogById(params.id);

    if (!blog) {
      notFound();
    }

    return <BlogDetailsClient blog={blog} />;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    notFound();
  }
}
