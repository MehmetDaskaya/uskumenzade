import { StaticImageData } from "next/image";
import Image from "next/image";

interface LoadingSpinnerProps {
  aboveText?: string;
  logo?: string | StaticImageData;
}

export default function LoadingSpinner({
  aboveText,
  logo,
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col text-center">
      {logo && (
        <Image
          src={typeof logo === "string" ? logo : logo.src}
          alt="Logo"
          className="mb-4 max-w-[80%] max-h-64"
        />
      )}
      {aboveText && (
        <h2 className="mb-10 text-lg text-gray-700 px-4">{aboveText}</h2>
      )}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
    </div>
  );
}
