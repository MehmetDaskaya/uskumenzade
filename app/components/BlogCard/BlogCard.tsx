import Link from "next/link";
import Image from "next/image";

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
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          width={500} // Set an appropriate width
          height={192} // Set an appropriate height for the h-48 equivalent
          className="w-full h-48 object-cover"
        />
        <h2 className="text-lg font-bold mt-4">{blog.title}</h2>
        <p className="text-sm mt-2">{blog.subtitle}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
