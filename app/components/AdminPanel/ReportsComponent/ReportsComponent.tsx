"use client";

import { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const ReportsComponent = () => {
  const [selectedRange, setSelectedRange] = useState("Last 6 Months");

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRange(e.target.value);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Reports & Analytics</h2>

      {/* Filter for Date Range */}
      <div className="mb-6">
        <label className="font-semibold text-lg">Select Date Range: </label>
        <select
          value={selectedRange}
          onChange={handleRangeChange}
          className="ml-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary"
        >
          <option value="Last 6 Months">Last 6 Months</option>
          <option value="Last Year">Last Year</option>
          <option value="Year-to-Date">Year-to-Date</option>
        </select>
      </div>

      {/* Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-green-100 rounded-lg text-center">
          <h3 className="text-lg font-bold text-gray-700">Total Sales</h3>
          <p className="text-2xl font-bold text-green-600">$150,000</p>
          <p className="text-sm text-gray-500">In the {selectedRange}</p>
        </div>
        <div className="p-6 bg-blue-100 rounded-lg text-center">
          <h3 className="text-lg font-bold text-gray-700">New Users</h3>
          <p className="text-2xl font-bold text-blue-600">450</p>
          <p className="text-sm text-gray-500">In the {selectedRange}</p>
        </div>
        <div className="p-6 bg-yellow-100 rounded-lg text-center">
          <h3 className="text-lg font-bold text-gray-700">Orders Completed</h3>
          <p className="text-2xl font-bold text-yellow-600">1200</p>
          <p className="text-sm text-gray-500">In the {selectedRange}</p>
        </div>
      </div>

      {/* Sales Overview Chart */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Sales Overview</h3>
        <BarChart />
      </div>

      {/* User Activity Line Chart */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">User Activity</h3>
        <LineChart />
      </div>

      {/* Product Performance Doughnut Chart */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Top Products Performance</h3>
        <DoughnutChart />
      </div>
    </div>
  );
};

// Bar Chart Component for Sales Overview
function BarChart() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales ($)",
        data: [12000, 19000, 3000, 5000, 20000, 30000],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Sales Data",
      },
    },
  };

  return <Bar data={data} options={options} />;
}

// Line Chart Component for User Activity
function LineChart() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "User Activity",
        data: [300, 450, 700, 600, 900, 1000],
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly User Activity",
      },
    },
  };

  return <Line data={data} options={options} />;
}

// Doughnut Chart Component for Product Performance
function DoughnutChart() {
  const data = {
    labels: [
      "Herbal Tea",
      "Lavender Oil",
      "Aloe Vera Cream",
      "Vitamin C Serum",
    ],
    datasets: [
      {
        label: "Top Products",
        data: [400, 300, 200, 100],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top Products Performance",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
