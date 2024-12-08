import { notFound } from "next/navigation";
import BlogDetailsClient from "./BlogDetailsClient";
import { fetchBlogById } from "../../../api/blog/blogApi"; // Adjust the path as needed

interface BlogDetailsPageProps {
  params: { id: string };
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
