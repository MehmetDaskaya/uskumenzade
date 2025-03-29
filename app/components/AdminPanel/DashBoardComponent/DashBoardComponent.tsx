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
  showGrowth = true,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  growth: number;
  showGrowth?: boolean;
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl text-gray-600">{icon}</div>
        {showGrowth && (
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
            %{Math.abs(growth)}
          </div>
        )}
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
  const [orderCountData, setOrderCountData] = useState<
    { name: string; orderCount: number }[]
  >([]);

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [selectedRange, setSelectedRange] = useState<"7g" | "30g" | "1y">(
    "30g"
  );

  useEffect(() => {
    async function fetchData() {
      try {
        if (!accessToken) {
          console.error("Authentication token is missing.");
          return;
        }

        const [users, fetchedOrders, fetchedProducts] = await Promise.all([
          fetchAllUsers(accessToken),
          fetchOrders(accessToken),
          getProducts(),
        ]);

        const validOrders = fetchedOrders.filter(
          (order) => (order.total_amount ?? 0) > 0
        );

        setOrders(validOrders);
        setProducts(fetchedProducts);

        // --- Filter by date range (last 7 or 30 days) ---
        const now = new Date();
        const cutoffDate = new Date();
        const previousCutoffDate = new Date();

        if (selectedRange === "7g") {
          cutoffDate.setDate(now.getDate() - 7);
          previousCutoffDate.setDate(now.getDate() - 14);
        } else if (selectedRange === "30g") {
          cutoffDate.setDate(now.getDate() - 30);
          previousCutoffDate.setDate(now.getDate() - 60);
        } else if (selectedRange === "1y") {
          cutoffDate.setFullYear(now.getFullYear() - 1);
          previousCutoffDate.setFullYear(now.getFullYear() - 2);
        }

        const paidOrders = validOrders.filter(
          (order) => order.status === "paid"
        );

        const currentOrders = paidOrders.filter((order) => {
          const created = new Date(order.created_at).getTime();
          return created >= cutoffDate.getTime() && created <= now.getTime();
        });

        const previousOrders = paidOrders.filter((order) => {
          const created = new Date(order.created_at).getTime();
          return (
            created >= previousCutoffDate.getTime() &&
            created < cutoffDate.getTime()
          );
        });

        const calcRevenue = (orders: Order[]) =>
          orders.reduce((sum, order) => {
            const items = order.basket.filter(
              (i) => i.item_id !== "SHIPPING_COST"
            );
            return (
              sum +
              items.reduce(
                (s, i) => s + (i.item?.discounted_price || 0) * i.quantity,
                0
              )
            );
          }, 0);

        // Growth percentages
        // Removed user growth and product growth calculations since they're not needed anymore

        const orderGrowth =
          previousOrders.length === 0 && currentOrders.length > 0
            ? 100
            : previousOrders.length > 0
            ? ((currentOrders.length - previousOrders.length) /
                previousOrders.length) *
              100
            : 0;

        const currentRevenue = calcRevenue(currentOrders);
        const previousRevenue = calcRevenue(previousOrders);

        const revenueGrowth =
          previousRevenue === 0 && currentRevenue > 0
            ? 100
            : previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
            : 0;

        const filteredOrders = validOrders.filter(
          (order) =>
            order.status === "paid" && new Date(order.created_at) >= cutoffDate
        );

        // --- Daily grouping + cumulative ---
        const salesMap = new Map<
          string,
          { satış: number; revenue: number; date: string }
        >();

        filteredOrders.forEach((order) => {
          const orderDate = new Date(order.created_at);
          const label = orderDate.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
          });

          const nonShippingItems = order.basket.filter(
            (item) => item.item_id !== "SHIPPING_COST"
          );

          const dailySales = nonShippingItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          const dailyRevenue = nonShippingItems.reduce((sum, item) => {
            const price = item?.item?.discounted_price || 0;
            return sum + price * item.quantity;
          }, 0);

          const prev = salesMap.get(label) || {
            satış: 0,
            revenue: 0,
            date: orderDate.toISOString(),
          };

          salesMap.set(label, {
            satış: prev.satış + dailySales,
            revenue: prev.revenue + dailyRevenue,
            date: orderDate.toISOString(),
          });
        });

        // --- Orders per day dataset ---
        const orderCountMap = new Map<string, number>();

        filteredOrders.forEach((order) => {
          const label = new Date(order.created_at).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
          });

          orderCountMap.set(label, (orderCountMap.get(label) || 0) + 1);
        });

        const orderCountArray = Array.from(orderCountMap.entries())
          .map(([name, count]) => ({ name, orderCount: count }))
          .sort(
            (a, b) =>
              new Date(a.name + " 2023").getTime() -
              new Date(b.name + " 2023").getTime()
          );

        setOrderCountData(orderCountArray);

        // Sort by date ascending
        const sortedSalesArray = Array.from(salesMap.entries())
          .map(([name, data]) => ({ name, ...data }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        // Cumulative calculation
        let cumulativeSales = 0;
        let cumulativeRevenue = 0;
        let maxSales = 0;

        const finalSalesData = sortedSalesArray.map((entry) => {
          cumulativeSales += entry.satış;
          cumulativeRevenue += entry.revenue;
          maxSales = Math.max(maxSales, entry.satış);

          return {
            ...entry,
            cumulativeSales,
            cumulativeRevenue,
            isPeakDay: entry.satış === maxSales,
          };
        });

        const productSales = filteredOrders
          .flatMap((order) => order.basket)
          .reduce((acc, item) => {
            if (!item?.item?.name || item.item_id === "SHIPPING_COST")
              return acc;
            const name = item.item.name;
            acc[name] = (acc[name] || 0) + item.quantity;
            return acc;
          }, {} as Record<string, number>);

        const topProducts = Object.entries(productSales)
          .map(([name, sales]) => ({ name, sales }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        const categorySummary = fetchedProducts.reduce(
          (acc: Record<string, number>, product: Product) => {
            const category = product.category.name;
            if (!acc[category]) acc[category] = 0;
            acc[category] += 1;
            return acc;
          },
          {} as Record<string, number>
        );

        setTopProducts(topProducts);
        setSalesData(finalSalesData);
        setProductCategoryData(
          Object.entries(categorySummary).map(([name, value]) => ({
            name,
            value: value as number,
          }))
        );
        setStats({
          users: users.length,
          products: fetchedProducts.length,
          orders: validOrders.length,
          revenue: calcRevenue(paidOrders),
          userGrowth: 0,
          productGrowth: 0,
          orderGrowth,
          revenueGrowth,
        });

        setRecentOrders(validOrders.slice(0, 5));
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      }
    }

    fetchData();
  }, [accessToken, selectedRange]);

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
          showGrowth={false} // Hide growth for users
        />
        <StatCard
          title="Toplam Ürün"
          value={stats.products}
          icon={<FaBox />}
          growth={stats.productGrowth}
          showGrowth={false} // Hide growth for products
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
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Satış ve Gelir Özeti
        </h3>
        <div className="flex gap-3 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              selectedRange === "7g" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedRange("7g")}
          >
            Son 7 Gün
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedRange === "30g" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedRange("30g")}
          >
            Son 30 Gün
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedRange === "1y" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedRange("1y")}
          >
            Son 1 Yıl
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Günlük Sipariş Sayısı
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderCountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `${value} sipariş`,
                  "Sipariş Sayısı",
                ]}
              />
              <Legend />
              <Bar dataKey="orderCount" fill="#FF8042" name="Sipariş Sayısı" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Daily Quantity Sold */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Günlük Sipariş Adeti
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === "satış" ? [`${value} adet`, "Satış"] : value
                }
              />
              <Legend />
              <Bar dataKey="satış" fill="#8884d8" name="Satış (Adet)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Daily Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Günlük Sipariş Geliri
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === "revenue" ? [`₺${value.toFixed(2)}`, "Gelir"] : value
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#00C49F"
                strokeWidth={2}
                name="Gelir (₺)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
          Düşük Stoklu Ürünler (10 ve altı)
        </h3>
        {products.filter((product) => product.stock <= 10).length > 0 ? (
          <ul>
            {products
              .filter((product) => product.stock <= 10)
              .map((product) => (
                <li key={product.id} className="py-2 border-b border-gray-200">
                  {product.name} - {product.stock} Adet kaldı
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">Düşük stoklu ürün bulunmamaktadır.</p>
        )}
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
                {order.total_amount
                  ? `${order.total_amount.toFixed(2)} ₺ (Kargo Dahil)`
                  : "Hesaplanıyor"}{" "}
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
            <Bar dataKey="sales" fill="#8884d8" name="Satış" />
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
                {order.total_amount
                  ? `${order.total_amount.toFixed(2)} ₺ (Kargo Dahil)`
                  : "Hesaplanıyor"}{" "}
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
