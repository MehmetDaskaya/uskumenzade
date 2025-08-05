"use client";

import { useState, useEffect } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Link from "next/link";

import { initializePayment } from "@/app/api/payment/paymentApi";
import { Address } from "@/app/api/address/addressApi";
import { fetchCurrentUser } from "@/app/api/user/userApi";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import UserInformationModal from "../components/Modal/UserInformationModal";

export default function PlaceOrder() {
  const [showModal, setShowModal] = useState(false); // ✅ default to hidden

  const handleModalClose = () => {
    setShowModal(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddressUpdate = (_updatedAddresses: Address[]) => {
    // Addresses are now handled in cart page, so this is just a placeholder
  };

  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checkoutFormContent, setCheckoutFormContent] = useState<string | null>(
    null
  );

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const checkUserInfo = async () => {
      if (!accessToken) return;

      try {
        const user = await fetchCurrentUser(accessToken);
        const hasAllFields = Boolean(
          user?.fname?.trim() &&
            user?.lname?.trim() &&
            user?.email?.trim() &&
            user?.gsm_number?.trim()
        );

        // Since address selection is now done in cart, we only check for basic user info
        if (!hasAllFields) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken hata:", error);
        setShowModal(true); // Fallback: show modal
      }
    };

    checkUserInfo();
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!accessToken) {
        alert("Authentication token is missing.");
        setIsSubmitting(false);
        return;
      }

      // Check if we have an existing order from cart confirmation
      const existingOrderId = localStorage.getItem("pendingOrderId");

      if (existingOrderId) {
        // Use existing order for payment
        const paymentResponse = await initializePayment(
          existingOrderId,
          accessToken
        );

        if (paymentResponse?.paymentPageUrl) {
          window.open(paymentResponse.paymentPageUrl, "_blank");
          localStorage.removeItem("discountCode");
          localStorage.removeItem("pendingOrderId");

          alert(
            "Ödeme sayfası yeni bir sekmede açıldı. Ödeme tamamlandıktan sonra siparişlerim sayfasından durumu kontrol edebilirsiniz."
          );
        } else {
          alert("Ödeme başlatılamadı. Lütfen tekrar deneyiniz.");
        }
      } else {
        // Fallback to old flow if no existing order
        alert(
          "Sipariş bilgisi bulunamadı. Lütfen sepet sayfasından tekrar deneyin."
        );
        router.push("/sepet");
      }
    } catch (error) {
      console.error("🚨 Failed to initialize payment:", error);
      alert("Ödeme başlatılamadı. Lütfen tekrar deneyiniz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentMessage = (event: MessageEvent) => {
    console.log("Received message:", event.data);

    // Accept messages only from expected origins
    if (event.origin.includes("iyzipay.com")) {
      try {
        // Parse JSON response
        const paymentResponse =
          typeof event.data === "string"
            ? JSON.parse(event.data) // Parse if it's a string
            : event.data;

        console.log("Payment response parsed:", paymentResponse);

        // Save payment response data in state for display
        setPaymentData(paymentResponse);

        // Check the payment status
        if (paymentResponse?.paymentStatus === "SUCCESS") {
          setPaymentMessage(
            `Payment successful! Payment ID: ${paymentResponse.paymentId}`
          );

          // Close the payment modal
          setShowPaymentModal(false);
        } else {
          setPaymentMessage("Payment failed. Please try again.");
        }
      } catch (error) {
        console.error("Error processing payment response:", error);
        setPaymentMessage("An error occurred while processing the payment.");
      }
    } else {
      console.warn("Ignored message from unexpected origin:", event.origin);
    }
  };

  useEffect(() => {
    if (checkoutFormContent) {
      const container = document.getElementById("payment-form-container");
      if (container) {
        container.innerHTML = ""; // Clear existing content

        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "600px";
        iframe.style.border = "none";
        container.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`
        
              ${checkoutFormContent}
             
        `);
          iframeDoc.close();
        }
      }

      // Add event listener for messages
      window.addEventListener("message", handlePaymentMessage);

      // Cleanup to avoid duplicate listeners
      return () => {
        window.removeEventListener("message", handlePaymentMessage);
      };
    }
  }, [checkoutFormContent]);

  return (
    <div className="mx-auto px-6 py-12 bg-secondary">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Ödeme Sayfası
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Ödeme İşlemi
          </h2>
          <p className="text-gray-600 mb-6">
            Adres bilgileriniz sepet sayfasında seçilmiştir. Ödeme işlemini
            başlatmak için aşağıdaki butona tıklayın.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center space-x-4">
          <Link href="/sepet">
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300">
              Sepete Dön
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg text-white transition duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "İşlem Devam Ediyor..." : "Ödemeye Geç"}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 ">
        {/* Display payment message */}
        {paymentMessage && (
          <div
            className={`p-4 rounded mb-4 ${
              paymentMessage.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {paymentMessage}
          </div>
        )}

        {paymentData && (
          <div className="p-4 rounded mb-4 bg-blue-100 text-blue-700">
            <h3>Payment Details:</h3>
            <pre>{JSON.stringify(paymentData, null, 2)}</pre>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl h-[700px] relative">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setIsSubmitting(true); // Set loading state
                  router.push("/siparislerim");
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                ×
              </button>
              {checkoutFormContent ? (
                <div
                  id="payment-form-container"
                  className="w-full h-full"
                ></div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p>Ödeme formu yükleniyor...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <LoadingSpinner />
        </div>
      )}
      {showModal && (
        <UserInformationModal
          isVisible={showModal}
          onClose={handleModalClose}
          onUpdateAddresses={handleAddressUpdate}
        />
      )}
    </div>
  );
}
