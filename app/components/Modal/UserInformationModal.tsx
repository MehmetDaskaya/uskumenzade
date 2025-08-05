"use client";

import { useState, useEffect } from "react";
import { fetchCurrentUser, updateUser, User } from "@/app/api/user/userApi";
import { createAddress, Address } from "@/app/api/address/addressApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface UserInformationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdateAddresses: (addresses: Address[]) => void;
}

export default function UserInformationModal({
  isVisible,
  onClose,
  onUpdateAddresses,
}: UserInformationModalProps) {
  const [currentStep, setCurrentStep] = useState<"profile" | "address">(
    "profile"
  );

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressFormData, setAddressFormData] = useState<
    Partial<Address> & { id?: string }
  >({
    address: "",
    zip_code: "",
    city: "",
    country: "Türkiye",
    address_title: "",
    contact_name: "",
    contact_number: "",
    national_id: "",
  });

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Fetch user and address data
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        const userData = await fetchCurrentUser(accessToken);
        setUser(userData);
        setFormData({
          ...userData,
          fname: userData.fname === "string" ? "" : userData.fname,
          lname: userData.lname === "string" ? "" : userData.lname,
          email: userData.email === "string" ? "" : userData.email,
          gsm_number:
            userData.gsm_number === "string" ? "" : userData.gsm_number,
        });

        setAddresses(userData.addresses || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // User Profile Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!accessToken) return;

      await updateUser(formData, accessToken);
      setSuccessMessage("Profil bilgileri başarıyla güncellendi!");

      // Move to address step if user has no addresses
      if (addresses.length === 0) {
        setCurrentStep("address");
      } else {
        onUpdateAddresses(addresses);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Profil güncellenirken hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!accessToken) return;

      const newAddress = await createAddress(
        addressFormData as Omit<
          Address,
          "id" | "created_at" | "updated_at" | "user_id"
        >,
        accessToken || ""
      );
      const updatedAddresses = [...addresses, newAddress];
      setAddresses(updatedAddresses);
      onUpdateAddresses(updatedAddresses);

      onClose();
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Adres kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-2xl space-y-6 relative mx-4 mt-10 mb-10">
        {/* Header with warning message */}
        <div className="text-center mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-amber-800 font-semibold">Önemli</span>
            </div>
            <p className="text-amber-700 text-sm">
              Sipariş vermek için önce profil ve adres bilgilerinizi
              doldurmalısınız.
            </p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Profil ve Adres Bilgileri
          </h2>
        </div>

        {/* Profile Step */}
        {currentStep === "profile" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Kişisel Bilgiler
            </h3>
            {user ? (
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fname"
                      className="block text-gray-700 font-medium mb-2 text-sm"
                    >
                      Ad
                    </label>
                    <input
                      id="fname"
                      type="text"
                      name="fname"
                      value={formData.fname || ""}
                      onChange={handleInputChange}
                      placeholder="Adınız"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lname"
                      className="block text-gray-700 font-medium mb-2 text-sm"
                    >
                      Soyad
                    </label>
                    <input
                      id="lname"
                      type="text"
                      name="lname"
                      value={formData.lname || ""}
                      onChange={handleInputChange}
                      placeholder="Soyadınız"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    E-posta
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    placeholder="E-posta adresiniz"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="gsm_number"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Telefon Numarası
                  </label>
                  <input
                    id="gsm_number"
                    type="tel"
                    name="gsm_number"
                    value={formData.gsm_number?.replace("+90", "") || ""}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, "");
                      if (input.length <= 10) {
                        setFormData((prev) => ({
                          ...prev,
                          gsm_number: input ? `+90${input}` : "",
                        }));
                      }
                    }}
                    required
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    placeholder="542 xxx xxxx"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting
                      ? "Kaydediliyor..."
                      : "Profil bilgilerini kaydet"}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-center text-gray-600">
                Kullanıcı bilgileri yükleniyor...
              </p>
            )}
          </div>
        )}

        {/* Address Step */}
        {currentStep === "address" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Adres Bilgileri
            </h3>
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="address_title"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Adres Başlığı
                  </label>
                  <input
                    id="address_title"
                    type="text"
                    name="address_title"
                    value={addressFormData.address_title || ""}
                    onChange={handleAddressInputChange}
                    placeholder="Ev, İş, vb."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact_name"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    İletişim İsmi
                  </label>
                  <input
                    id="contact_name"
                    type="text"
                    name="contact_name"
                    value={addressFormData.contact_name || ""}
                    onChange={handleAddressInputChange}
                    placeholder="Ad Soyad"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-medium mb-2 text-sm"
                >
                  Adres
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={addressFormData.address || ""}
                  onChange={handleAddressInputChange}
                  placeholder="Tam adres bilgisi"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Şehir
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={addressFormData.city || ""}
                    onChange={handleAddressInputChange}
                    placeholder="İstanbul"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="zip_code"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Posta Kodu
                  </label>
                  <input
                    id="zip_code"
                    type="text"
                    name="zip_code"
                    value={addressFormData.zip_code || ""}
                    onChange={handleAddressInputChange}
                    placeholder="34000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact_number"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Telefon
                  </label>
                  <input
                    id="contact_number"
                    type="tel"
                    name="contact_number"
                    value={
                      addressFormData.contact_number?.replace("+90", "") || ""
                    }
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, "");
                      if (input.length <= 10) {
                        setAddressFormData((prev) => ({
                          ...prev,
                          contact_number: input ? `+90${input}` : "",
                        }));
                      }
                    }}
                    placeholder="542 xxx xxxx"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="national_id"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    TC Kimlik/Vergi No
                  </label>
                  <input
                    id="national_id"
                    type="text"
                    name="national_id"
                    value={addressFormData.national_id || ""}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, "");
                      if (input.length <= 11) {
                        setAddressFormData((prev) => ({
                          ...prev,
                          national_id: input,
                        }));
                      }
                    }}
                    placeholder="12345678901"
                    maxLength={11}
                    pattern="[0-9]{11}"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("profile")}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? "Kaydediliyor..." : "Adresi kaydet"}
                </button>
              </div>
            </form>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-center">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
