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
        <div
          className="relative mb-4"
          style={{ width: "80%", maxWidth: "400px", height: "200px" }}
        >
          <Image
            src={typeof logo === "string" ? logo : logo.src}
            alt="Logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      {aboveText && (
        <h2 className="mb-10 text-lg text-white px-4">{aboveText}</h2>
      )}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-tertiary"></div>
    </div>
  );
}
