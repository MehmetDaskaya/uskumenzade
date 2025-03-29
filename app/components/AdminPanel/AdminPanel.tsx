"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "../../../redux/slices/authSlice";
import { fetchCurrentUser } from "@/app/api/auth/authApi";
import { fetchOrders } from "@/app/api/order/orderApi";

import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaCog,
  FaBell,
} from "react-icons/fa";
// import { MdOutlineAnalytics } from "react-icons/md";
import { FiLogOut, FiMenu, FiHome } from "react-icons/fi";
import {
  DashboardComponent,
  UserManagementComponent,
  OrderManagementComponent,
  ReportsComponent,
  ProductManagementComponent,
  SettingsComponent,
  BlogsComponent,
  DefinitionsComponent,
} from "@/app/components";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function AdminPanel() {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("yönetim paneli");
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string }>
  >([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  const [loading, setLoading] = useState(true); // State to track loading
  const [isSuperUser, setIsSuperUser] = useState(false); // Track if user is superuser

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const router = useRouter();

  useEffect(() => {
    const verifySuperUser = async () => {
      try {
        setLoading(true); // Show spinner while checking
        if (!accessToken) {
          router.push("/giris"); // Redirect to login if no access token
          return;
        }

        const userData = await fetchCurrentUser(accessToken); // Fetch user data
        if (userData.is_superuser) {
          setIsSuperUser(true); // User is a superuser
        } else {
          router.push("/"); // Redirect non-superusers to home page
        }
      } catch (error) {
        console.error("Kullanıcı doğrulanamadı.", error);
        router.push("/giris"); // Redirect to login on error
      } finally {
        setLoading(false); // Hide spinner after check
      }
    };

    verifySuperUser();
  }, [accessToken, router]);

  // Handle active section
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  useEffect(() => {
    const loadNotifications = async () => {
      if (!accessToken) return;

      try {
        const orders = await fetchOrders(accessToken);

        const recentOrders = orders
          .filter((order) => {
            // Customize your "recent" logic if needed
            const createdDate = new Date(order.created_at);
            const now = new Date();
            const diffInMinutes =
              (now.getTime() - createdDate.getTime()) / 60000;
            return diffInMinutes < 60; // Orders placed within the last 60 minutes
          })
          .map((order) => ({
            id: order.id,
            message: `Yeni sipariş: ${order.user.fname} ${order.user.lname} - ${
              order.total_amount?.toFixed(2) || "?"
            }₺`,
          }));

        setNotifications(recentOrders);
      } catch (err) {
        console.error("Bildirimler yüklenemedi:", err);
      }
    };

    loadNotifications();
  }, [accessToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken) {
        fetchOrders(accessToken)
          .then((orders) => {
            const recent = orders.filter((order) => {
              const createdDate = new Date(order.created_at);
              const now = new Date();
              return (now.getTime() - createdDate.getTime()) / 60000 < 60;
            });
            setNotifications(
              recent.map((order) => ({
                id: order.id,
                message: `Yeni sipariş: ${order.user.fname} ${
                  order.user.lname
                } - ${order.total_amount?.toFixed(2) || "?"}₺`,
              }))
            );
          })
          .catch((err) => console.error("Bildirim güncellenemedi:", err));
      }
    }, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [accessToken]);

  if (loading) {
    // Show loading spinner while verifying
    return <LoadingSpinner />;
  }

  if (!isSuperUser) {
    return null; // Prevent rendering the page for non-superusers
  }

  return (
    <>
      <div className="min-h-screen flex">
        {/* Mobile Burger Icon */}
        <button
          className="absolute top-4 left-4 text-2xl md:hidden z-50 text-tertiary"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <FiMenu />
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-adminPanelDark text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-64 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
            Admin Paneli
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-4">
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "yönetim paneli"
                      ? "bg-adminPanelDark"
                      : ""
                  } hover:bg-adminPanelDark`}
                  onClick={() => handleSectionChange("yönetim paneli")}
                >
                  <FaChartLine className="mr-3" />
                  Yönetim Paneli
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "kullanıcılar" ? "bg-adminPanelDark" : ""
                  } hover:bg-adminPanelDark`}
                  onClick={() => handleSectionChange("kullanıcılar")}
                >
                  <FaUsers className="mr-3" />
                  Kullanıcı Yönetimi
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "ürünler" ? "bg-adminPanelDark" : ""
                  } hover:bg-adminPanelDark`}
                  onClick={() => handleSectionChange("ürünler")}
                >
                  <FaBox className="mr-3" />
                  Ürün Yönetimi
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "siparişler" ? "bg-adminPanelDark" : ""
                  } hover:bg-adminPanelDark`}
                  onClick={() => handleSectionChange("siparişler")}
                >
                  <FaShoppingCart className="mr-3" />
                  Sipariş Yönetimi
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "bloglar" ? "bg-adminPanelDark" : ""
                  } hover:bg-adminPanelDark`}
                  onClick={() => handleSectionChange("bloglar")}
                >
                  <FaBox className="mr-3" />
                  Blog Yönetimi
                </button>
              </li>
              {/* <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "raporlar" ? "bg-adminPanelDark" : ""
                  } hover:bg-adminPanelDark`}
                  onClick={() => handleSectionChange("raporlar")}
                >
                  <MdOutlineAnalytics className="mr-3" />
                  Raporlar ve Analitik
                </button>
              </li> */}
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "tanımlar" ? "bg-adminPanelDark" : ""
                  } hover:bg-adminPanelDark`}
                  onClick={() => handleSectionChange("tanımlar")}
                >
                  <FaCog className="mr-3" />
                  Tanımlar
                </button>
              </li>
              {/* <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "ayarlar" ? "bg-adminPanelDark" : ""
                  } hover:bg-adminPanelDark`}
                  onClick={() => handleSectionChange("ayarlar")}
                >
                  <FaCog className="mr-3" />
                  Ayarlar
                </button>
              </li> */}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button
              className="flex items-center p-3 w-full hover:bg-adminPanelDark"
              onClick={() => router.push("/")}
            >
              <FiHome className="mr-3" />
              Anasayfaya Dön
            </button>
            <button
              className="flex items-center p-3 w-full hover:bg-adminPanelDark"
              onClick={() => {
                dispatch(clearAccessToken()); // Clear token from Redux
                localStorage.removeItem("authToken"); // Clear token from localStorage
              }}
            >
              <FiLogOut className="mr-3" />
              Çıkış Yap
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-700 capitalize">
              {activeSection}
            </h1>
            <div className="relative">
              <FaBell
                className="text-gray-700 text-2xl cursor-pointer"
                onClick={() => setShowNotifications((prev) => !prev)}
              />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs text-center">
                  {notifications.length}
                </span>
              )}

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-lg z-50 p-4 max-h-96 overflow-y-auto">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Bildirimler
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {notifications.map((n) => (
                      <li key={n.id} className="border-b pb-1">
                        {n.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Conditional Rendering based on activeSection */}
          {activeSection === "yönetim paneli" && <DashboardComponent />}
          {activeSection === "kullanıcılar" && <UserManagementComponent />}
          {activeSection === "ürünler" && <ProductManagementComponent />}
          {activeSection === "siparişler" && <OrderManagementComponent />}
          {activeSection === "bloglar" && <BlogsComponent />}
          {activeSection === "raporlar" && <ReportsComponent />}
          {activeSection === "tanımlar" && <DefinitionsComponent />}
          {activeSection === "ayarlar" && <SettingsComponent />}
        </main>
      </div>
    </>
  );
}
