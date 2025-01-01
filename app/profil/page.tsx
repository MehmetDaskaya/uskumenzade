"use client";

import { useState, useEffect } from "react";
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
      alert("Profil bilgileri başarıyla güncellendi!");
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

    const { address, zip_code, city, country, address_title } = addressFormData;

    // Update validation logic to reflect only the inputs present in the form
    if (!address || !zip_code || !city || !country || !address_title) {
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
            country,
            address_title,
            contact_name: addressFormData.contact_name || "", // Optional contact name handling
          },
          accessToken || ""
        );
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === updatedAddress.id ? updatedAddress : addr
          )
        );
        alert("Adres başarıyla güncellendi.");
      } else {
        const newAddress = await createAddress(
          {
            address,
            zip_code,
            city,
            country,
            address_title,
            contact_name: addressFormData.contact_name || "", // Optional contact name handling
          },
          accessToken || ""
        );
        setAddresses((prev) => [...prev, newAddress]);
        alert("Adres başarıyla eklendi.");
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
      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Failed to delete address:", error);
      alert("Failed to delete address. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-12">
        {/* User Profile Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Profilim
          </h1>
          {user ? (
            <form onSubmit={handleUserSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Kişisel Bilgiler
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="fname"
                    value={formData.fname || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Ad"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="text"
                    name="lname"
                    value={formData.lname || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Soyad"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="E-posta"
                  className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="gsm_number"
                    value={formData.gsm_number || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="GSM Numarası"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="text"
                    name="national_id"
                    value={formData.national_id || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Kimlik Numarası"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
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
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
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
        <div className="flex space-x-8">
          {/* Address Management Section */}
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Adres Yönetimi
            </h2>
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="address_title"
                  value={addressFormData.address_title || ""}
                  onChange={handleAddressInputChange}
                  placeholder="Adres Başlığı"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 text-black"
                  required
                />
                <input
                  type="text"
                  name="contact_name"
                  value={addressFormData.contact_name || ""}
                  onChange={handleAddressInputChange}
                  placeholder="İletişim İsmi"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 text-black"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={addressFormData.address || ""}
                  onChange={handleAddressInputChange}
                  placeholder="Adres"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 text-black"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={addressFormData.city || ""}
                  onChange={handleAddressInputChange}
                  placeholder="Şehir"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 text-black"
                  required
                />

                <input
                  type="text"
                  name="zip_code"
                  value={addressFormData.zip_code || ""}
                  onChange={handleAddressInputChange}
                  placeholder="Posta Kodu"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 text-black"
                  required
                />
                <input
                  type="text"
                  name="country"
                  value={addressFormData.country || ""}
                  onChange={handleAddressInputChange}
                  placeholder="Ülke"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 text-black"
                  required
                />
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
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Kayıtlı Adresler
            </h2>
            {/* Saved Addresses Section */}
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
                      <span className="font-medium">Adres:</span> {addr.address}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Şehir:</span> {addr.city}
                    </p>

                    <p className="text-gray-700">
                      <span className="font-medium">Posta Kodu:</span>{" "}
                      {addr.zip_code}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Ülke:</span> {addr.country}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">İletişim:</span>{" "}
                      {addr.contact_name || "Belirtilmedi"}
                    </p>
                  </div>
                  <div className="space-x-4 flex-shrink-0">
                    <button
                      onClick={() => {
                        setIsAddressEditing(true);
                        setAddressFormData(addr);
                      }}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id!)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
