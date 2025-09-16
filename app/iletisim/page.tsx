import { Metadata } from "next";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import { LocalBusinessSchemaMarkup } from "../../Product_Schema_Markup_Template";

export const metadata: Metadata = {
  title: "İletişim - Uskumenzade",
  description:
    "Bizimle iletişime geçin! Uskumenzade çay, merhem ve kremler hakkında sorularınız için buradayız.",
  keywords: ["İletişim", "Uskumenzade", "Çay", "Merhem", "Krem", "E-Ticaret"],
};

export default function ContactPage() {
  return (
    <>
      <LocalBusinessSchemaMarkup />
      <div className="bg-background min-h-screen">
        {/* Hero Section */}
        <div className="bg-secondary text-white py-16">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl font-bold mb-4">Bize Ulaşın</h1>
            <p className="text-lg">
              Sorularınız, geri bildirimleriniz veya iş birliği talepleriniz
              için bizimle iletişime geçmekten çekinmeyin.
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
              <FaMapMarkerAlt className="text-tertiary text-4xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Adres
              </h3>
              <p className="text-gray-600">
                Mehmet Akif, 23 Nisan Cd. No:68, 15300
                <br />
                Bucak/Burdur
              </p>
            </div>
            <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 text-center">
              <FaPhoneAlt className="text-tertiary text-4xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Telefon
              </h3>
              <p className="text-gray-600">
                +90 551 988 8205
                <br />
                Pazartesi - Cuma, 09:00 - 18:00
              </p>
            </div>
            <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 text-center">
              <FaEnvelope className="text-tertiary text-4xl mb-4" />
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tertiary hover:underline"
                >
                  +90 551 988 8205
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
                  className="mt-1 p-3 bg-white text-gray-600 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
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
                  className="mt-1 p-3 bg-white text-gray-600 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
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
                  className="mt-1 p-3 bg-white text-gray-600 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-secondary"
                  placeholder="Mesajınız"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-bold hover:bg-tertiary focus:outline-none focus:ring-4 focus:ring-tertiary"
              >
                Gönder
              </button>
            </form>
          </div>

          {/* Map Section */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={`https://maps.google.com/maps?q=37.45316819368852,30.58805108070374&z=16&output=embed`}
              title="Uskumenzade Lokasyon"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="bg-secondary text-white py-16">
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
    </>
  );
}
