"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

import {
  removeItemFromCart,
  updateItemQuantity,
  clearCartOnSuccess,
  loadCartForUser,
} from "@/redux/slices/cartSlice";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

import { User } from "../api/auth/authApi";

import { fetchDiscounts } from "../api/discount/discountApi";
import {
  fetchShipmentCost,
  fetchSettingByKey,
} from "../api/setting/settingApi";

import { Snackbar } from "../components/index";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaTrashAlt, FaTag, FaTruckMoving } from "react-icons/fa";
import { AiOutlineShoppingCart, AiOutlineArrowRight } from "react-icons/ai";
import { BiMinus, BiPlus } from "react-icons/bi";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const { items, totalQuantity } = useSelector(
    (state: RootState) => state.cart
  );

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [transportationFee, setTransportationFee] = useState(0);
  const [minOrderValue, setMinOrderValue] = useState<number | null>(null);
  const [freeShipmentThreshold, setFreeShipmentThreshold] = useState<
    number | null
  >(null);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { getAuthenticatedUser } = useAuthRedirect();
  const [user, setUser] = useState<User | null>(null);
  const [userError, setUserError] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const authenticatedUser = await getAuthenticatedUser();
        if (!authenticatedUser) {
          setUserError(true);
        } else {
          setUser(authenticatedUser);
        }
      } catch {
        setUserError(true);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userError) {
      router.push("/giris");
    }
  }, [userError, router]);

  useEffect(() => {
    if (user?.email) {
      dispatch(loadCartForUser(user.email));
    }
  }, [user?.email, dispatch]);

  useEffect(() => {
    // Always clear stored discount code when returning to cart
    localStorage.removeItem("discountCode");
  }, []);

  useEffect(() => {
    setIsClient(true);
    const paymentStatus = localStorage.getItem("paymentStatus");
    if (paymentStatus === "success" && user?.email) {
      dispatch(clearCartOnSuccess(user.email));
      localStorage.removeItem("paymentStatus");
    }
  }, [user, dispatch]);

  useEffect(() => {
    const loadDiscountFromStorage = async () => {
      const savedCode = localStorage.getItem("discountCode");
      const userEmail = user?.email;

      if (!savedCode || !userEmail) return;

      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const discounts = await fetchDiscounts(token);
        const matched = discounts.find(
          (d) => d.code.toLowerCase() === savedCode.toLowerCase() && d.is_active
        );

        const total = items.reduce((sum, item) => {
          const price =
            item.discounted_price > 0 ? item.discounted_price : item.price;
          return sum + price * item.quantity;
        }, 0);

        if (matched && total >= matched.min_order_value) {
          const discountAmount = matched.is_percentage
            ? matched.discount_value / 100
            : matched.discount_value;

          setDiscountCode("");

          setAppliedDiscount(discountAmount);
        } else {
          // Remove invalid discount
          localStorage.removeItem("discountCode");
          setAppliedDiscount(null);
        }
      } catch (error) {
        console.error("Stored discount failed to load:", error);
      }
    };

    loadDiscountFromStorage();
  }, [items]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const minOrder = await fetchSettingByKey("min_order_value");
        const freeShipping = await fetchSettingByKey("free_shipment_threshold");

        if (minOrder) setMinOrderValue(parseFloat(minOrder.value));
        if (freeShipping)
          setFreeShipmentThreshold(parseFloat(freeShipping.value));
      } catch (error) {
        console.error("Ayarlar alınırken hata oluştu:", error);
        setSnackbarMessage("Ayarlar yüklenemedi.");
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    };

    fetchSettings();
  }, []);

  type DiscountWithOrders = {
    code: string;
    discount_value: number;
    is_percentage: boolean;
    is_active: boolean;
    min_order_value: number;
    max_uses_per_user?: number;
    orders: { discount_code: string; status: string }[];
  };

  const handleDiscountApply = async () => {
    if (!discountCode.trim()) {
      setSnackbarMessage("Lütfen bir indirim kodu girin.");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const userEmail = user?.email;

      if (!userEmail) {
        setSnackbarMessage("Lütfen giriş yapın.");
        setSnackbarType("error");
        setSnackbarOpen(true);
        return;
      }

      if (!userEmail) return;

      const token = localStorage.getItem("authToken");
      if (!token) return;
      const discounts = await fetchDiscounts(token);
      const normalizedInputCode = discountCode.trim().toLowerCase();

      const rawDiscount = discounts.find(
        (d) =>
          d.code.trim().toLowerCase() === normalizedInputCode && d.is_active
      );

      if (!rawDiscount) {
        setSnackbarMessage("Geçersiz indirim kodu!");
        setSnackbarType("error");
        setSnackbarOpen(true);
        setAppliedDiscount(null);
        localStorage.removeItem("discountCode");
        return;
      }

      // Ensure 'orders' field exists
      if (!("orders" in rawDiscount)) {
        setSnackbarMessage("İndirim verisi geçersiz.");
        setSnackbarType("error");
        setSnackbarOpen(true);
        return;
      }

      const foundDiscount = rawDiscount as DiscountWithOrders;

      if (!foundDiscount) {
        setSnackbarMessage("Geçersiz indirim kodu!");
        setSnackbarType("error");
        setSnackbarOpen(true);
        setAppliedDiscount(null);
        localStorage.removeItem("discountCode");
        return;
      }

      // ✅ Check max uses per user
      const userUsageCount = foundDiscount.orders.filter(
        (order: { discount_code: string; status: string }) =>
          order.discount_code.toLowerCase() === normalizedInputCode &&
          order.status !== "cancelled"
      ).length;

      if (
        foundDiscount.max_uses_per_user &&
        userUsageCount >= foundDiscount.max_uses_per_user
      ) {
        setSnackbarMessage("Bu indirim kodunu daha fazla kullanamazsınız.");
        setSnackbarType("error");
        setSnackbarOpen(true);
        return;
      }

      // ✅ Check min order value (include shipping if needed)
      if (
        calculatedTotalPrice + transportationFee <
        foundDiscount.min_order_value
      ) {
        setSnackbarMessage(
          `Bu indirim için minimum sipariş tutarı ₺${foundDiscount.min_order_value.toFixed(
            2
          )} olmalıdır!`
        );
        setSnackbarType("error");
        setSnackbarOpen(true);
        setAppliedDiscount(null);
        return;
      }

      // ✅ Apply discount
      const isPercentage = foundDiscount.is_percentage;
      const value = foundDiscount.discount_value;

      setAppliedDiscount(isPercentage ? value / 100 : value);
      localStorage.setItem("discountCode", foundDiscount.code);
      setDiscountCode("");

      const displayText = isPercentage
        ? `%${foundDiscount.discount_value} indirim`
        : `${foundDiscount.discount_value}₺ indirim`;

      setSnackbarMessage(`İndirim kodu başarıyla uygulandı: ${displayText}`);
      setSnackbarType("success");
      setSnackbarOpen(true);
    } catch (error: unknown) {
      console.error("İndirim kodu uygulanırken hata oluştu:", error);
      const err = error as {
        response?: { data?: { detail?: string } };
      };

      const msg =
        err?.response?.data?.detail === "Discount max uses per user exceeded"
          ? "Bu indirim kodunu en fazla bir kez kullanabilirsiniz."
          : "İndirim kodu uygulanamadı.";

      setSnackbarMessage(msg);
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  const calculatedTotalPrice = items.reduce(
    (sum, item) =>
      sum +
      (item.discounted_price !== null && item.discounted_price > 0
        ? item.discounted_price
        : item.price) *
        item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedDiscount !== null) {
    if (appliedDiscount < 1) {
      // percentage-based
      discountAmount = calculatedTotalPrice * appliedDiscount;
    } else {
      // flat amount
      discountAmount = appliedDiscount;
    }
  }

  const finalTotal =
    appliedDiscount !== null
      ? appliedDiscount < 1
        ? calculatedTotalPrice * (1 - appliedDiscount)
        : calculatedTotalPrice - appliedDiscount
      : calculatedTotalPrice;

  useEffect(() => {
    if (appliedDiscount !== null) {
      const discountCodeFromStorage = localStorage.getItem("discountCode");

      if (discountCodeFromStorage) {
        const fetchAndValidateDiscount = async () => {
          const userEmail = user?.email;

          if (!userEmail) return;

          const token = localStorage.getItem("authToken");
          if (!token) return;
          const discounts = await fetchDiscounts(token);
          const matchingDiscount = discounts.find(
            (discount) =>
              discount.code === discountCodeFromStorage && discount.is_active
          );

          if (
            matchingDiscount &&
            calculatedTotalPrice < matchingDiscount.min_order_value
          ) {
            setSnackbarMessage(
              `Sipariş tutarınız ₺${matchingDiscount.min_order_value.toFixed(
                2
              )} altına düştü. İndirim iptal edildi.`
            );
            setSnackbarType("error");
            setSnackbarOpen(true);
            setAppliedDiscount(null);
            localStorage.removeItem("discountCode");
          }
        };

        fetchAndValidateDiscount();
      }
    }
  }, [calculatedTotalPrice, appliedDiscount]);

  useEffect(() => {
    const calculateTransportationFee = async () => {
      try {
        const cost = await fetchShipmentCost();

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

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-quaternary to-tertiary px-4 md:px-16 py-12">
      <div className="max-w-7xl mx-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 transition-all duration-300">
            <div className="text-yellow-200 animate-pulse">
              <AiOutlineShoppingCart size={160} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-wider">
              Sepetiniz Boş!
            </h2>
            <p className="text-white text-center max-w-md text-lg">
              Görünüşe göre sepetinize henüz ürün eklememişsiniz. Ürünlerimize
              göz atın ve alışverişe başlayın!
            </p>
            <Link href="/urunler">
              <button className="bg-secondary hover:bg-tertiary text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg">
                <span>Alışverişe Başla</span>
                <AiOutlineArrowRight />
              </button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-white mb-8 pl-2 border-l-4 border-secondary">
              Sepetiniz
            </h1>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="w-full lg:w-2/3 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white bg-opacity-95 rounded-xl shadow-xl p-6 flex flex-col md:flex-row items-center md:items-center justify-between transition-all duration-300 hover:shadow-2xl border border-gray-200 hover:border-secondary"
                  >
                    <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                      <div className="relative mb-4 md:mb-0 md:mr-6">
                        <Image
                          src={item.imageUrl || "/placeholder.png"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover shadow-md"
                        />
                        {item.discounted_price &&
                          item.discounted_price < item.price && (
                            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                              İndirimli
                            </div>
                          )}
                      </div>
                      <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">
                          {item.name}
                        </h2>
                        <div className="flex items-center justify-center md:justify-start text-gray-600 mb-2">
                          {item.discounted_price &&
                          item.discounted_price < item.price ? (
                            <>
                              <span className="line-through text-red-400 mr-2">
                                {item.price.toFixed(2)} ₺
                              </span>
                              <span className="font-semibold text-green-600">
                                {item.discounted_price.toFixed(2)} ₺
                              </span>
                            </>
                          ) : (
                            <span>{item.price.toFixed(2)} ₺</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Stok: {item.stock} adet
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-full bg-gray-50 shadow-inner">
                        <button
                          onClick={() => {
                            if (user?.email && item.quantity > 1) {
                              dispatch(
                                updateItemQuantity({
                                  userId: user.email,
                                  id: item.id,
                                  quantity: item.quantity - 1,
                                })
                              );
                            }
                          }}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-50 rounded-l-full transition-colors"
                          aria-label="Azalt"
                        >
                          <BiMinus />
                        </button>

                        <span className="px-6 font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => {
                            if (user?.email && item.quantity < item.stock) {
                              dispatch(
                                updateItemQuantity({
                                  userId: user.email,
                                  id: item.id,
                                  quantity: item.quantity + 1,
                                })
                              );
                            }
                          }}
                          disabled={item.quantity >= item.stock}
                          className={`px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-r-full transition-colors ${
                            item.quantity >= item.stock
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          aria-label="Artır"
                        >
                          <BiPlus />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-gray-800 ml-0 md:ml-4 md:mr-4 min-w-24 text-center">
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
                          const userEmail = user?.email;

                          if (!userEmail) {
                            console.error("Access token is not available.");
                            return;
                          }

                          if (userEmail) {
                            dispatch(
                              removeItemFromCart({
                                userId: userEmail,
                                id: item.id,
                              })
                            );
                            setSnackbarMessage("Ürün sepetten kaldırıldı.");
                            setSnackbarType("success");
                            setSnackbarOpen(true);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-red-100"
                        aria-label="Sil"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="w-full lg:w-1/3 bg-white bg-opacity-95 rounded-xl shadow-xl p-6 space-y-6 border border-gray-200 hover:border-secondary transition-all duration-300 sticky top-6 self-start">
                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 flex items-center gap-2">
                  <AiOutlineShoppingCart className="text-secondary" size={24} />
                  Sipariş Özeti
                </h2>

                <div>
                  <div className="flex justify-between text-gray-600 py-2">
                    <span>Ürünler ({totalQuantity} adet)</span>
                    <span className="font-medium">
                      {calculatedTotalPrice.toFixed(2)} ₺
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 py-2 items-center">
                    <span className="flex items-center gap-2">
                      <FaTruckMoving className="text-secondary" />
                      Kargo Ücreti
                    </span>
                    <span
                      className={`font-medium ${
                        freeShipmentThreshold !== null &&
                        calculatedTotalPrice >= freeShipmentThreshold
                          ? "text-green-600"
                          : ""
                      }`}
                    >
                      {freeShipmentThreshold !== null &&
                      calculatedTotalPrice >= freeShipmentThreshold
                        ? "Ücretsiz"
                        : `${transportationFee.toFixed(2)} ₺`}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-gray-600 py-2 items-center">
                      <span className="flex items-center gap-2">
                        <FaTag className="text-green-500" />
                        İndirim
                      </span>
                      <span className="font-medium text-green-600">
                        -{discountAmount.toFixed(2)} ₺
                      </span>
                    </div>
                  )}
                </div>

                {freeShipmentThreshold !== null &&
                  finalTotal < freeShipmentThreshold && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                        <FaTruckMoving className="text-blue-500" />
                        {(freeShipmentThreshold - calculatedTotalPrice).toFixed(
                          2
                        )}
                        ₺ daha ekleyin
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (calculatedTotalPrice / freeShipmentThreshold) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                <div className="flex justify-between text-xl font-bold text-gray-800 pt-4 border-t border-gray-200">
                  <span>Genel Toplam</span>
                  <span className="text-secondary">
                    {(
                      finalTotal +
                      (freeShipmentThreshold !== null &&
                      calculatedTotalPrice >= freeShipmentThreshold
                        ? 0
                        : transportationFee)
                    ).toFixed(2)}{" "}
                    ₺
                  </span>
                </div>

                {minOrderValue !== null &&
                  calculatedTotalPrice < minOrderValue && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-red-600 font-medium">
                        Minimum sepet tutarı: {minOrderValue.toFixed(2)} ₺
                        <br />
                        Ödeme yapabilmek için{" "}
                        {(minOrderValue - calculatedTotalPrice).toFixed(2)} ₺
                        değerinde daha ürün eklemelisiniz.
                      </p>
                    </div>
                  )}

                {/* Discount Code Field */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    İndirim Kodu
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Kodunuzu buraya girin"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="w-full p-3 bg-gray-100 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent transition-all"
                    />
                    <button
                      onClick={handleDiscountApply}
                      className="bg-secondary text-white px-4 py-3 rounded-lg hover:bg-tertiary focus:outline-none transition-all duration-300 whitespace-nowrap"
                    >
                      Uygula
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="odeme" className="block">
                  <button
                    className={`w-full py-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${
                      minOrderValue !== null &&
                      calculatedTotalPrice < minOrderValue
                        ? "bg-gray-400 cursor-not-allowed opacity-70"
                        : "bg-green-600 hover:bg-green-700 transform hover:scale-105 shadow-lg"
                    }`}
                    disabled={
                      minOrderValue !== null &&
                      calculatedTotalPrice < minOrderValue
                    }
                  >
                    <span>Ödeme Adımına Geç</span>
                    <AiOutlineArrowRight />
                  </button>
                </Link>

                {/* Link to Products Page */}
                <div className="text-center pt-4">
                  <Link href="/urunler">
                    <div className="text-tertiary hover:text-secondary transition-colors duration-300 font-medium hover:underline flex items-center justify-center gap-2">
                      <AiOutlineShoppingCart />
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
    </div>
  );
}
