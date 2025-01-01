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
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface MetaTag {
  id: string;
  name: string;
}

interface MetaTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMetaTagSelect: (metaTags: MetaTag[]) => void;
}

export function MetaTagModal({
  isOpen,
  onClose,
  onMetaTagSelect,
}: MetaTagModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const metaTags = useSelector((state: RootState) => state.metaTag.metaTags);
  const loading = useSelector((state: RootState) => state.metaTag.loading);

  const [newMetaTag, setNewMetaTag] = useState("");
  const [editMetaTagId, setEditMetaTagId] = useState<string | null>(null);
  const [editMetaTagName, setEditMetaTagName] = useState("");
  const [selectedMetaTags, setSelectedMetaTags] = useState<MetaTag[]>([]);

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
      return;
    }

    try {
      await dispatch(addMetaTag(newMetaTag.trim())).unwrap();
      setNewMetaTag("");
    } catch (error) {
      console.error("Error adding meta tag:", error);
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
    } catch (error) {
      console.error("Error editing meta tag:", error);
    }
  };

  const handleDeleteMetaTag = async (metaTagId: string) => {
    try {
      await dispatch(removeMetaTag(metaTagId)).unwrap();
    } catch (error) {
      console.error("Error deleting meta tag:", error);
    }
  };

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
              className="flex-1 p-2 border rounded-lg"
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
              <ul className="space-y-4">
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
                          className="flex-1 p-2 border rounded-lg"
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
                          handleDeleteMetaTag(metaTag.id);
                        }}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-300 mx-2"></div>

          {/* Selected Meta Tags Section */}
          <div className="flex-1 mx-1">
            <h4 className="text-lg font-semibold mb-4">
              Seçilen Meta Etiketler
            </h4>
            <ul className="space-y-4">
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
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Kapat
          </button>
          <button
            onClick={handleSaveSelectedMetaTags}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
