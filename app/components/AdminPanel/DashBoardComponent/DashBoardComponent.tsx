"use client";

import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
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
import { fetchOrders, Order } from "../../../api/order/orderApi";
import { fetchAllUsers } from "../../../api/user/userApi";
import { getProducts } from "../../../api/product/productApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

type Product = {
  id: string;
  name: string;
  stock: number;
  category: { name: string };
  sales: number;
};

export const DashboardComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<
    { name: string; sales: number }[]
  >([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    userGrowth: 0,
    productGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
  });

  const [salesData, setSalesData] = useState<
    { name: string; satış: number; revenue: number }[]
  >([]);

  const [productCategoryData, setProductCategoryData] = useState<
    { name: string; value: number }[]
  >([]);

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        if (!accessToken) {
          console.error("Authentication token is missing.");
          return; // Stop execution if token is not present
        }

        // Fetch all users
        const users = await fetchAllUsers(accessToken);

        // Fetch all orders
        const fetchedOrders = await fetchOrders(accessToken);

        // Fetch all products
        const fetchedProducts = await getProducts();

        // Set state
        setProducts(fetchedProducts);
        setOrders(fetchedOrders);

        // Process fetched data for stats
        const totalRevenue = fetchedOrders
          .filter((order) => order.status === "paid")
          .reduce((sum, order) => sum + order.amount, 0);

        const userGrowth =
          users.length > 10 ? ((users.length - 10) / 10) * 100 : 0;
        const orderGrowth =
          fetchedOrders.length > 5 ? ((fetchedOrders.length - 5) / 5) * 100 : 0;
        const previousProducts = fetchedProducts.length - 3; // Example of past data
        const productGrowth =
          previousProducts > 0
            ? ((fetchedProducts.length - previousProducts) / previousProducts) *
              100
            : 0;

        const salesSummary = fetchedOrders
          .filter((order) => order.status === "paid")
          .map((order) => ({
            name: new Date(order.created_at).toLocaleDateString("tr-TR", {
              month: "short",
            }),
            satış: order.basket.reduce((sum, item) => sum + item.quantity, 0),
            revenue: order.amount,
          }));

        const categorySummary = fetchedProducts.reduce(
          (acc: Record<string, number>, product: Product) => {
            const category = product.category.name;
            if (!acc[category]) acc[category] = 0;
            acc[category] += 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const productSales = fetchedOrders
          .filter((order) => order.status === "paid") // Filter only paid orders
          .flatMap((order) => order.basket) // Extract all basket items
          .reduce((acc, basketItem) => {
            if (!basketItem?.item?.name) return acc; // Skip if item is undefined
            const productName = basketItem.item.name;
            if (!acc[productName]) acc[productName] = 0;
            acc[productName] += basketItem.quantity; // Count quantity sold
            return acc;
          }, {} as Record<string, number>);

        const calculatedTopProducts = Object.entries(productSales)
          .map(([name, sales]) => ({ name, sales }))
          .sort((a, b) => b.sales - a.sales) // Sort by sales descending
          .slice(0, 5); // Take top 5 products

        setTopProducts(calculatedTopProducts);

        setStats({
          users: users.length,
          products: fetchedProducts.length,
          orders: fetchedOrders.length,
          revenue: totalRevenue,
          userGrowth,
          productGrowth,
          orderGrowth,
          revenueGrowth:
            totalRevenue > 1000 ? ((totalRevenue - 1000) / 1000) * 100 : 0,
        });

        setSalesData(salesSummary);
        setProductCategoryData(
          Object.entries(categorySummary).map(([name, value]) => ({
            name,
            value: value as number,
          }))
        );
        setRecentOrders(fetchedOrders.slice(0, 5)); // Take the 5 most recent orders
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    fetchData();
  }, [accessToken]);

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
          value={`${stats.revenue.toLocaleString()}₺`}
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
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="satış" stroke="#8884d8" />
            <Line type="monotone" dataKey="gelir" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Kategoriye Göre Satış Grafiği
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={productCategoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#82ca9d"
              dataKey="value"
              nameKey="name"
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Düşük Stoklu Ürünler
        </h3>
        <ul>
          {products
            .filter((product) => product.stock <= 10)
            .map((product) => (
              <li key={product.id} className="py-2 border-b border-gray-200">
                {product.name} - {product.stock} Adet kaldı
              </li>
            ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Ödemesi Yapılmamış Siparişler
        </h3>
        <ul>
          {orders
            .filter((order) => order.status === "pending")
            .map((order) => (
              <li key={order.id} className="py-2 border-b border-gray-200">
                {order.user.fname} {order.user.lname} - ₺
                {order.amount.toFixed(2)} -{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </li>
            ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          En Çok Satılan Ürünler
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Product Categories and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Son Siparişler
          </h3>
          <ul>
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex justify-between py-2 border-b border-gray-200"
              >
                <span>
                  {order.user.fname} {order.user.lname}
                </span>
                <span>${order.amount.toFixed(2)}</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
