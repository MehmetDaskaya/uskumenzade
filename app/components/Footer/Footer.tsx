"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store"; // Adjust the import based on your project structure
import { fetchDocuments } from "@/app/api/document/documentApi";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import paymentLogos from "../../../public/images/logo_band_colored.svg";

interface FooterProps {
  viewable?: boolean;
}

interface Document {
  id: string;
  name: string;
  type: string;
  created_at: string;
  url: string; // Add this line
}

export const Footer = ({ viewable = false }: FooterProps) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [kvkkDocument, setKvkkDocument] = useState<string | null>(null);
  const [userAgreement, setUserAgreement] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!accessToken) return;

      try {
        const documents: Document[] = await fetchDocuments(0, 100, accessToken);

        // Find KVKK and Kullanıcı Sözleşmesi documents with correct typing
        const kvkk = documents.find(
          (doc: Document) => doc.name.toLowerCase() === "kvkk"
        );
        const userAgreement = documents.find(
          (doc: Document) => doc.name.toLowerCase() === "kullanıcı sözleşmesi"
        );

        if (kvkk) setKvkkDocument(kvkk.url);
        if (userAgreement) setUserAgreement(userAgreement.url);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    loadDocuments();
  }, [accessToken]);

  return (
    <footer
      className={`bg-footerDark text-light py-12 px-6 mt-auto ${
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
              <Link href="/urunler" className="hover:text-tertiary">
                Ürünler
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-tertiary">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="hover:text-tertiary">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-tertiary">
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
              <Link href="/iletisim" className="hover:text-tertiary">
                Kargo Bilgisi
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-tertiary">
                İadeler
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-tertiary">
                Sıkça Sorulan Sorular
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-tertiary">
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d791.7808113669026!2d30.574253269631527!3d37.45781189825417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c44120ba663679%3A0xf5096f80aae765f5!2sPamuk%20Dede!5e0!3m2!1sen!2str!4v1739155081024!5m2!1sen!2str"
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

      <div className="flex flex-row justify-between items-end">
        {/* Social Media Links */}
        <div className="mt-8 mx-4">
          <h3 className="text-xl font-semibold mb-4 text-center md:text-left ">
            Bizi Sosyal Medyada Takip Edin
          </h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <Link
              href="https://www.facebook.com"
              className="hover:text-tertiary"
            >
              <FaFacebookF size={24} />
            </Link>
            <Link
              href="https://www.twitter.com"
              className="hover:text-tertiary"
            >
              <FaXTwitter size={24} />
            </Link>
            <Link
              href="https://www.instagram.com"
              className="hover:text-tertiary"
            >
              <FaInstagram size={24} />
            </Link>
            <Link
              href="https://www.linkedin.com"
              className="hover:text-tertiary"
            >
              <FaLinkedinIn size={24} />
            </Link>
          </div>
        </div>
        {/* Payment Logos Section */}
        <div className="flex justify-center my-8">
          <Image
            src={paymentLogos}
            alt="Ödeme Yöntemleri"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center">
        {/* Legal Documents */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-6 mb-4">
          {kvkkDocument && (
            <a
              href={kvkkDocument}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-sm text-gray-500"
            >
              KVKK
            </a>
          )}
          {userAgreement && (
            <a
              href={userAgreement}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-sm text-gray-500"
            >
              Kullanıcı Sözleşmesi
            </a>
          )}
        </div>

        {/* All Rights Reserved */}
        <p className="text-center text-sm text-gray-500">
          &copy; 2025 Üskümenzade. Tüm Hakları Saklıdır.
        </p>
      </div>
    </footer>
  );
};
