"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { Snackbar } from "../index";

import { Banner } from "@/app/api/banner/bannerApi";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Partial<Banner>) => void | Promise<void>;
  onUpdate: (
    bannerId: string,
    updatedBanner: Partial<Banner>
  ) => void | Promise<void>;
  onDelete: (bannerId: string) => void | Promise<void>;
  banners: Banner[];
}

export const BannerModal = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  banners,
}: BannerModalProps) => {
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    title: "",
    description: "",
    href: "",
    image_id: "",
  });
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setNewBanner({ title: "", description: "", href: "", image_id: "" });
      setEditBanner(null);
      setDeleteConfirmId(null);
      setSnackbar(null);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      if (editBanner) {
        await onUpdate(editBanner.id, editBanner);
        setSnackbar({
          message: "Banner başarıyla güncellendi!",
          type: "success",
        });
      } else {
        await onSave(newBanner);
        setSnackbar({
          message: "Banner başarıyla oluşturuldu!",
          type: "success",
        });
      }
      // don’t call onClose() here—wait for the snackbar to auto-dismiss
    } catch (error: unknown) {
      console.error("Banner kaydetme hatası:", error);
      setSnackbar({
        message: editBanner
          ? "Banner güncellenirken bir hata oluştu."
          : "Banner oluşturulurken bir hata oluştu.",
        type: "error",
      });
    }
  };

  const handleDelete = (bannerId: string) => {
    onDelete(bannerId);
    setDeleteConfirmId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto">
        <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
          >
            <FaTimes />
          </button>
          <h3 className="text-2xl font-semibold text-black mb-6">
            {editBanner ? "Banner Düzenle" : "Yeni Banner Ekle"}
          </h3>

          {/* Form Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Başlık"
              value={editBanner ? editBanner.title : newBanner.title}
              onChange={(e) =>
                editBanner
                  ? setEditBanner({ ...editBanner, title: e.target.value })
                  : setNewBanner({ ...newBanner, title: e.target.value })
              }
              className="w-full border p-3 rounded bg-white"
            />

            <input
              type="text"
              placeholder="Açıklama"
              value={
                editBanner ? editBanner.description : newBanner.description
              }
              onChange={(e) =>
                editBanner
                  ? setEditBanner({
                      ...editBanner,
                      description: e.target.value,
                    })
                  : setNewBanner({ ...newBanner, description: e.target.value })
              }
              className="w-full border p-3 rounded bg-white"
            />

            <input
              type="text"
              placeholder="Yönlendirme Linki (href)"
              value={editBanner ? editBanner.href : newBanner.href}
              onChange={(e) =>
                editBanner
                  ? setEditBanner({ ...editBanner, href: e.target.value })
                  : setNewBanner({ ...newBanner, href: e.target.value })
              }
              className="w-full border p-3 rounded bg-white"
            />

            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Görsel ID"
                value={editBanner ? editBanner.image_id : newBanner.image_id}
                onChange={(e) =>
                  editBanner
                    ? setEditBanner({ ...editBanner, image_id: e.target.value })
                    : setNewBanner({ ...newBanner, image_id: e.target.value })
                }
                className="w-full border p-3 rounded bg-white"
              />
              <span className="text-xs text-gray-500">
                Görsel ID seçimi için görsel yönetim panelini kullanabilirsiniz.
              </span>
            </div>
          </div>

          {/* Banner List */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Mevcut Bannerlar</h4>
            <ul className="space-y-4 max-h-64 overflow-y-auto">
              {banners.map((banner) => (
                <li
                  key={banner.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        banner.image?.url || `/api/images/${banner.image_id}`
                      }
                      alt={banner.image?.alt_text || "banner image"}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-semibold">{banner.title}</p>
                      <p className="text-xs text-gray-600">
                        {banner.description}
                      </p>
                      <p className="text-xs text-blue-600 truncate">
                        {banner.href}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditBanner(banner)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => {
                        if (deleteConfirmId === banner.id) {
                          handleDelete(banner.id);
                        } else {
                          setDeleteConfirmId(banner.id);
                        }
                      }}
                      className={`${
                        deleteConfirmId === banner.id
                          ? "bg-red-500 text-white px-3 py-1 rounded"
                          : "bg-red-500 text-white p-2 rounded"
                      } hover:bg-red-600`}
                    >
                      {deleteConfirmId === banner.id ? "Sil?" : <FiTrash2 />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {editBanner ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => {
            setSnackbar(null);
            onClose(); // close modal after toast disappears
          }}
        />
      )}
    </>
  );
};
