"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  removeItemFromCart,
  updateItemQuantity,
  clearCartOnSuccess,
  loadCartForUser,
} from "@/redux/slices/cartSlice";
import { fetchCurrentUser } from "../api/auth/authApi";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalQuantity, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false); // Ensure hydration consistency

  // Ensure the component is client-side

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const accessToken = localStorage.getItem("authToken");
        let userEmail = null;

        if (accessToken) {
          const userData = await fetchCurrentUser(accessToken);
          userEmail = userData?.email || null;
        }

        // Load the cart for the current user
        dispatch(loadCartForUser(userEmail));
      } catch (error) {
        console.error("Error initializing cart:", error);
      }
    };

    initializeCart();
  }, [dispatch]);

  useEffect(() => {
    setIsClient(true);
    const fetchUserAndHandleCart = async () => {
      try {
        const paymentStatus = localStorage.getItem("paymentStatus");
        if (paymentStatus === "success") {
          const accessToken = localStorage.getItem("authToken");
          let userEmail = null;

          if (accessToken) {
            const userData = await fetchCurrentUser(accessToken);
            userEmail = userData?.email || null;
          }

          // Always pass the `userEmail` or `null` to the action
          dispatch(clearCartOnSuccess(userEmail));

          // Clear payment status after successful cart clearing
          localStorage.removeItem("paymentStatus");
        }
      } catch (error) {
        console.error("Error clearing cart on success:", error);
      }
    };

    fetchUserAndHandleCart();
  }, [dispatch]);

  const handleDiscountApply = () => {
    if (discountCode === "DISCOUNT10") {
      setAppliedDiscount(0.1);
    } else {
      setAppliedDiscount(null);
      alert("Invalid discount code");
    }
  };

  const discountAmount = appliedDiscount ? totalPrice * appliedDiscount : 0;
  const finalTotal = totalPrice - discountAmount;

  if (!isClient) return null; // Render nothing on the server

  return (
    <div className="container bg-yellow-500 mx-auto px-4 md:px-16 py-8">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <AiOutlineShoppingCart className="text-yellow-200" size={150} />
          <h2 className="text-2xl font-semibold text-gray-800">
            Sepetiniz Boş!
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            Görünüşe göre sepetinize daha ürün eklememişsiniz. Ürünlerimize göz
            atın ve alışverişe başlayın!
          </p>
          <Link href="/urunler">
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-yellow-600 transition duration-300">
              Alışverişe Başla
            </button>
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold  text-gray-100 mb-6">Sepet</h1>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="w-full md:w-2/3 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {item.name}
                      </h2>
                      <p className="text-gray-600">
                        {item.discounted_price.toFixed(2)} ₺ (ürün başına)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={async () => {
                          const accessToken = localStorage.getItem("authToken");
                          if (!accessToken) {
                            console.error("Access token is not available.");
                            return; // Prevent further execution if accessToken is null
                          }
                          const userData = await fetchCurrentUser(accessToken);
                          const userEmail = userData?.email;

                          if (userEmail) {
                            dispatch(
                              updateItemQuantity({
                                userId: userEmail,
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            );
                          }
                        }}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                      >
                        -
                      </button>

                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={async () => {
                          const accessToken = localStorage.getItem("authToken");
                          if (!accessToken) {
                            console.error("Access token is not available.");
                            return; // Prevent further execution if accessToken is null
                          }
                          const userData = await fetchCurrentUser(accessToken);
                          const userEmail = userData?.email;

                          if (userEmail) {
                            dispatch(
                              updateItemQuantity({
                                userId: userEmail,
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            );
                          }
                        }}
                        disabled={item.quantity >= item.stock}
                        className={`px-3 py-1 text-gray-600 hover:bg-gray-200 ${
                          item.quantity >= item.stock
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {(item.discounted_price * item.quantity).toFixed(2)} ₺
                    </p>
                    <button
                      onClick={async () => {
                        const accessToken = localStorage.getItem("authToken");
                        if (!accessToken) {
                          console.error("Access token is not available.");
                          return; // Prevent further execution if accessToken is null
                        }
                        const userData = await fetchCurrentUser(accessToken);
                        const userEmail = userData?.email;

                        if (userEmail) {
                          dispatch(
                            removeItemFromCart({
                              userId: userEmail,
                              id: item.id,
                            })
                          );
                        }
                      }}
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
                Sipariş Özeti
              </h2>
              <div className="flex justify-between text-gray-600">
                <span>Sepetteki Ürünler</span>
                <span>{totalQuantity}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Toplam</span>
                <span>{totalPrice.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>İndirim</span>
                <span>-{discountAmount.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-xl font-semibold text-gray-800">
                <span>Toplam</span>
                <span>{finalTotal.toFixed(2)} ₺</span>
              </div>

              {/* Discount Code Field */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="İndirim Kodu"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="w-full p-3 bg-gray-200 text-black  border rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
                />
                <button
                  onClick={handleDiscountApply}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none"
                >
                  Uygula
                </button>
              </div>

              {/* Checkout Button */}
              <Link href="odeme">
                <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-300">
                  Ödeme Adımına Geç
                </button>
              </Link>

              {/* Link to Products Page */}
              <div className="text-center mt-4">
                <Link href="/urunler">
                  <div className="text-yellow-500 hover:underline">
                    Alışverişe Devam Et
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
