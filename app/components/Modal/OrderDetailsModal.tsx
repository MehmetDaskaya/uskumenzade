import React from "react";
import Image from "next/image";
import { Order } from "@/app/api/order/orderApi";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  onInitiateRefund: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onInitiateRefund,
}) => {
  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-4/5 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6">Order Management</h2>

        {/* Order Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Order Information
            </h3>
            <p className="text-sm text-gray-600">Order ID: {order.id}</p>
            <p className="text-sm text-gray-600">
              Order Date: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">Status: {order.status}</p>
            <p className="text-sm text-gray-600">
              Total: {order.amount.toFixed(2)} ₺
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Customer Details
            </h3>
            <p className="text-sm text-gray-600">
              Name: {order.user.fname} {order.user.lname}
            </p>
            <p className="text-sm text-gray-600">Email: {order.user.email}</p>
            <p className="text-sm text-gray-600">
              Phone: {order.user.gsm_number}
            </p>
            <p className="text-sm text-gray-600">
              National ID: {order.user.national_id}
            </p>
          </div>
        </div>

        {/* Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Shipping Address
            </h3>
            <p className="text-sm text-gray-600">
              {order.shipping_address.address_title}
            </p>
            <p className="text-sm text-gray-600">
              {order.shipping_address.address}
            </p>
            <p className="text-sm text-gray-600">
              {order.shipping_address.city}, {order.shipping_address.state}
            </p>
            <p className="text-sm text-gray-600">
              {order.shipping_address.zip_code},{" "}
              {order.shipping_address.country}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Billing Address
            </h3>
            <p className="text-sm text-gray-600">
              {order.billing_address.address_title}
            </p>
            <p className="text-sm text-gray-600">
              {order.billing_address.address}
            </p>
            <p className="text-sm text-gray-600">
              {order.billing_address.city}, {order.billing_address.state}
            </p>
            <p className="text-sm text-gray-600">
              {order.billing_address.zip_code}, {order.billing_address.country}
            </p>
          </div>
        </div>

        {/* Product List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Products</h3>
          <ul className="space-y-4 mt-4">
            {order.basket.map((item, index) => (
              <li key={index} className="flex items-center border-b pb-4">
                <Image
                  src={item.item?.images[0]?.url || "/placeholder.png"}
                  alt={item.item?.images[0]?.alt_text || "Product Image"}
                  width={80}
                  height={80}
                  className="mr-4 rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{item.item?.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price:{" "}
                    {item.item?.discounted_price?.toFixed(2) ||
                      item.item?.price?.toFixed(2)}{" "}
                    ₺
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Actions */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Update Order Status
            </h3>
            <select
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={order.status}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={() => onInitiateRefund(order.id)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Initiate Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
