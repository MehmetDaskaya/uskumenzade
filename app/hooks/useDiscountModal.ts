import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { fetchDiscounts } from "@/app/api/discount/discountApi";
import type { Discount } from "@/app/api/discount/discountApi";
import { RootState } from "@/redux/store";

type ModalType = "regular" | "exit-intent" | "cart";

export const useDiscountModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [modalType, setModalType] = useState<ModalType>("regular");
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const cart = useSelector((state: RootState) => state.cart?.items || []);

  const [hasScrolled, setHasScrolled] = useState(false);

  const isLoggedIn = !!accessToken;
  const isNewVisitor =
    typeof window !== "undefined" && !localStorage.getItem("returning_visitor");

  const lastShownTime =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("last_discount_modal") || "0")
      : 0;

  const dismissedUntil =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("discount_modal_dismissed_until") || "0")
      : 0;

  const hasSeenDiscountAsGuest =
    typeof window !== "undefined" &&
    sessionStorage.getItem("seenDiscountPopupGuest") === "true";

  const hasSeenDiscountAsUser =
    typeof window !== "undefined" &&
    sessionStorage.getItem("seenDiscountPopupUser") === "true";

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Memoized show modal
  const showDiscountModal = useCallback(
    (type: ModalType = "regular") => {
      setModalType(type);
      setShowModal(true);
      console.log("🚨 Showing modal:", type);

      if (typeof window !== "undefined") {
        const now = Date.now();
        localStorage.setItem("last_discount_modal", now.toString());
        localStorage.setItem("returning_visitor", "true");
        // Removed setHasSeenDiscountThisSession call
        // Only set the appropriate session storage value based on user type
        if (accessToken) {
          sessionStorage.setItem("seenDiscountPopupUser", "true");
        } else {
          sessionStorage.setItem("seenDiscountPopupGuest", "true");
        }
      }
      console.log("🚨 Showing modal:", type);
    },
    [accessToken]
  );

  const dismissModal = useCallback((hours = 24) => {
    setShowModal(false);
    const dismissalTime = Date.now() + hours * 60 * 60 * 1000;
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "discount_modal_dismissed_until",
        dismissalTime.toString()
      );
    }
  }, []);

  // Fetch discounts
  useEffect(() => {
    if (!accessToken) return;

    const fetchEligibleDiscounts = async () => {
      try {
        const fetchedDiscounts = await fetchDiscounts(accessToken);
        const eligibleDiscounts = fetchedDiscounts.filter((d) => {
          return (
            d.is_active &&
            (d.all_users || d.eligible_users?.includes(accessToken))
          );
        });
        setDiscounts(eligibleDiscounts);
      } catch (error) {
        console.error("Failed to fetch discounts:", error);
      }
    };

    fetchEligibleDiscounts();
  }, [accessToken]);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.3 && !hasScrolled) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // Detect exit intent
  useEffect(() => {
    const handleExitIntent = (e: MouseEvent) => {
      if (
        e.clientY <= 20 &&
        currentTime > dismissedUntil &&
        currentTime - lastShownTime > 5 * 60 * 1000 &&
        (isLoggedIn ? !hasSeenDiscountAsUser : !hasSeenDiscountAsGuest)
      ) {
        showDiscountModal("exit-intent");
      }
    };

    window.addEventListener("mouseleave", handleExitIntent);
    return () => window.removeEventListener("mouseleave", handleExitIntent);
  }, [
    currentTime,
    dismissedUntil,
    lastShownTime,
    isLoggedIn,
    hasSeenDiscountAsUser,
    hasSeenDiscountAsGuest,
    showDiscountModal,
  ]);

  // Regular modal show conditions
  // Regular modal show conditions
  useEffect(() => {
    const now = Date.now();
    console.log("== DISCOUNT MODAL CHECK ==");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("discounts.length:", discounts.length);
    console.log("hasScrolled:", hasScrolled);
    console.log(
      "lastShownTime (hrs ago):",
      (now - lastShownTime) / (1000 * 60 * 60)
    );
    console.log("dismissedUntil:", new Date(dismissedUntil).toLocaleString());
    console.log("currentTime:", new Date(now).toLocaleString());
    console.log("hasSeenDiscountAsUser:", hasSeenDiscountAsUser);
    console.log("hasSeenDiscountAsGuest:", hasSeenDiscountAsGuest);

    if (showModal || now < dismissedUntil) return;

    if (isLoggedIn) {
      if (
        discounts.length > 0 &&
        hasScrolled &&
        // Remove or modify this condition if you want it to show regardless of when it was last shown
        // now - lastShownTime > 24 * 60 * 60 * 1000 &&
        !hasSeenDiscountAsUser
      ) {
        showDiscountModal("regular");
      }
    } else {
      if (isNewVisitor && hasScrolled && !hasSeenDiscountAsGuest) {
        const timer = setTimeout(() => {
          showDiscountModal("regular");
        }, 30000);

        return () => clearTimeout(timer);
      }
    }
  }, [
    isLoggedIn,
    isNewVisitor,
    hasScrolled,
    discounts,
    dismissedUntil,
    lastShownTime,
    hasSeenDiscountAsUser,
    hasSeenDiscountAsGuest,
    showModal,
    showDiscountModal,
  ]);

  // Inactivity / cart modal
  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      const shouldShowForCurrentUser = isLoggedIn
        ? !hasSeenDiscountAsUser
        : !hasSeenDiscountAsGuest;

      if (
        currentTime > dismissedUntil &&
        !showModal &&
        shouldShowForCurrentUser
      ) {
        showDiscountModal("cart");
      }
    }, 2 * 60 * 1000);
  }, [
    currentTime,
    dismissedUntil,
    showModal,
    showDiscountModal,
    isLoggedIn,
    hasSeenDiscountAsUser,
    hasSeenDiscountAsGuest,
  ]);

  useEffect(() => {
    if (cart.length > 0) {
      const shouldShowForCurrentUser = isLoggedIn
        ? !hasSeenDiscountAsUser
        : !hasSeenDiscountAsGuest;

      if (shouldShowForCurrentUser) {
        resetTimer();

        const events = [
          "mousedown",
          "mousemove",
          "keypress",
          "scroll",
          "touchstart",
        ];
        events.forEach((event) => document.addEventListener(event, resetTimer));

        return () => {
          if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
          events.forEach((event) =>
            document.removeEventListener(event, resetTimer)
          );
        };
      }
    }
  }, [
    cart,
    dismissedUntil,
    showModal,
    isLoggedIn,
    hasSeenDiscountAsUser,
    hasSeenDiscountAsGuest,
    resetTimer,
  ]);

  return {
    showModal,
    modalType,
    discounts,
    isLoggedIn,
    isNewVisitor,
    dismissModal,
    showDiscountModal,
  };
};
