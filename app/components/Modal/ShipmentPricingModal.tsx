"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { Snackbar } from "../index";
import { ShipmentPricing } from "@/app/api/shipment-pricing/shipmentPricingApi";

interface ShipmentPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pricing: Partial<ShipmentPricing>) => void;
  onUpdate: (
    pricingId: string,
    updatedPricing: Partial<ShipmentPricing>
  ) => void;
  onDelete: (pricingId: string) => void;
  pricings: ShipmentPricing[];
}

export function ShipmentPricingModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  pricings,
}: ShipmentPricingModalProps) {
  type ShipmentPricingForm = Omit<
    ShipmentPricing,
    "id" | "created_at" | "updated_at"
  >;

  const [newPricing, setNewPricing] = useState<Partial<ShipmentPricingForm>>({
    min_volume: 0,
    max_volume: 0,
    price: 0,
  });

  const [editPricing, setEditPricing] = useState<ShipmentPricing | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setNewPricing({
        min_volume: 0,
        max_volume: 0,
        price: 0,
      });
      setEditPricing(null);
      setDeleteConfirmId(null);
      setSnackbar(null);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      if (editPricing) {
        await onUpdate(editPricing.id, editPricing);
        setSnackbar({
          message: "Kargo fiyatlandırması başarıyla güncellendi!",
          type: "success",
        });
      } else {
        await onSave(newPricing);
        setSnackbar({
          message: "Kargo fiyatlandırması başarıyla oluşturuldu!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Kargo fiyatlandırması kaydetme hatası:", error);
      setSnackbar({
        message: editPricing
          ? "Kargo fiyatlandırması güncellenirken bir hata oluştu."
          : "Kargo fiyatlandırması oluşturulurken bir hata oluştu.",
        type: "error",
      });
    }
  };

  const handleDelete = (pricingId: string) => {
    onDelete(pricingId);
    setDeleteConfirmId(null);
  };

  const calculateVAT = (price: number | string | undefined) => {
    const numPrice =
      typeof price === "string" ? parseFloat(price) || 0 : price || 0;
    return Number(numPrice * 0.18); // 18% VAT
  };

  const calculateTotalWithVAT = (price: number | string | undefined) => {
    const numPrice =
      typeof price === "string" ? parseFloat(price) || 0 : price || 0;
    return Number(numPrice + calculateVAT(numPrice));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
        <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
          >
            <FaTimes />
          </button>
          <h3 className="text-2xl font-semibold text-black mb-6">
            {editPricing
              ? "Kargo Fiyatlandırmasını Düzenle"
              : "Yeni Kargo Fiyatlandırması Ekle"}
          </h3>

          {/* Pricing Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Hacim (Desi)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={
                    editPricing
                      ? editPricing.min_volume ?? ""
                      : newPricing.min_volume ?? ""
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    if (editPricing) {
                      setEditPricing({
                        ...editPricing,
                        min_volume: value,
                      });
                    } else {
                      setNewPricing({ ...newPricing, min_volume: value });
                    }
                  }}
                  className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maksimum Hacim (Desi)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={
                    editPricing
                      ? editPricing.max_volume ?? ""
                      : newPricing.max_volume ?? ""
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    if (editPricing) {
                      setEditPricing({
                        ...editPricing,
                        max_volume: value,
                      });
                    } else {
                      setNewPricing({ ...newPricing, max_volume: value });
                    }
                  }}
                  className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={
                    editPricing
                      ? editPricing.price ?? ""
                      : newPricing.price ?? ""
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    if (editPricing) {
                      setEditPricing({
                        ...editPricing,
                        price: value,
                      });
                    } else {
                      setNewPricing({ ...newPricing, price: value });
                    }
                  }}
                  className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {((editPricing?.price && editPricing.price > 0) ||
                  (newPricing.price && newPricing.price > 0)) && (
                  <div className="text-xs text-gray-500 mt-1">
                    KDV:{" "}
                    {calculateVAT(
                      editPricing?.price || newPricing.price || 0
                    ).toFixed(2)}
                    ₺ | Toplam:{" "}
                    {calculateTotalWithVAT(
                      editPricing?.price || newPricing.price || 0
                    ).toFixed(2)}
                    ₺
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Existing Pricings */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Mevcut Kargo Fiyatlandırmaları
            </h3>
            <ul className="space-y-4 max-h-64 overflow-y-auto">
              {pricings.map((pricing) => (
                <li
                  key={pricing.id}
                  className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-gray-50"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {pricing.min_volume} - {pricing.max_volume} Desi
                    </p>
                    <p className="text-sm text-gray-600">
                      Fiyat: {pricing.price}₺ (KDV Dahil:{" "}
                      {calculateTotalWithVAT(pricing.price || 0).toFixed(2)}₺)
                    </p>
                    <p className="text-xs text-gray-500">
                      Oluşturulma:{" "}
                      {new Date(pricing.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditPricing(pricing)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => {
                        if (deleteConfirmId === pricing.id) {
                          handleDelete(pricing.id);
                        } else {
                          setDeleteConfirmId(pricing.id);
                        }
                      }}
                      className={`${
                        deleteConfirmId === pricing.id
                          ? "bg-red-500 text-white px-3 py-1 rounded-lg"
                          : "bg-red-500 text-white p-2 rounded-full"
                      } hover:bg-red-600`}
                    >
                      {deleteConfirmId === pricing.id ? (
                        "Silmek için tıklayın"
                      ) : (
                        <FiTrash2 />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              {editPricing ? "Güncelle" : "Ekle"}
            </button>
          </div>
        </div>
      </div>

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => {
            setSnackbar(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
