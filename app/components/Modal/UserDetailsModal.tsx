import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "@/app/api/user/userApi";

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
  onUpdateRole: (userId: string, newRole: string, password: string) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
  onUpdateRole,
}) => {
  const [newRole, setNewRole] = useState(user?.role || "");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = () => {
    if (honeypot) {
      console.warn("Honeypot triggered. Logging out...");
      // Trigger logout or any other security action
      onClose();
      return;
    }

    if (!password) {
      alert("Lütfen şifrenizi giriniz.");
      return;
    }

    if (user) {
      onUpdateRole(user.id, newRole, password);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Kullanıcı Detayları: {user.fname} {user.lname}
        </h2>

        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Kişisel Bilgiler
              </h3>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Telefon: {user.gsm_number}</p>
              <p className="text-gray-600">Rol: {user.role}</p>
              <p className="text-gray-600">Kimlik No: {user.national_id}</p>
            </div>

            {/* Orders Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Sipariş Özeti
              </h3>
              <p className="text-gray-600">
                Toplam Siparişler: {user.orders.length}
              </p>
              <p className="text-gray-600">
                Harcanan Tutar:{" "}
                {user.orders.reduce((sum, order) => sum + order.amount, 0)} ₺
              </p>
            </div>
          </div>

          {/* Orders List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Sipariş Geçmişi
            </h3>
            {user.orders.length > 0 ? (
              <table className="w-full border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left text-gray-600">Sipariş No</th>
                    <th className="p-4 text-left text-gray-600">Tarih</th>
                    <th className="p-4 text-left text-gray-600">Tutar</th>
                    <th className="p-4 text-left text-gray-600">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {user.orders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="p-4">{order.id}</td>
                      <td className="p-4">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">{order.amount.toFixed(2)} ₺</td>
                      <td className="p-4">
                        {{
                          pending: "Beklemede",
                          processing: "İşleniyor",
                          shipped: "Kargolandı",
                          delivered: "Teslim Edildi",
                          cancelled: "İptal Edildi",
                          paid: "Ödeme Yapıldı",
                        }[order.status] || order.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">Kullanıcı henüz sipariş vermemiş.</p>
            )}
          </div>

          {/* Role Update Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Kullanıcı Rolünü Güncelle
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Rol
              </label>
              <select
                className="w-full p-3 bg-gray-200 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="user">Kullanıcı</option>
                <option value="admin">Yönetici</option>
                <option value="superadmin">Süper Yönetici</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifrenizi Girin
              </label>
              <input
                type="password"
                className="w-full p-3 bg-gray-200 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Honeypot */}
            <div className="hidden">
              <label>
                Do not fill this field:
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Rolü Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
