"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

interface FooterProps {
  viewable?: boolean;
}

export const Footer = ({ viewable = false }: FooterProps) => {
  return (
    <footer
      className={`bg-gray-900 text-gray-200 py-12 px-6 ${
        viewable ? "" : "hidden"
      }`}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Üskümenzade</h2>
          <p className="text-sm">
            Üskümenzade&apos;ye hoş geldiniz, bütünsel sağlık için tek
            adresiniz. Daha sağlıklı, daha dengeli bir yaşam sürmenize yardımcı
            olmak için en kaliteli bitkisel ürünleri ve doğal tedavileri
            sağlıyoruz.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Site İçi Ulaşım</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/products" className="hover:text-yellow-500">
                Ürünler
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-yellow-500">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-yellow-500">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-yellow-500">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Müşteri Servisi</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/shipping" className="hover:text-yellow-500">
                Kargo Bilgisi
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-yellow-500">
                İadeler
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-yellow-500">
                Sıkça Sorulan Sorular
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-yellow-500">
                Destek
              </Link>
            </li>
          </ul>
        </div>

        {/* Map Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Adres</h3>
          <div className="w-full h-48">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345094177!2d144.9537363153159!3d-37.81627937975167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5773e42c576c688!2sVictoria!5e0!3m2!1s!2sau!4v1619141883476!5m2!1sen!2sau"
              width="100%"
              height="100%"
              allowFullScreen={false}
              loading="lazy"
              title="Google Map"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 mx-4">
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left ">
          Bizi Sosyal Medyada Takip Edin
        </h3>
        <div className="flex justify-center md:justify-start space-x-4">
          <Link
            href="https://www.facebook.com"
            className="hover:text-yellow-500"
          >
            <FaFacebookF size={24} />
          </Link>
          <Link
            href="https://www.twitter.com"
            className="hover:text-yellow-500"
          >
            <FaTwitter size={24} />
          </Link>
          <Link
            href="https://www.instagram.com"
            className="hover:text-yellow-500"
          >
            <FaInstagram size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com"
            className="hover:text-yellow-500"
          >
            <FaLinkedinIn size={24} />
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6">
        <p className="text-center text-sm text-gray-500">
          &copy; 2024 Üskümenzade. Tüm Hakları Saklıdır.
        </p>
      </div>
    </footer>
  );
};
