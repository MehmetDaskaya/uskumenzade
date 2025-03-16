"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchCurrentUser, updateUser, User } from "@/app/api/user/userApi";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  Address,
} from "@/app/api/address/addressApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function Profile() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressFormData, setAddressFormData] = useState<
    Partial<Address> & { id?: string }
  >({
    address: "",
    zip_code: "",
    city: "",
    country: "",
    address_title: "",
    contact_name: "",
  });

  const [isAddressEditing, setIsAddressEditing] = useState(false);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Fetch user and address data

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        // Fetch the user data, including addresses
        const userData = await fetchCurrentUser(accessToken);
        setUser(userData);
        setFormData(userData);

        // Use the addresses from the user data
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
      const updatedUser = await updateUser(formData, accessToken);
      setUser(updatedUser);

      setIsEditing(false);
      setSuccessMessage("Profil bilgileri başarıyla güncellendi!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Profil bilgileri güncellenemedi. Tekrar deneyiniz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address Handlers
  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { address, zip_code, city, address_title } = addressFormData;

    if (!address || !zip_code || !city || !address_title) {
      alert("Lütfen tüm adres bilgilerini doldurun.");
      return;
    }
    try {
      if (isAddressEditing && addressFormData.id) {
        const updatedAddress = await updateAddress(
          addressFormData.id,
          {
            address,
            zip_code,
            city,
            country: "Türkiye", // ✅ Set default country
            state: addressFormData.state || "",
            address_title,
            contact_name: addressFormData.contact_name || "",
            national_id: addressFormData.national_id || "",
            contact_number: addressFormData.contact_number || "",
          },
          accessToken || ""
        );

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === updatedAddress.id ? updatedAddress : addr
          )
        );
        setSuccessMessage("Adres başarıyla güncellendi.");
      } else {
        const newAddress = await createAddress(
          {
            address,
            zip_code,
            city,
            country: "Türkiye", // ✅ Set default country
            state: addressFormData.state || "",
            address_title,
            contact_name: addressFormData.contact_name || "",
            national_id: addressFormData.national_id || "",
            contact_number: addressFormData.contact_number || "",
          },
          accessToken || ""
        );

        setAddresses((prev) => [...prev, newAddress]);
        setSuccessMessage("Adres başarıyla eklendi.");
      }

      // Reset the form after submission
      setAddressFormData({
        address: "",
        zip_code: "",
        city: "",
        country: "",
        address_title: "",
        contact_name: "",
      });
      setIsAddressEditing(false);
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Adres kaydedilemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      if (!accessToken) return;
      await deleteAddress(addressId, accessToken);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      setSuccessMessage("Adres başarıyla silindi!");
    } catch (error) {
      console.error("Failed to delete address:", error);
      alert("Failed to delete address. Please try again.");
    }
  };

  return (
    <div className=" mx-auto px-6 py-12 bg-secondary">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-12">
        {/* User Profile Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Profilim
          </h1>
          {user ? (
            // Replace the input fields with label + input structures, for example:

            <form onSubmit={handleUserSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Kişisel Bilgiler
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fname"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Ad
                    </label>
                    <input
                      id="fname"
                      type="text"
                      name="fname"
                      value={formData.fname || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Ad"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary text-black bg-gray-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lname"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Soyad
                    </label>
                    <input
                      id="lname"
                      type="text"
                      name="lname"
                      value={formData.lname || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Soyad"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary text-black bg-gray-200"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    E-posta
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="E-posta"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary text-black bg-gray-200"
                  />
                </div>

                <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="gsm_number"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Telefon Numarası
                    </label>
                    <input
                      id="gsm_number"
                      type="tel"
                      name="gsm_number"
                      value={formData.gsm_number || ""}
                      onChange={(e) => {
                        e.currentTarget.setCustomValidity("");
                        handleInputChange(e);
                      }}
                      onInvalid={(e) => {
                        e.currentTarget.setCustomValidity(
                          "Telefon numarası +905557778899 formatında olmalı (13 karakter ve yalnızca rakam)."
                        );
                      }}
                      disabled={!isEditing}
                      required
                      pattern="^\+[0-9]{12}$"
                      maxLength={13}
                      placeholder="Telefon Numarası"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary text-black bg-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Kaydet
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-tertiary"
                  >
                    Düzenle
                  </button>
                )}
              </div>
            </form>
          ) : (
            <p className="text-center text-gray-600">
              Kullanıcı bilgileri yükleniyor...
            </p>
          )}
        </div>

        {/* Address Section */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
          {/* Address Management Section */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              {isAddressEditing ? "Adresi Düzenle" : "Adres Ekle"}
            </h2>

            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="address_title"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Adres Başlığı
                  </label>
                  <input
                    id="address_title"
                    type="text"
                    name="address_title"
                    value={addressFormData.address_title || ""}
                    onChange={handleAddressInputChange}
                    placeholder="Adres Başlığı"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact_name"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    İletişim İsmi
                  </label>
                  <input
                    id="contact_name"
                    type="text"
                    name="contact_name"
                    value={addressFormData.contact_name || ""}
                    onChange={handleAddressInputChange}
                    placeholder="İletişim İsmi"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Adres
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={addressFormData.address || ""}
                    onChange={handleAddressInputChange}
                    placeholder="Adres"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact_number"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Telefon Numarası
                  </label>
                  <input
                    id="contact_number"
                    type="tel"
                    name="contact_number"
                    value={addressFormData.contact_number || ""}
                    onChange={handleAddressInputChange}
                    onInvalid={(e) => {
                      e.currentTarget.setCustomValidity(
                        "Telefon numarası +905557778899 formatında olmalı (13 karakter ve yalnızca rakam)."
                      );
                    }}
                    required
                    pattern="^\+[0-9]{12}$"
                    maxLength={13}
                    placeholder="Telefon Numarası"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Şehir
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={addressFormData.city || ""}
                    onChange={handleAddressInputChange}
                    placeholder="Şehir"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="zip_code"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Posta Kodu
                  </label>
                  <input
                    id="zip_code"
                    type="text"
                    name="zip_code"
                    value={addressFormData.zip_code || ""}
                    onChange={handleAddressInputChange}
                    placeholder="Posta Kodu"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="national_id"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    TC Kimlik/Vergi Numarası
                  </label>
                  <input
                    id="national_id"
                    type="text"
                    name="national_id"
                    value={addressFormData.national_id || ""}
                    onChange={handleAddressInputChange}
                    required
                    pattern="^[0-9]{11}$"
                    maxLength={11}
                    placeholder="TC Kimlik Numarası"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary bg-gray-200 text-black"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isAddressEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddressEditing(false);
                        setAddressFormData({});
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Güncelle
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Ekle
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Vertical Divider */}
          <div className="w-0.5 bg-gray-300"></div>

          {/* Saved Addresses Section */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Kayıtlı Adresler
            </h2>
            {addresses.length === 0 ? (
              <p className="text-gray-700 text-center">
                Henüz bir adres eklenmedi. Yeni bir adres eklemek için formu
                kullanabilirsiniz.
              </p>
            ) : (
              <ul className="space-y-6">
                {addresses.map((addr) => (
                  <li
                    key={addr.id}
                    className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-between items-start"
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {addr.address_title}
                      </h3>
                      <p className="text-gray-700">
                        <span className="font-medium">Adres:</span>{" "}
                        {addr.address}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Şehir:</span> {addr.city}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium">Posta Kodu:</span>{" "}
                        {addr.zip_code}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Ülke:</span>{" "}
                        {addr.country}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">İletişim:</span>{" "}
                        {addr.contact_name || "Belirtilmedi"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">İletişim Numarası:</span>{" "}
                        {addr.contact_number || "Belirtilmedi"}
                      </p>
                    </div>
                    <div className="space-x-4 flex-shrink-0">
                      <button
                        onClick={() => {
                          setIsAddressEditing(true);
                          setAddressFormData(addr);
                        }}
                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-tertiary"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id!)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Saved Addresses Section */}
          </div>
        </div>
      </div>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md z-50 transition-opacity">
          {successMessage}
        </div>
      )}
    </div>
  );
}
