"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { loadTags, addTag, editTag, removeTag } from "@/redux/slices/tagSlice";
import { Snackbar } from "../index";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagSelect: (tags: Tag[]) => void;
  definitionPage?: boolean;
}

interface Tag {
  id: string;
  name: string;
}

export function TagModal({
  isOpen,
  onClose,
  onTagSelect,
  definitionPage = false,
}: TagModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const tags = useSelector((state: RootState) => state.tags.tags);
  const loading = useSelector((state: RootState) => state.tags.loading);
  const [newTagName, setNewTagName] = useState("");
  const [editTagId, setEditTagId] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(loadTags());
    }
  }, [isOpen, dispatch]);

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      showSnackbar("Etiket adı boş olamaz.", "error");
      return;
    }
    try {
      await dispatch(addTag(newTagName.trim())).unwrap();
      setNewTagName("");
      showSnackbar("Etiket başarıyla eklendi!", "success");
    } catch {
      showSnackbar("Etiket eklenirken bir hata oluştu.", "error");
    }
  };

  const handleEditTag = async () => {
    if (!editTagName.trim() || !editTagId) {
      showSnackbar("Etiket adı boş olamaz.", "error");
      return;
    }
    try {
      await dispatch(
        editTag({ tagId: editTagId, name: editTagName.trim() })
      ).unwrap();
      setEditTagId(null);
      setEditTagName("");
      showSnackbar("Etiket başarıyla güncellendi!", "success");
    } catch {
      showSnackbar("Etiket güncellenirken bir hata oluştu.", "error");
    }
  };
  const handleDeleteTag = async (tagId: string) => {
    try {
      await dispatch(removeTag(tagId)).unwrap();
      showSnackbar("Etiket başarıyla silindi!", "success");
    } catch {
      showSnackbar("Etiket silinirken bir hata oluştu.", "error");
    }
  };

  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDeselectTag = (id: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== id));
  };

  const handleSaveSelectedTags = () => {
    onTagSelect(selectedTags);
    onClose();
  };

  const handleDeleteClick = (tagId: string) => {
    if (deleteConfirmationId === tagId) {
      // Proceed with deletion
      clearTimeout(deleteTimer!);
      setDeleteConfirmationId(null);
      handleDeleteTag(tagId);
    } else {
      // Set confirmation state
      setDeleteConfirmationId(tagId);
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
          Etiket Yönetimi
        </h3>

        <div className="mb-6">
          <label
            htmlFor="tag-input"
            className="block text-sm font-medium text-gray-700"
          >
            Yeni Etiket Ekle
          </label>
          <div className="flex items-center">
            <input
              id="tag-input"
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="flex-1 bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTag}
              className="ml-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Ekle
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Available Tags */}
          <div className="flex-1 mx-1">
            <h4 className="text-xl text-black font-semibold mb-4">
              Kayıtlı Etiketler
            </h4>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <ul className="space-y-4 overflow-y-auto max-h-64 pr-2 scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                {tags.map((tag) => (
                  <li
                    key={tag.id}
                    className={`flex items-center justify-between border p-3 rounded-lg shadow-sm ${
                      selectedTags.some((t) => t.id === tag.id)
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => handleSelectTag(tag)}
                  >
                    {editTagId === tag.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editTagName}
                          onChange={(e) => setEditTagName(e.target.value)}
                          className="flex-1 bg-white text-black p-2 border rounded-lg"
                        />
                        <button
                          onClick={handleEditTag}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setEditTagId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-800">{tag.name}</span>
                    )}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTagId(tag.id);
                          setEditTagName(tag.name);
                        }}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(tag.id);
                        }}
                        className={`${
                          deleteConfirmationId === tag.id
                            ? "bg-red-500 text-white px-3 py-1 rounded-lg"
                            : "bg-red-500 text-white p-2 rounded-full"
                        } hover:bg-red-600`}
                      >
                        {deleteConfirmationId === tag.id ? (
                          "Silme işlemini onaylamak için tıklayın."
                        ) : (
                          <FiTrash2 />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Conditional Divider and Selected Tags */}
          {!definitionPage && (
            <>
              {/* Divider */}
              <div className="w-px bg-gray-300 mx-2"></div>

              {/* Selected Tags */}
              <div className="flex-1 mx-1">
                <h4 className="text-xl text-black font-semibold mb-4">
                  Seçilen Etiketler
                </h4>
                <ul className="space-y-4">
                  {selectedTags.map((tag) => (
                    <li
                      key={tag.id}
                      className="flex items-center justify-between border p-3 rounded-lg shadow-sm bg-green-100"
                    >
                      <span className="text-gray-800">{tag.name}</span>
                      <button
                        onClick={() => handleDeselectTag(tag.id)}
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
            onClick={handleSaveSelectedTags}
            className="bg-blue-500 text-white mx-1 px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Kaydet
          </button>
        </div>
      </div>
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}
