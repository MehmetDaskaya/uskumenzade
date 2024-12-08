"use client";

import React from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DashboardStats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
  userGrowth: number;
  productGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
}

interface SalesData {
  name: string;
  satış: number;
  revenue: number;
}

const salesData: SalesData[] = [
  { name: "Ocak", satış: 4000, revenue: 24000 },
  { name: "Şubat", satış: 3000, revenue: 18000 },
  { name: "Mart", satış: 5000, revenue: 30000 },
  { name: "Nisan", satış: 4500, revenue: 27000 },
  { name: "Mayıs", satış: 6000, revenue: 36000 },
  { name: "Haziran", satış: 5500, revenue: 33000 },
];

const productCategoryData = [
  { name: "Çaylar", value: 400 },
  { name: "Yağlar", value: 300 },
  { name: "Kremler", value: 300 },
  { name: "Diğer", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function StatCard({
  title,
  value,
  icon,
  growth,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  growth: number;
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl text-gray-600">{icon}</div>
        <div
          className={`text-sm font-semibold ${
            growth >= 0 ? "text-green-500" : "text-red-500"
          } flex items-center`}
        >
          {growth >= 0 ? (
            <FaArrowUp className="mr-1" />
          ) : (
            <FaArrowDown className="mr-1" />
          )}
          {Math.abs(growth)}%
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

export const DashboardComponent = ({ stats }: { stats: DashboardStats }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Genel Bakış</h2>

      {/* Quick Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.users}
          icon={<FaUsers />}
          growth={stats.userGrowth}
        />
        <StatCard
          title="Toplam Ürün"
          value={stats.products}
          icon={<FaBox />}
          growth={stats.productGrowth}
        />
        <StatCard
          title="Toplam Sipariş"
          value={stats.orders}
          icon={<FaShoppingCart />}
          growth={stats.orderGrowth}
        />
        <StatCard
          title="Toplam Gelir"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<FaDollarSign />}
          growth={stats.revenueGrowth}
        />
      </div>

      {/* Sales and Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Satış ve Gelir Özeti
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="satış"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="gelir"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Product Categories and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Ürün Kategorileri
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {productCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Son Siparişler
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="satış" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Son Aktiviteler
        </h3>
        <ul className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <li
              key={item}
              className="flex items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FaChartLine className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Yeni Sipariş
                </p>
                <p className="text-xs text-gray-500">2 dakika önce</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
