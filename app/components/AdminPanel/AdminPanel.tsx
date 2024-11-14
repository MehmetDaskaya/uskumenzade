"use client";
import { useState, useEffect } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaCog,
  FaBell,
} from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import {
  DashboardComponent,
  UserManagementComponent,
  OrderManagementComponent,
  ReportsComponent,
  ProductManagementComponent,
  SettingsComponent,
  BlogsComponent,
} from "@/app/components";

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notifications, setNotifications] = useState<
    Array<{ id: number; message: string }>
  >([]);

  // Example statistics data
  const stats = {
    users: 1240,
    products: 560,
    orders: 750,
    revenue: 120000,
  };

  // Handle active section
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // Simulate notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: "New user registered." },
      { id: 2, message: "Product out of stock: Herbal Tea" },
      { id: 3, message: "New order placed." },
    ]);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
          Admin Paneli
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <button
                className={`flex items-center p-3 w-full ${
                  activeSection === "dashboard" ? "bg-gray-700" : ""
                } hover:bg-gray-700`}
                onClick={() => handleSectionChange("dashboard")}
              >
                <FaChartLine className="mr-3" />
                Yönetim Paneli
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-3 w-full ${
                  activeSection === "users" ? "bg-gray-700" : ""
                } hover:bg-gray-700`}
                onClick={() => handleSectionChange("users")}
              >
                <FaUsers className="mr-3" />
                Kullanıcı Yönetimi
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-3 w-full ${
                  activeSection === "products" ? "bg-gray-700" : ""
                } hover:bg-gray-700`}
                onClick={() => handleSectionChange("products")}
              >
                <FaBox className="mr-3" />
                Ürün Yönetimi
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-3 w-full ${
                  activeSection === "orders" ? "bg-gray-700" : ""
                } hover:bg-gray-700`}
                onClick={() => handleSectionChange("orders")}
              >
                <FaShoppingCart className="mr-3" />
                Sipariş Yönetimi
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-3 w-full ${
                  activeSection === "products" ? "bg-gray-700" : ""
                } hover:bg-gray-700`}
                onClick={() => handleSectionChange("blogs")}
              >
                <FaBox className="mr-3" />
                Blog Yönetimi
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-3 w-full ${
                  activeSection === "reports" ? "bg-gray-700" : ""
                } hover:bg-gray-700`}
                onClick={() => handleSectionChange("reports")}
              >
                <MdOutlineAnalytics className="mr-3" />
                Raporlar ve Analitik
              </button>
            </li>
            <li>
              <button
                className={`flex items-center p-3 w-full ${
                  activeSection === "settings" ? "bg-gray-700" : ""
                } hover:bg-gray-700`}
                onClick={() => handleSectionChange("settings")}
              >
                <FaCog className="mr-3" />
                Ayarlar
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center p-3 w-full hover:bg-gray-700">
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
        {activeSection === "dashboard" && (
          <DashboardComponent
            stats={{
              ...stats,
              userGrowth: 0,
              productGrowth: 0,
              orderGrowth: 0,
              revenueGrowth: 0,
            }}
          />
        )}
        {activeSection === "users" && <UserManagementComponent />}
        {activeSection === "products" && <ProductManagementComponent />}
        {activeSection === "orders" && <OrderManagementComponent />}
        {activeSection === "blogs" && <BlogsComponent />}
        {activeSection === "reports" && <ReportsComponent />}
        {activeSection === "settings" && <SettingsComponent />}
      </main>
    </div>
  );
}
