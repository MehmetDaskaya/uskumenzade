"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

interface Discount {
  id: string;
  code: string;
  discount_value?: number;
  is_percentage: boolean;
  all_items: boolean;
  all_users: boolean;
  max_uses?: number;
  max_uses_per_user?: number;
  uses: number;
  is_active: boolean;
  min_order_value?: number;
  eligible_items: string[];
  eligible_users: string[];
}

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discount: Partial<Discount>) => void;
  onUpdate: (discountId: string, updatedDiscount: Partial<Discount>) => void;
  onDelete: (discountId: string) => void;
  discounts: Discount[];
}

export function DiscountModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  discounts,
}: DiscountModalProps) {
  type DiscountForm = Omit<Discount, "id" | "created_at" | "updated_at">;

  const [newDiscount, setNewDiscount] = useState<Partial<DiscountForm>>({
    code: "",
    discount_value: undefined,
    is_percentage: true,
    all_items: true,
    all_users: true,
    max_uses: undefined,
    max_uses_per_user: undefined,
    uses: 0,
    is_active: true,
    min_order_value: undefined,
    eligible_items: [],
    eligible_users: [],
  });

  const [editDiscount, setEditDiscount] = useState<Discount | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setNewDiscount({
        code: "",
        discount_value: undefined,
        is_percentage: true,
        all_items: true,
        all_users: true,
        max_uses: undefined,
        max_uses_per_user: undefined,
        uses: 0,
        is_active: true,
        min_order_value: undefined,
        eligible_items: [],
        eligible_users: [],
      });
      setEditDiscount(null);
      setDeleteConfirmId(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (editDiscount) {
      onUpdate(editDiscount.id, editDiscount);
    } else {
      onSave(newDiscount);
    }
    onClose();
  };

  const handleDelete = (discountId: string) => {
    onDelete(discountId);
    setDeleteConfirmId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
        >
          <FaTimes />
        </button>
        <h3 className="text-2xl font-semibold text-black mb-6">
          {editDiscount ? "İndirimi Düzenle" : "Yeni İndirim Ekle"}
        </h3>

        {/* Discount Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                İndirim Kodu
              </label>
              <input
                type="text"
                value={editDiscount ? editDiscount.code : newDiscount.code}
                onChange={(e) =>
                  editDiscount
                    ? setEditDiscount({ ...editDiscount, code: e.target.value })
                    : setNewDiscount({ ...newDiscount, code: e.target.value })
                }
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                İndirim Değeri
              </label>
              <input
                type="number"
                value={
                  editDiscount
                    ? editDiscount.discount_value ?? ""
                    : newDiscount.discount_value ?? ""
                }
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        discount_value: value,
                      })
                    : setNewDiscount({ ...newDiscount, discount_value: value });
                }}
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Discount Type & Min Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  editDiscount
                    ? editDiscount.is_percentage
                    : newDiscount.is_percentage
                }
                onChange={(e) =>
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        is_percentage: e.target.checked,
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        is_percentage: e.target.checked,
                      })
                }
              />
              <span className="text-gray-700">İndirim Yüzdelik mi?</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Sipariş Tutarı (₺)
              </label>
              <input
                type="number"
                value={
                  editDiscount
                    ? editDiscount.min_order_value ?? ""
                    : newDiscount.min_order_value ?? ""
                }
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        min_order_value: value,
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        min_order_value: value,
                      });
                }}
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  editDiscount ? editDiscount.all_items : newDiscount.all_items
                }
                onChange={(e) =>
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        all_items: e.target.checked,
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        all_items: e.target.checked,
                      })
                }
              />
              <span className="text-gray-700">Tüm Ürünlerde Geçerli</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  editDiscount ? editDiscount.all_users : newDiscount.all_users
                }
                onChange={(e) =>
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        all_users: e.target.checked,
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        all_users: e.target.checked,
                      })
                }
              />
              <span className="text-gray-700">Her Kullanıcıda Geçerli</span>
            </label>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maksimum Kullanım
              </label>
              <input
                type="number"
                value={
                  editDiscount
                    ? editDiscount.max_uses ?? ""
                    : newDiscount.max_uses ?? ""
                }
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        max_uses: value,
                      })
                    : setNewDiscount({ ...newDiscount, max_uses: value });
                }}
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kullanıcı Başına Kullanım
              </label>
              <input
                type="number"
                value={
                  editDiscount
                    ? editDiscount.max_uses_per_user ?? ""
                    : newDiscount.max_uses_per_user ?? ""
                }
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        max_uses_per_user: value,
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        max_uses_per_user: value,
                      });
                }}
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Existing Discounts */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-black mb-4">
            Mevcut İndirimler
          </h3>
          <ul className="space-y-4 max-h-64 overflow-y-auto">
            {discounts.map((discount) => (
              <li
                key={discount.id}
                className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-gray-50"
              >
                <div>
                  <p className="text-gray-800 font-semibold">{discount.code}</p>
                  <p className="text-sm text-gray-600">
                    {discount.is_percentage
                      ? `%${discount.discount_value} indirim`
                      : `${discount.discount_value}₺ indirim`}
                  </p>

                  <p className="text-sm text-gray-600">
                    Kalan Kupon: {(discount.max_uses ?? 0) - discount.uses}
                  </p>

                  <p className="text-sm text-gray-600">
                    {discount.all_users
                      ? "Tüm Kullanıcılara Uygulanır"
                      : "Belirli Kullanıcılara Uygulanır"}
                  </p>
                  <label className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={discount.is_active}
                      onChange={() =>
                        onUpdate(discount.id, {
                          is_active: !discount.is_active,
                        })
                      }
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700">
                      {discount.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditDiscount(discount)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() =>
                      deleteConfirmId === discount.id
                        ? handleDelete(discount.id)
                        : setDeleteConfirmId(discount.id)
                    }
                    className={`${
                      deleteConfirmId === discount.id
                        ? "bg-red-500 text-white px-3 py-1 rounded-lg"
                        : "bg-red-500 text-white p-2 rounded-full"
                    } hover:bg-red-600`}
                  >
                    {deleteConfirmId === discount.id ? (
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
            {editDiscount ? "Güncelle" : "Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}
