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
import { fetchDiscounts } from "../api/discount/discountApi";
import { fetchShipmentCost } from "../api/setting/settingApi"; // Import the shipment cost function
import { Snackbar } from "../components/index"; // Adjust path if needed

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalQuantity } = useSelector(
    (state: RootState) => state.cart
  );

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [shipmentCost, setShipmentCost] = useState(0);
  const [transportationFee, setTransportationFee] = useState(0);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const handleDiscountApply = async () => {
    try {
      const accessToken = localStorage.getItem("authToken");
      if (!accessToken) {
        setSnackbarMessage("Lütfen giriş yapın.");
        setSnackbarType("error");
        setSnackbarOpen(true);
        return;
      }

      // Fetch all available discounts
      const discounts = await fetchDiscounts(accessToken);

      console.log("Fetched Discounts from API:", discounts); // Debugging Log

      // Trim input, convert to lowercase, and compare properly
      const normalizedInputCode = discountCode.trim().toLowerCase();
      const foundDiscount = discounts.find(
        (discount) =>
          discount.code.trim().toLowerCase() === normalizedInputCode &&
          discount.is_active
      );

      if (!foundDiscount) {
        setSnackbarMessage("Geçersiz indirim kodu!");
        setSnackbarType("error");
        setSnackbarOpen(true);
        setAppliedDiscount(null);
        return;
      }

      // Apply the discount percentage
      setAppliedDiscount(foundDiscount.percentage_discount / 100);
      setSnackbarMessage(
        `İndirim kodu başarıyla uygulandı: %${foundDiscount.percentage_discount}`
      );
      setSnackbarType("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("İndirim kodu uygulanırken hata oluştu:", error);
      setSnackbarMessage("İndirim kodu uygulanamadı.");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const calculateTransportationFee = async () => {
      try {
        const cost = await fetchShipmentCost();
        setShipmentCost(cost);

        const totalShipmentFee = items.reduce((sum, item) => {
          const itemLength = item.length || 1;
          const itemWidth = item.width || 1;
          const itemHeight = item.height || 1;

          const itemShipmentFee =
            (itemLength * itemWidth * itemHeight * item.quantity * cost) / 3000;

          return sum + itemShipmentFee;
        }, 0);

        setTransportationFee(totalShipmentFee);
      } catch (error) {
        console.error("Failed to fetch shipment cost:", error);
      }
    };

    calculateTransportationFee();
  }, [items]);

  const calculatedTotalPrice = items.reduce(
    (sum, item) =>
      sum +
      (item.discounted_price !== null && item.discounted_price > 0
        ? item.discounted_price
        : item.price) *
        item.quantity,
    0
  );

  const discountAmount = appliedDiscount
    ? calculatedTotalPrice * appliedDiscount
    : 0;
  const finalTotal = calculatedTotalPrice - discountAmount;

  if (!isClient) return null;

  return (
    <div className=" bg-secondary mx-auto px-4 md:px-16 py-8">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <AiOutlineShoppingCart className="text-yellow-200" size={150} />
          <h2 className="text-2xl font-semibold text-gray-800">
            Sepetiniz Boş!
          </h2>
          <p className="text-white text-center max-w-md">
            Görünüşe göre sepetinize daha ürün eklememişsiniz. Ürünlerimize göz
            atın ve alışverişe başlayın!
          </p>
          <Link href="/urunler">
            <button className="bg-secondary text-white px-6 py-3 rounded-md font-semibold hover:bg-tertiary transition duration-300">
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
                        {item.discounted_price && item.discounted_price > 0
                          ? `${item.discounted_price.toFixed(
                              2
                            )} ₺ (ürün başına)`
                          : `${item.price.toFixed(2)} ₺ (ürün başına)`}
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
                      {(
                        (item.discounted_price !== null &&
                        item.discounted_price > 0
                          ? item.discounted_price
                          : item.price) * item.quantity
                      ).toFixed(2)}{" "}
                      ₺
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
                <span>Kargo Ücreti</span>
                <span>{transportationFee.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-xl font-semibold text-gray-800">
                <span>Toplam</span>
                <span>{(finalTotal + transportationFee).toFixed(2)} ₺</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>İndirim</span>
                  <span>-{discountAmount.toFixed(2)} ₺</span>
                </div>
              )}

              {/* Discount Code Field */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="İndirim Kodu"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="w-full p-3 bg-gray-200 text-black  border rounded-md focus:outline-none focus:ring focus:ring-tertiary"
                />
                <button
                  onClick={handleDiscountApply}
                  className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-tertiary focus:outline-none"
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
                  <div className="text-tertiary hover:underline">
                    Alışverişe Devam Et
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      {snackbarOpen && (
        <Snackbar
          message={snackbarMessage}
          type={snackbarType}
          onClose={() => setSnackbarOpen(false)}
        />
      )}
    </div>
  );
}
