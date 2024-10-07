"use client";

import { useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus } from "react-icons/fa";

// Sample product data (replace with API data fetching in the future)
const initialProducts = [
  {
    id: 1,
    name: "Herbal Tea",
    category: "Tea",
    price: 12.99,
    stock: 100,
  },
  {
    id: 2,
    name: "Lavender Oil",
    category: "Essential Oils",
    price: 15.49,
    stock: 50,
  },
  {
    id: 3,
    name: "Aloe Vera Cream",
    category: "Skincare",
    price: 18.99,
    stock: 20,
  },
  // Add more sample products here...
];

export const ProductManagementComponent = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Handle search query input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle Delete Product
  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Manage Products</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      {/* Product Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">ID</th>
            <th className="p-4 text-left font-semibold text-gray-600">Name</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Category
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Price ($)
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">Stock</th>
            <th className="p-4 text-center font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4 text-gray-600">{product.id}</td>
                <td className="p-4 text-gray-600">{product.name}</td>
                <td className="p-4 text-gray-600">{product.category}</td>
                <td className="p-4 text-gray-600">
                  ${product.price.toFixed(2)}
                </td>
                <td className="p-4 text-gray-600">{product.stock}</td>
                <td className="p-4 text-center">
                  <button className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredProducts.length > productsPerPage && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 p-2 border rounded-lg ${
                page === currentPage
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Add Product Button */}
      <div className="mt-6">
        <button className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center">
          <FaPlus className="mr-2" />
          Add New Product
        </button>
      </div>
    </div>
  );
};
