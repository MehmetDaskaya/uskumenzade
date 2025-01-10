"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { clearAccessToken } from "../../../redux/slices/authSlice";
import { fetchCurrentUser } from "@/app/api/auth/authApi";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaCog,
  FaBell,
} from "react-icons/fa";
// import { MdOutlineAnalytics } from "react-icons/md";
import { FiLogOut, FiMenu } from "react-icons/fi";
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
  const [notifications, setNotifications] = useState<
    Array<{ id: number; message: string }>
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

  // Simulate notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: "New user registered." },
      { id: 2, message: "Product out of stock: Herbal Tea" },
      { id: 3, message: "New order placed." },
    ]);
  }, []);

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
          className="absolute top-4 left-4 text-2xl md:hidden z-50 text-yellow-500"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <FiMenu />
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-64 ${
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
                    activeSection === "yönetim paneli" ? "bg-gray-700" : ""
                  } hover:bg-gray-700`}
                  onClick={() => handleSectionChange("yönetim paneli")}
                >
                  <FaChartLine className="mr-3" />
                  Yönetim Paneli
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "kullanıcılar" ? "bg-gray-700" : ""
                  } hover:bg-gray-700`}
                  onClick={() => handleSectionChange("kullanıcılar")}
                >
                  <FaUsers className="mr-3" />
                  Kullanıcı Yönetimi
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "ürünler" ? "bg-gray-700" : ""
                  } hover:bg-gray-700`}
                  onClick={() => handleSectionChange("ürünler")}
                >
                  <FaBox className="mr-3" />
                  Ürün Yönetimi
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "siparişler" ? "bg-gray-700" : ""
                  } hover:bg-gray-700`}
                  onClick={() => handleSectionChange("siparişler")}
                >
                  <FaShoppingCart className="mr-3" />
                  Sipariş Yönetimi
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "bloglar" ? "bg-gray-700" : ""
                  } hover:bg-gray-700`}
                  onClick={() => handleSectionChange("bloglar")}
                >
                  <FaBox className="mr-3" />
                  Blog Yönetimi
                </button>
              </li>
              {/* <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "raporlar" ? "bg-gray-700" : ""
                  } hover:bg-gray-700`}
                  onClick={() => handleSectionChange("raporlar")}
                >
                  <MdOutlineAnalytics className="mr-3" />
                  Raporlar ve Analitik
                </button>
              </li> */}
              <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "tanımlar" ? "bg-gray-700" : ""
                  } hover:bg-gray-700`}
                  onClick={() => handleSectionChange("tanımlar")}
                >
                  <FaCog className="mr-3" />
                  Tanımlar
                </button>
              </li>
              {/* <li>
                <button
                  className={`flex items-center p-3 w-full ${
                    activeSection === "ayarlar" ? "bg-gray-700" : ""
                  } hover:bg-gray-700`}
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
              className="flex items-center p-3 w-full hover:bg-gray-700"
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
              <FaBell className="text-gray-700 text-2xl cursor-pointer" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs text-center">
                  {notifications.length}
                </span>
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
