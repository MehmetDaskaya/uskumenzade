"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

interface Discount {
  id: string;
  code: string;
  percentage_discount: number;
  all_items: boolean;
  all_users: boolean;
  max_uses: number;
  max_uses_per_user: number;
  uses: number;
  is_active: boolean;
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
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    code: "",
    percentage_discount: 0,
    all_items: false,
    all_users: false,
    max_uses: 1,
    max_uses_per_user: 1,
    uses: 0,
    is_active: true,
    eligible_items: [],
    eligible_users: [],
  });

  const [editDiscount, setEditDiscount] = useState<Discount | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setNewDiscount({
        code: "",
        percentage_discount: 0,
        all_items: false,
        all_users: false,
        max_uses: 1,
        max_uses_per_user: 1,
        uses: 0,
        is_active: true,
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kod
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
              İndirim Yüzdesi (%)
            </label>
            <input
              type="number"
              value={
                editDiscount
                  ? editDiscount.percentage_discount
                  : newDiscount.percentage_discount
              }
              onChange={(e) =>
                editDiscount
                  ? setEditDiscount({
                      ...editDiscount,
                      percentage_discount: Number(e.target.value),
                    })
                  : setNewDiscount({
                      ...newDiscount,
                      percentage_discount: Number(e.target.value),
                    })
              }
              className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center justify-between">
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
              <span className="text-gray-700">Tüm Ürünlere Uygula</span>
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
              <span className="text-gray-700">Tüm Kullanıcılara Uygula</span>
            </label>
          </div>

          {/* Max Uses */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maksimum Kullanım
              </label>
              <input
                type="number"
                value={
                  editDiscount ? editDiscount.max_uses : newDiscount.max_uses
                }
                onChange={(e) =>
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        max_uses: Number(e.target.value),
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        max_uses: Number(e.target.value),
                      })
                }
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
                    ? editDiscount.max_uses_per_user
                    : newDiscount.max_uses_per_user
                }
                onChange={(e) =>
                  editDiscount
                    ? setEditDiscount({
                        ...editDiscount,
                        max_uses_per_user: Number(e.target.value),
                      })
                    : setNewDiscount({
                        ...newDiscount,
                        max_uses_per_user: Number(e.target.value),
                      })
                }
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
                    %{discount.percentage_discount} indirim
                  </p>
                  <p className="text-sm text-gray-600">
                    Kalan Kupon: {discount.max_uses - discount.uses}
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
