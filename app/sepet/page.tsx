"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "Herbal Tea",
    price: 200,
    imageUrl: "/images/herbal-tea.webp",
    quantity: 2,
  },
  {
    id: 2,
    name: "Herbal Oil",
    price: 300,
    imageUrl: "/images/herbal-oil.webp",
    quantity: 1,
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);

  const handleRemoveItem = (itemId: number) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  const handleDiscountApply = () => {
    if (discountCode === "DISCOUNT10") {
      setAppliedDiscount(0.1);
    } else {
      setAppliedDiscount(null);
      alert("Invalid discount code");
    }
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discountAmount = appliedDiscount ? subtotal * appliedDiscount : 0;
  const total = subtotal - discountAmount;

  return (
    <div className="container mx-auto px-4 md:px-16 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="w-full md:w-2/3 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">{item.price} ₺ each</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {item.price * item.quantity} ₺
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Order Summary
            </h2>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span>-{discountAmount.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-xl font-semibold text-gray-800">
              <span>Total</span>
              <span>{total.toFixed(2)} ₺</span>
            </div>

            {/* Discount Code Field */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
              />
              <button
                onClick={handleDiscountApply}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none"
              >
                Apply
              </button>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-300">
              Proceed to Checkout
            </button>

            {/* Link to Products Page */}
            <div className="text-center mt-4">
              <Link href="/urunler">
                <div className="text-yellow-500 hover:underline">
                  Continue Shopping
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
