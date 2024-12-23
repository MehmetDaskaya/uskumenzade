import { Metadata } from "next";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "İletişim - Uskumenzade",
  description:
    "Bizimle iletişime geçin! Uskumenzade çay, merhem ve kremler hakkında sorularınız için buradayız.",
  keywords: ["İletişim", "Uskumenzade", "Çay", "Merhem", "Krem", "E-Ticaret"],
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-yellow-500 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Bize Ulaşın</h1>
          <p className="text-lg">
            Sorularınız, geri bildirimleriniz veya iş birliği talepleriniz için
            bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          İletişim Bilgilerimiz
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 text-center">
            <FaMapMarkerAlt className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Adres</h3>
            <p className="text-gray-600">
              Uskumenzade Ofis
              <br />
              İstanbul, Türkiye
            </p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 text-center">
            <FaPhoneAlt className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Telefon
            </h3>
            <p className="text-gray-600">
              +90 212 123 45 67
              <br />
              Pazartesi - Cuma, 09:00 - 18:00
            </p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 text-center">
            <FaEnvelope className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              E-posta
            </h3>
            <p className="text-gray-600">destek@uskumenzade.com</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 text-center">
            <FaWhatsapp className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              WhatsApp
            </h3>
            <p className="text-gray-600">
              <a
                href="https://wa.me/905551234567"
                className="text-yellow-500 hover:underline"
              >
                +90 555 123 45 67
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form and Map Section */}
      <div className="container mx-auto py-16 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            İletişim Formu
          </h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                İsim
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 p-3 bg-white text-gray-600 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Adınız"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-posta
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 p-3 bg-white text-gray-600 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="E-posta adresiniz"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Mesaj
              </label>
              <textarea
                id="message"
                rows={4}
                required
                className="mt-1 p-3 bg-white text-gray-600 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Mesajınız"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            >
              Gönder
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.61875341277!2d28.9795301!3d41.0151377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba3b3bb9c913%3A0x7f68be97d4b3a9b1!2sIstanbul!5e0!3m2!1sen!2str!4v1697387354832!5m2!1sen!2str"
            title="Uskumenzade Lokasyon"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0"
          ></iframe>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-yellow-500 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bizimle Hemen İletişime Geçin
          </h2>
          <p className="text-lg mb-6">
            Çay, merhem ve krem koleksiyonumuz hakkında sorularınız için
            buradayız.
          </p>
          <a
            href="https://wa.me/905551234567"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 flex items-center justify-center gap-2 w-fit mx-auto"
          >
            <FaWhatsapp className="text-green-500 text-xl" />
            WhatsApp ile İletişime Geçin
          </a>
        </div>
      </div>
    </div>
  );
}
