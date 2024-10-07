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
  sales: number;
  revenue: number;
}

const salesData: SalesData[] = [
  { name: "Jan", sales: 4000, revenue: 24000 },
  { name: "Feb", sales: 3000, revenue: 18000 },
  { name: "Mar", sales: 5000, revenue: 30000 },
  { name: "Apr", sales: 4500, revenue: 27000 },
  { name: "May", sales: 6000, revenue: 36000 },
  { name: "Jun", sales: 5500, revenue: 33000 },
];

const productCategoryData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Books", value: 300 },
  { name: "Home & Garden", value: 200 },
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      {/* Quick Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<FaUsers />}
          growth={stats.userGrowth}
        />
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={<FaBox />}
          growth={stats.productGrowth}
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon={<FaShoppingCart />}
          growth={stats.orderGrowth}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<FaDollarSign />}
          growth={stats.revenueGrowth}
        />
      </div>

      {/* Sales and Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Sales and Revenue Overview
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
              dataKey="sales"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
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
            Product Categories
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
            Recent Orders
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activity
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
                  New order placed
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Add Product", "Create Order", "Add User", "Generate Report"].map(
            (action) => (
              <button
                key={action}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                {action}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
