"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus } from "react-icons/fa";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/app/api/product/productApi";
import { ImageModal, CategoryModal } from "../../../components"; // Assuming these are defined

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discounted_price: number;
  stock: number;
  how_to_use: string;
  category_id: string;
  image_ids: string[];
}

export const ProductManagementComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    discounted_price: 0,
    stock: 0,
    how_to_use: "",
    category_id: "",
    image_ids: [],
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const productsPerPage = 5;

  // Fetch products on component mount
  useEffect(() => {
    const fetchData = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };
    fetchData();
  }, []);

  // Handle search query input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_id.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Handle Add Product
  // Add Product
  const handleAddProduct = async () => {
    try {
      const addedProduct = await createProduct(newProduct);
      setProducts((prev) => [...prev, addedProduct]);
      resetForm();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Handle Edit Product
  const handleEditProduct = async () => {
    if (editingProduct) {
      const updatedProduct = await updateProduct(
        editingProduct.id!,
        editingProduct
      );
      setProducts((prev) =>
        prev.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      resetForm();
    }
  };
  // Handle Delete Product
  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      discounted_price: 0,
      stock: 0,
      how_to_use: "",
      category_id: "",
      image_ids: [],
    });
  };

  // Open Modals
  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);
  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Ürün Yönetimi</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="İsim veya kategoriye göre ürün arayın..."
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
            <th className="p-4 text-left font-semibold text-gray-600">İsim</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Kategori
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Fiyat (₺)
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">Stok</th>
            <th className="p-4 text-center font-semibold text-gray-600">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4 text-gray-600">{product.id}</td>
                <td className="p-4 text-gray-600">{product.name}</td>
                <td className="p-4 text-gray-600">{product.category_id}</td>
                <td className="p-4 text-gray-600">
                  {product.price.toFixed(2)} ₺
                </td>
                <td className="p-4 text-gray-600">{product.stock}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingProduct(product);
                      setShowModal(true);
                    }}
                    className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(product.id!)}
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
                Ürün Bulunamadı.
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
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" />
          Ürün Ekle
        </button>
      </div>

      {/* Add Product or Edit Product Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Selection */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <button
                  onClick={openCategoryModal}
                  className="w-full bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                >
                  Select Category
                </button>
              </div>

              {/* Images Selection */}
              <div>
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Images
                </label>
                <button
                  onClick={openImageModal}
                  className="w-full bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                >
                  Select Images
                </button>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  value={
                    isEditing ? editingProduct?.name || "" : newProduct.name
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, name: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({ ...prev, name: value }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  value={
                    isEditing
                      ? editingProduct?.description || ""
                      : newProduct.description
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, description: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({
                        ...prev,
                        description: value,
                      }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter product price"
                  value={
                    isEditing ? editingProduct?.price || "" : newProduct.price
                  }
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, price: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({ ...prev, price: value }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Discounted Price */}
              <div>
                <label
                  htmlFor="discounted_price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Discounted Price
                </label>
                <input
                  id="discounted_price"
                  name="discounted_price"
                  type="number"
                  placeholder="Enter discounted price"
                  value={
                    isEditing
                      ? editingProduct?.discounted_price || ""
                      : newProduct.discounted_price
                  }
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, discounted_price: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({
                        ...prev,
                        discounted_price: value,
                      }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="Enter stock quantity"
                  value={
                    isEditing ? editingProduct?.stock || "" : newProduct.stock
                  }
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, stock: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({ ...prev, stock: value }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* How to Use */}
              <div>
                <label
                  htmlFor="how_to_use"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  How to Use
                </label>
                <textarea
                  id="how_to_use"
                  name="how_to_use"
                  placeholder="Enter usage instructions"
                  value={
                    isEditing
                      ? editingProduct?.how_to_use || ""
                      : newProduct.how_to_use
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, how_to_use: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({ ...prev, how_to_use: value }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleEditProduct : handleAddProduct}
                className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
              >
                {isEditing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <ImageModal
          isOpen={showImageModal}
          onClose={closeImageModal}
          type="multi"
          onSelectImage={(imageId) => {
            // Assuming `imageId` is a single string
            if (isEditing && editingProduct) {
              setEditingProduct({
                ...editingProduct,
                image_ids: [...editingProduct.image_ids, imageId], // Append the image ID
              });
            } else {
              setNewProduct((prev) => ({
                ...prev,
                image_ids: [...prev.image_ids, imageId], // Append the image ID
              }));
            }
          }}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={closeCategoryModal}
          onCategorySelect={(categories) => {
            // Assuming `categories` is an array of `Category` objects
            if (categories.length > 0) {
              const categoryId = categories[0].id; // Extract the first category's ID
              if (isEditing && editingProduct) {
                setEditingProduct({
                  ...editingProduct,
                  category_id: categoryId, // Assign the extracted category ID
                });
              } else {
                setNewProduct((prev) => ({
                  ...prev,
                  category_id: categoryId, // Assign the extracted category ID
                }));
              }
            }
          }}
        />
      )}
    </div>
  );
};
