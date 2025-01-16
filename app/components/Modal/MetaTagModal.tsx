"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  loadMetaTags,
  addMetaTag,
  editMetaTag,
  removeMetaTag,
} from "@/redux/slices/metaTagSlice";
import { Snackbar } from "../index";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface MetaTag {
  id: string;
  name: string;
}

interface MetaTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMetaTagSelect: (metaTags: MetaTag[]) => void;
  definitionPage?: boolean;
}

export function MetaTagModal({
  isOpen,
  onClose,
  onMetaTagSelect,
  definitionPage = false,
}: MetaTagModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const metaTags = useSelector((state: RootState) => state.metaTag.metaTags);
  const loading = useSelector((state: RootState) => state.metaTag.loading);

  const [newMetaTag, setNewMetaTag] = useState("");
  const [editMetaTagId, setEditMetaTagId] = useState<string | null>(null);
  const [editMetaTagName, setEditMetaTagName] = useState("");
  const [selectedMetaTags, setSelectedMetaTags] = useState<MetaTag[]>([]);

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

  const handleSaveSelectedMetaTags = () => {
    if (selectedMetaTags.length > 0) {
      onMetaTagSelect(selectedMetaTags);
      onClose();
    }
  };

  const handleSelectMetaTag = (metaTag: MetaTag) => {
    if (!selectedMetaTags.some((m) => m.id === metaTag.id)) {
      setSelectedMetaTags([...selectedMetaTags, metaTag]);
    }
  };

  const handleDeselectMetaTag = (id: string) => {
    setSelectedMetaTags(
      selectedMetaTags.filter((metaTag) => metaTag.id !== id)
    );
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(loadMetaTags());
    }
  }, [isOpen, dispatch]);

  const handleAddMetaTag = async () => {
    if (!newMetaTag.trim()) {
      showSnackbar("Meta etiket adı boş olamaz.", "error");
      return;
    }

    try {
      await dispatch(addMetaTag(newMetaTag.trim())).unwrap();
      setNewMetaTag("");
      showSnackbar("Meta etiket başarıyla eklendi!", "success");
    } catch {
      showSnackbar("Meta etiket eklenirken bir hata oluştu.", "error");
    }
  };

  const handleEditMetaTag = async () => {
    if (!editMetaTagId || !editMetaTagName.trim()) return;

    try {
      await dispatch(
        editMetaTag({ metaTagId: editMetaTagId, name: editMetaTagName.trim() })
      ).unwrap();
      setEditMetaTagId(null);
      setEditMetaTagName("");
      showSnackbar("Meta etiket başarıyla güncellendi!", "success");
    } catch {
      showSnackbar("Meta etiket güncellenirken bir hata oluştu.", "error");
    }
  };

  const handleDeleteMetaTag = async (metaTagId: string) => {
    try {
      await dispatch(removeMetaTag(metaTagId)).unwrap();
      showSnackbar("Meta etiket başarıyla silindi!", "success");
    } catch {
      showSnackbar("Meta etiket silinirken bir hata oluştu.", "error");
    }
  };

  const handleDeleteClick = (id: string) => {
    if (deleteConfirmationId === id) {
      // Proceed with deletion
      clearTimeout(deleteTimer!);
      setDeleteConfirmationId(null);
      handleDeleteMetaTag(id);
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
        <h3 className="text-2xl font-bold mb-6">Meta Etiket Yönetimi</h3>

        <div className="mb-6">
          <label htmlFor="metaTag-input" className="block mb-2">
            Yeni Meta Etiket
          </label>
          <div className="flex items-center">
            <input
              id="metaTag-input"
              type="text"
              value={newMetaTag}
              onChange={(e) => setNewMetaTag(e.target.value)}
              className="flex-1 p-2 border bg-white text-black rounded-lg"
            />
            <button
              onClick={handleAddMetaTag}
              className="ml-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Ekle
            </button>
          </div>
        </div>

        <div className="flex flex-row">
          {/* Defined Meta Tags Section */}
          <div className="flex-1 mx-1">
            <h4 className="text-lg font-semibold mb-4">
              Kayıtlı Meta Etiketler
            </h4>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <ul className="space-y-4 overflow-y-auto max-h-64 pr-2 scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                {metaTags.map((metaTag) => (
                  <li
                    key={metaTag.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      selectedMetaTags.some((m) => m.id === metaTag.id)
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => handleSelectMetaTag(metaTag)}
                  >
                    {editMetaTagId === metaTag.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editMetaTagName}
                          onChange={(e) => setEditMetaTagName(e.target.value)}
                          className="flex-1 bg-white text-black p-2 border rounded-lg"
                        />
                        <button
                          onClick={handleEditMetaTag}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setEditMetaTagId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <span>{metaTag.name}</span>
                    )}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditMetaTagId(metaTag.id);
                          setEditMetaTagName(metaTag.name);
                        }}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(metaTag.id);
                        }}
                        className={`${
                          deleteConfirmationId === metaTag.id
                            ? "bg-red-500 text-white px-3 py-1 rounded-lg"
                            : "bg-red-500 text-white p-2 rounded-full"
                        } hover:bg-red-600`}
                      >
                        {deleteConfirmationId === metaTag.id ? (
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

          {/* Conditionally render divider and "Seçilen" section */}
          {!definitionPage && (
            <>
              {/* Divider */}
              <div className="w-px bg-gray-300 mx-2"></div>

              {/* Selected Meta Tags Section */}
              <div className="flex-1 mx-1">
                <h4 className="text-lg font-semibold mb-4">
                  Seçilen Meta Etiketler
                </h4>
                <ul className="space-y-4 overflow-y-auto max-h-64 pr-2">
                  {selectedMetaTags.map((metaTag) => (
                    <li
                      key={metaTag.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-green-100"
                    >
                      <span>{metaTag.name}</span>
                      <button
                        onClick={() => handleDeselectMetaTag(metaTag.id)}
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
            onClick={handleSaveSelectedMetaTags}
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
