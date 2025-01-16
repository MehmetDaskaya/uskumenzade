"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus } from "react-icons/fa";
import {
  createHealthBenefit,
  deleteHealthBenefit,
} from "@/app/api/benefits/benefitsApi";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/app/api/product/productApi";
import { ImageModal, CategoryModal, Snackbar } from "../../../components";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discounted_price: number;
  stock: number;
  how_to_use: string;
  category: { id: string; name: string };
  category_id?: string; // Optional
  image_ids: string[];
  images?: { id: string; url: string }[]; // Define the images property
  health_benefits?: (string | { name: string })[]; // Support both strings and objects
}

export const ProductManagementComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    discounted_price: 0,
    stock: 0,
    how_to_use: "",
    category: { id: "", name: "" },
    image_ids: [],
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const productsPerPage = 5;

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => {
      setSnackbar(null);
    }, 3000);
  };

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
      product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) // Access the name inside category
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
  const handleAddProduct = async () => {
    try {
      if (!newProduct.category_id) {
        throw new Error("Category must be selected.");
      }

      const productPayload = {
        ...newProduct,
        health_benefits: [],
        category_id: newProduct.category_id,
      };

      const addedProduct = await createProduct(productPayload);

      const benefits = newProduct.health_benefits || [];
      for (const benefit of benefits) {
        const benefitName =
          typeof benefit === "object" && "name" in benefit
            ? benefit.name
            : benefit;

        if (typeof benefitName === "string") {
          await createHealthBenefit({
            item_id: addedProduct.id,
            benefit: benefitName,
          });
        }
      }

      const updatedProduct = { ...addedProduct, health_benefits: benefits };
      setProducts((prev) => [...prev, updatedProduct]);
      resetForm();

      showSnackbar("Product added successfully!", "success");
    } catch (error) {
      console.error("Failed to add product:", error);
      showSnackbar("Failed to add product. Please try again.", "error");
    }
  };

  // Handle Edit Product
  const handleEditProduct = async () => {
    if (editingProduct) {
      try {
        if (!editingProduct.category_id) {
          throw new Error("Category must be selected.");
        }

        const productPayload = {
          ...editingProduct,
          health_benefits: [],
          category_id: editingProduct.category_id,
        };

        const updatedProduct = await updateProduct(
          editingProduct.id,
          productPayload
        );

        const originalBenefits =
          products.find((p) => p.id === editingProduct.id)?.health_benefits ||
          [];
        const currentBenefits = editingProduct.health_benefits || [];

        const benefitsToAdd = currentBenefits.filter(
          (benefit) =>
            !originalBenefits.some((originalBenefit) =>
              typeof originalBenefit === "object" &&
              "benefit" in originalBenefit
                ? originalBenefit.benefit === benefit
                : originalBenefit === benefit
            )
        );

        const benefitsToDelete = originalBenefits.filter(
          (originalBenefit) =>
            !currentBenefits.some((currentBenefit) =>
              typeof currentBenefit === "string"
                ? currentBenefit === originalBenefit
                : typeof originalBenefit === "object" &&
                  "benefit" in originalBenefit &&
                  originalBenefit.benefit === currentBenefit
            )
        );

        await Promise.all(
          benefitsToAdd.map(async (benefit) => {
            const benefitName =
              typeof benefit === "object" && "benefit" in benefit
                ? benefit.benefit
                : benefit;
            if (typeof benefitName === "string") {
              await createHealthBenefit({
                item_id: updatedProduct.id,
                benefit: benefitName,
              });
            }
          })
        );

        await Promise.all(
          benefitsToDelete.map(async (benefit) => {
            const benefitId =
              typeof benefit === "object" && "id" in benefit
                ? benefit.id
                : null;

            if (typeof benefitId === "string") {
              await deleteHealthBenefit(benefitId);
            }
          })
        );

        const fullyUpdatedProduct = {
          ...updatedProduct,
          health_benefits: currentBenefits,
        };

        setProducts((prev) =>
          prev.map((product) =>
            product.id === fullyUpdatedProduct.id
              ? fullyUpdatedProduct
              : product
          )
        );

        resetForm();
        showSnackbar("Ürün Başarıyla Güncellendi!", "success");
      } catch (error) {
        console.error("Failed to edit product:", error);
        showSnackbar(
          "Ürün Düzenlenirken Hata Oluştu. Tekrar Deneyin.",
          "error"
        );
      }
    }
  };

  // Handle Delete Product
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      setDeleteConfirmationId(null); // Reset confirmation state
      showSnackbar("Ürün Başarıyla Silindi!", "success");
    } catch (error) {
      console.error("Failed to delete product:", error);
      showSnackbar("Ürün Silinemedi. Tekrar Deneyiniz.", "error");
    }
  };

  const handleDeleteClick = (id: string) => {
    if (deleteConfirmationId === id) {
      // Proceed with deletion
      clearTimeout(deleteTimer!);
      setDeleteConfirmationId(null);
      handleDelete(id);
    } else {
      // Set confirmation state
      setDeleteConfirmationId(id);
      const timer = setTimeout(() => {
        setDeleteConfirmationId(null); // Reset after 5 seconds
      }, 5000);
      setDeleteTimer(timer);
    }
  };

  useEffect(() => {
    return () => {
      if (deleteTimer) clearTimeout(deleteTimer);
    };
  }, [deleteTimer]);

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
      category: { id: "", name: "" }, // Provide the correct structure
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
          className="w-full p-2 border border-gray-300 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      {/* Product Table */}
      <table className="min-w-full bg-white border border-gray-300  text-black rounded-lg shadow-md">
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
                <td className="p-4 text-gray-600">
                  {product.category?.name || "Kategori Yok"}
                </td>
                <td className="p-4 text-gray-600">
                  {product.price.toFixed(2)} ₺
                </td>
                <td className="p-4 text-gray-600">{product.stock}</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditingProduct({
                          ...product,
                          health_benefits:
                            (
                              product.health_benefits as Array<
                                string | { benefit: string }
                              >
                            )?.map((benefit) =>
                              typeof benefit === "object" &&
                              "benefit" in benefit
                                ? benefit.benefit
                                : benefit
                            ) || [],

                          image_ids:
                            product.images?.map((image) => image.id) || [], // Populate image_ids from images
                          category_id: product.category?.id, // Ensure category_id is set
                        });
                        setShowModal(true);
                      }}
                      className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(product.id);
                      }}
                      className={`${
                        deleteConfirmationId === product.id
                          ? "bg-red-500 text-white px-3 mt-1 py-1 rounded-lg"
                          : "bg-red-500 text-white p-2 rounded-lg"
                      } hover:bg-red-600`}
                    >
                      {deleteConfirmationId === product.id ? (
                        "Silme işlemini onaylamak için tıklayın."
                      ) : (
                        <FaTrashAlt />
                      )}
                    </button>
                  </div>
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
                  ? "bg-blue-500 text-white"
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
            <h3 className="text-xl text-gray-900 font-bold mb-4">
              {isEditing ? "Ürün Bilgilerini Düzenle" : "Yeni Ürün Ekle"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Selection */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Kategoriler
                </label>
                <button
                  onClick={openCategoryModal}
                  className="w-full bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                >
                  Kategori Seç
                </button>
                <div className="mt-2 flex gap-2 flex-wrap text-gray-600">
                  {(isEditing && editingProduct
                    ? editingProduct.category
                    : newProduct.category
                  )?.name || "Kategori seçilmedi"}
                </div>
              </div>

              {/* Images Selection */}
              <div>
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Görseller <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={openImageModal}
                  className="w-full bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                >
                  Görsel Ekle
                </button>
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {(isEditing && editingProduct
                    ? editingProduct.image_ids || []
                    : newProduct.image_ids
                  ).map((id, index) => {
                    const imagePath = `http://localhost:8000/uskumenzade/api/static/images/${id}.jpg`; // Replace with the correct image URL format
                    return (
                      <div
                        key={index}
                        className="w-24 h-24 bg-gray-200 border rounded-lg flex-shrink-0"
                      >
                        <img
                          src={imagePath}
                          alt={`Selected Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ürün İsmi <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ürün ismini girin"
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
                  className="w-full p-2 border border-gray-300 bg-gray-200 text-black rounded-lg"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Ürün açıklamasını girin"
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
                  className="w-full p-2 border border-gray-300 bg-gray-200 text-black rounded-lg"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fiyat <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Ürün fiyatını girin"
                  value={
                    isEditing
                      ? editingProduct?.price || ""
                      : newProduct.price || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      ? parseFloat(e.target.value)
                      : 0;
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, price: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({ ...prev, price: value }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 bg-gray-200 text-black rounded-lg"
                />
              </div>

              {/* Discounted Price */}
              <div>
                <label
                  htmlFor="discounted_price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  İndirimli Fiyat
                </label>
                <input
                  id="discounted_price"
                  name="discounted_price"
                  type="number"
                  placeholder="İndirimli fiyatı girin"
                  value={
                    isEditing
                      ? editingProduct?.discounted_price || ""
                      : newProduct.discounted_price || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      ? parseFloat(e.target.value)
                      : 0;
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
                  className="w-full p-2 border border-gray-300 bg-gray-200 text-black rounded-lg"
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stok <span className="text-red-500">*</span>
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="Stok sayısını girin"
                  value={
                    isEditing
                      ? editingProduct?.stock || ""
                      : newProduct.stock || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      ? parseInt(e.target.value, 10)
                      : 0;
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, stock: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({ ...prev, stock: value }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 bg-gray-200 text-black rounded-lg"
                />
              </div>

              {/* Benefits */}
              <div>
                <label
                  htmlFor="benefits"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sağlık Yararları (Virgülle Ayırarak Girin)
                </label>
                <input
                  id="benefits"
                  name="benefits"
                  type="text"
                  placeholder="Sağlık yararlarını girin, örn: Bağışıklık güçlendirici, Sindirimi düzenleyici"
                  value={
                    isEditing
                      ? editingProduct?.health_benefits?.join(", ") || ""
                      : newProduct.health_benefits?.join(", ")
                  }
                  onChange={(e) => {
                    const value = e.target.value.split(",");
                    if (isEditing) {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, health_benefits: value } : prev
                      );
                    } else {
                      setNewProduct((prev) => ({
                        ...prev,
                        health_benefits: value,
                      }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 bg-gray-200 text-black rounded-lg"
                />
              </div>

              {/* How to Use */}
              <div>
                <label
                  htmlFor="how_to_use"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nasıl Kullanılır?
                </label>
                <textarea
                  id="how_to_use"
                  name="how_to_use"
                  placeholder="Kullanma talimatlarını girin"
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
                  className="w-full p-2 border border-gray-300 bg-gray-200 text-black rounded-lg"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  const productToValidate = isEditing
                    ? editingProduct
                    : newProduct;

                  if (
                    !productToValidate?.name ||
                    !productToValidate?.price ||
                    !productToValidate?.stock ||
                    !productToValidate?.category_id ||
                    productToValidate?.image_ids.length === 0
                  ) {
                    alert(
                      "Please fill all required fields and select a category and images."
                    );
                    console.log("Validation failed:", productToValidate);
                    return;
                  }

                  console.log(
                    "Validation passed. Triggering handleEditProduct."
                  );
                  if (isEditing) {
                    handleEditProduct();
                  } else {
                    handleAddProduct();
                  }
                }}
                className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
              >
                {isEditing ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
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
            if (isEditing && editingProduct) {
              setEditingProduct((prev) =>
                prev
                  ? {
                      ...prev,
                      image_ids: Array.from(
                        new Set([...prev.image_ids, imageId])
                      ), // Ensure no duplicates
                    }
                  : prev
              );
            } else {
              setNewProduct((prev) => ({
                ...prev,
                image_ids: Array.from(new Set([...prev.image_ids, imageId])), // Ensure no duplicates
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
            if (categories.length > 0) {
              const selectedCategory = categories[0]; // Use the first category for simplicity
              if (isEditing && editingProduct) {
                // Update the editing product state
                setEditingProduct((prev) =>
                  prev
                    ? {
                        ...prev,
                        category: selectedCategory, // Set full category object
                        category_id: selectedCategory.id, // Ensure API compatibility
                      }
                    : prev
                );
              } else {
                // Update the new product state
                setNewProduct((prev) => ({
                  ...prev,
                  category: selectedCategory, // Set full category object
                  category_id: selectedCategory.id, // Ensure API compatibility
                }));
              }
            } else {
              console.error("Kategori Seçilmedi.");
            }
          }}
        />
      )}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
};
