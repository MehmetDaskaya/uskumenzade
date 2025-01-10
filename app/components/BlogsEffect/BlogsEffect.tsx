import { cn } from "../../../util/utils";
import Link from "next/link";

export const BlogsEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    image: string;
  }[];
  className?: string;
}) => {
  const truncateText = (text: string, limit: number) =>
    text.length > limit ? `${text.substring(0, limit)}...` : text;

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-8",
        className
      )}
    >
      {items.map((item) => (
        <Link
          href={item.link}
          key={item.link}
          className="relative block p-2 group hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden"
        >
          {/* Card Image */}
          <div className="overflow-hidden rounded-t-2xl">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {/* Card Content */}
          <div className="bg-white rounded-b-2xl p-4 shadow-md">
            <h4 className="text-gray-900 font-bold tracking-wide mt-2 line-clamp-2">
              {truncateText(item.title, 50)}{" "}
              {/* Truncate title to 50 characters */}
            </h4>
            <p className="text-gray-600 tracking-wide leading-relaxed text-sm mt-1">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
