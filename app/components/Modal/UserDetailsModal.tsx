import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "@/app/api/user/userApi";
import { Address } from "@/app/api/address/addressApi";

// Fix 1: Better define OrderWithTotal interface
interface OrderWithTotal {
  id: string;
  created_at: string;
  status: string;
  total_amount: number | string;
  // Add other order properties as needed
}

// Fix 2: Create an extended User type with proper order typing
interface ExtendedUser extends Omit<User, "orders"> {
  orders: OrderWithTotal[];
}

interface UserDetailsModalProps {
  user: User | null;
  userAddress: Address | null;
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

  // Fix 3: Type assertion to use our extended type
  const typedUser = user as unknown as ExtendedUser;

  // Fix 4: Use the typed user for calculation
  // Update the totalSpent calculation to ensure it handles all cases:
  // const totalSpent = typedUser.orders.reduce((sum, order) => {

  //   const amount =
  //     order.total_amount !== undefined && order.total_amount !== null
  //       ? typeof order.total_amount === "string"
  //         ? parseFloat(order.total_amount)
  //         : order.total_amount
  //       : 0;

  //   return sum + (isNaN(amount) ? 0 : amount);
  // }
  // , 0);

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
              <p className="text-gray-600">
                Kimlik No: {user.addresses?.[0]?.national_id || "Belirtilmemiş"}
              </p>
            </div>

            {/* Orders Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Sipariş Özeti
              </h3>
              <p className="text-gray-600">
                Toplam Siparişler: {typedUser.orders.length}
              </p>
              {/* Fix 5: Display calculated total amount */}
              {/* <p className="text-gray-600 font-medium">
                Harcanan Tutar:{" "}
                <span className="text-secondary">
                  {totalSpent.toFixed(2)} ₺
                </span>
              </p> */}
            </div>
          </div>

          {/* Orders List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Sipariş Geçmişi
            </h3>
            {typedUser.orders.length > 0 ? (
              <table className="w-full border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left text-gray-600">Sipariş No</th>
                    <th className="p-4 text-left text-gray-600">Tarih</th>
                    {/* <th className="p-4 text-left text-gray-600">Tutar</th> */}
                    <th className="p-4 text-left text-gray-600">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {typedUser.orders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="p-4">{order.id}</td>
                      <td className="p-4">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      {/* Fix 6: Better handle the display of total_amount */}
                      {/* 
                      <td className="p-4">
                        {order.total_amount !== undefined &&
                        order.total_amount !== null
                          ? `${
                              typeof order.total_amount === "string"
                                ? parseFloat(order.total_amount).toFixed(2)
                                : order.total_amount.toFixed(2)
                            } ₺`
                          : "0.00 ₺"}
                      </td> */}
                      <td className="p-4">
                        {{
                          pending: "Ödeme Yapılmadı",
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
