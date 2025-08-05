"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Snackbar } from "../index";
import {
  fetchSettingByKey,
  createSetting,
  updateSetting,
} from "@/app/api/setting/settingApi";

interface PricingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export function PricingSettingsModal({
  isOpen,
  onClose,
  token,
}: PricingSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [extraVolumeCost, setExtraVolumeCost] = useState("0");
  const [payOnDeliveryPercentage, setPayOnDeliveryPercentage] = useState("0");

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const extraVolumeSetting = await fetchSettingByKey("extra_volume_cost");
      const payOnDeliverySetting = await fetchSettingByKey(
        "pay_on_delivery_additional_percentage"
      );

      setExtraVolumeCost(extraVolumeSetting?.value || "0");
      setPayOnDeliveryPercentage(payOnDeliverySetting?.value || "0");
    } catch (error) {
      console.error("Ayarlar yüklenirken hata oluştu:", error);
      setExtraVolumeCost("0");
      setPayOnDeliveryPercentage("0");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const parsedExtraVolume = parseFloat(extraVolumeCost);
    const parsedPayOnDelivery = parseFloat(payOnDeliveryPercentage);

    if (isNaN(parsedExtraVolume) || isNaN(parsedPayOnDelivery)) {
      setSnackbar({
        message: "Geçerli bir sayı girin.",
        type: "error",
      });
      return;
    }

    try {
      // Update or create extra volume cost setting
      const existingExtraVolume = await fetchSettingByKey("extra_volume_cost");
      if (existingExtraVolume) {
        await updateSetting("extra_volume_cost", extraVolumeCost, token);
      } else {
        await createSetting(
          { key: "extra_volume_cost", value: extraVolumeCost },
          token
        );
      }

      // Update or create pay on delivery percentage setting
      const existingPayOnDelivery = await fetchSettingByKey(
        "pay_on_delivery_additional_percentage"
      );
      if (existingPayOnDelivery) {
        await updateSetting(
          "pay_on_delivery_additional_percentage",
          payOnDeliveryPercentage,
          token
        );
      } else {
        await createSetting(
          {
            key: "pay_on_delivery_additional_percentage",
            value: payOnDeliveryPercentage,
          },
          token
        );
      }

      setSnackbar({
        message: "Fiyatlandırma ayarları başarıyla güncellendi!",
        type: "success",
      });
    } catch (error) {
      console.error("Ayar güncelleme hatası:", error);
      setSnackbar({
        message: "Ayarlar güncellenirken bir hata oluştu.",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
        <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
          >
            <FaTimes />
          </button>
          <h3 className="text-2xl font-semibold text-black mb-6">
            Fiyatlandırma Ayarları
          </h3>

          {loading ? (
            <p>Yükleniyor...</p>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ek Hacim Ücreti (₺/Desi)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={extraVolumeCost}
                  onChange={(e) => setExtraVolumeCost(e.target.value)}
                  className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tanımlı hacim aralıklarının dışında kalan her desi için ek
                  ücret
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapıda Ödeme Ek Yüzde (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={payOnDeliveryPercentage}
                  onChange={(e) => setPayOnDeliveryPercentage(e.target.value)}
                  className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tanımlı tutar aralıklarının dışında kalan siparişler için ek
                  yüzde
                </p>
              </div>

              <div className="flex justify-end space-x-2">
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
                  Kaydet
                </button>
              </div>
            </div>
          )}
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
