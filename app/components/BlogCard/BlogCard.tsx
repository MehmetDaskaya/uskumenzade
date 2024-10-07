import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Link href={`/blog/${blog.id}`}>
      <div className="border p-4 cursor-pointer">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        <h2 className="text-lg font-bold mt-4">{blog.title}</h2>
        <p className="text-sm mt-2">{blog.subtitle}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
