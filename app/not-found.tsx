// pages/404.tsx
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-gray-800 px-6">
      <h1 className="text-6xl font-bold mb-4 text-tertiary">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Sayfa Bulunamadı</h2>
      <p className="text-center text-lg mb-6">
        Üzgünüz, aradığınız sayfayı bulamadık. Lütfen başka bir sayfayı deneyin
        veya ana sayfaya geri dönün.
      </p>
      <Link href="/anasayfa">
        <button className="bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:bg-tertiary transition duration-300">
          Ana Sayfaya Dön
        </button>
      </Link>
    </div>
  );
}
