import React from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "@/app/api/user/userApi";

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
}) => {
  if (!user) return null;

  const totalOrders = user.orders.length;
  const totalSpent = user.orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Kullanıcı Detayları: {user.fname} {user.lname}
        </h2>
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
            <p className="text-gray-600">Toplam Siparişler: {totalOrders}</p>
            <p className="text-gray-600">Harcanan Tutar: {totalSpent} ₺</p>
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
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">Kullanıcı henüz sipariş vermemiş.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
