"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  loadCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../redux/slices/categorySlice";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Snackbar } from "../index";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (categories: Category[]) => void;
  definitionPage?: boolean;
}

interface Category {
  id: string;
  name: string;
}

export function CategoryModal({
  isOpen,
  onClose,
  onCategorySelect,
  definitionPage = false,
}: CategoryModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.category.categories
  );
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  // state for deletion confirmation
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSaveSelectedCategories = () => {
    if (selectedCategories.length > 0) {
      onCategorySelect(selectedCategories);
      onClose();
    } else {
      setSnackbar({
        message: "No categories selected to save.",
        type: "error",
      });
    }
  };

  const handleSelectCategory = (category: Category) => {
    if (!selectedCategories.some((c) => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleDeselectCategory = (id: string) => {
    setSelectedCategories(
      selectedCategories.filter((category) => category.id !== id)
    );
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(loadCategories());
    }
  }, [isOpen, dispatch]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setSnackbar({ message: "Kategori adı boş olamaz.", type: "error" });
      return;
    }

    try {
      await dispatch(addCategory({ name: newCategory.trim() })).unwrap();
      setNewCategory("");
      setSnackbar({ message: "Kategori başarıyla eklendi!", type: "success" });
    } catch {
      setSnackbar({
        message: "Kategori eklenirken bir hata oluştu.",
        type: "error",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim() || !editCategoryId) return;

    try {
      await dispatch(
        updateCategory({ id: editCategoryId, name: editCategoryName.trim() })
      ).unwrap();
      setEditCategoryId(null);
      setEditCategoryName("");
      setSnackbar({
        message: "Kategori başarıyla güncellendi!",
        type: "success",
      });
    } catch {
      setSnackbar({
        message: "Kategori güncellenirken bir hata oluştu.",
        type: "error",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      setSnackbar({ message: "Kategori başarıyla silindi!", type: "success" });
    } catch {
      setSnackbar({
        message: "Kategori silinirken bir hata oluştu.",
        type: "error",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    if (deleteConfirmationId === id) {
      // Proceed with deletion
      clearTimeout(deleteTimer!);
      setDeleteConfirmationId(null);
      handleDeleteCategory(id);
    } else {
      // Set confirmation state
      setDeleteConfirmationId(id);
      const timer = setTimeout(() => {
        setDeleteConfirmationId(null);
      }, 5000);
      setDeleteTimer(timer);
    }
  };

  // Ensure cleanup on component unmount
  useEffect(() => {
    return () => {
      if (deleteTimer) clearTimeout(deleteTimer);
    };
  }, [deleteTimer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl text-black font-semibold mb-6">
          Kategori Yönetimi
        </h3>

        <div className="mb-6">
          <label
            htmlFor="category-input"
            className="block text-sm font-medium text-gray-700"
          >
            Yeni Kategori
          </label>
          <div className="flex items-center">
            <input
              id="category-input"
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCategory}
              className="ml-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Ekle
            </button>
          </div>
        </div>
        <div className="flex flex-row">
          {/* Defined Categories Section */}
          <div className="flex-1 mx-1">
            <h4 className="text-xl text-black font-semibold mb-4">
              Tanımlanmış Kategoriler
            </h4>
            <ul className="space-y-4 overflow-y-auto max-h-64 pr-2 scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`flex items-center justify-between border p-3 rounded-lg shadow-sm cursor-pointer ${
                    selectedCategories.some((c) => c.id === category.id)
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleSelectCategory(category)}
                >
                  {editCategoryId === category.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="flex-1 bg-white text-black p-2 border rounded-lg"
                      />
                      <button
                        onClick={handleUpdateCategory}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditCategoryId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-800">{category.name}</span>
                  )}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditCategoryId(category.id);
                        setEditCategoryName(category.name);
                      }}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(category.id);
                      }}
                      className={`${
                        deleteConfirmationId === category.id
                          ? "bg-red-500 text-white px-3 py-1 rounded-full"
                          : "bg-red-500 text-white p-2 rounded-full"
                      } hover:bg-red-600`}
                    >
                      {deleteConfirmationId === category.id ? (
                        "Silme işlemini onaylamak için tıklayın."
                      ) : (
                        <FiTrash2 />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {!definitionPage && (
            <>
              {/* Divider */}
              <div className="w-px bg-gray-300 mx-2"></div>

              {/* Selected Categories Section */}
              <div className="flex-1 mx-1">
                <h4 className="text-xl text-black font-semibold mb-4">
                  Seçilen Kategoriler
                </h4>
                <ul className="space-y-4">
                  {selectedCategories.map((category) => (
                    <li
                      key={category.id}
                      className="flex items-center justify-between border p-3 rounded-lg shadow-sm bg-green-100"
                    >
                      <span className="text-gray-800">{category.name}</span>
                      <button
                        onClick={() => handleDeselectCategory(category.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        Kaldır
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white mx-1 px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Kapat
          </button>

          <button
            onClick={handleSaveSelectedCategories}
            className="bg-blue-500 text-white mx-1 px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Kaydet
          </button>
        </div>

        {snackbar && (
          <Snackbar
            message={snackbar.message}
            type={snackbar.type}
            onClose={() => setSnackbar(null)}
          />
        )}
      </div>
    </div>
  );
}
