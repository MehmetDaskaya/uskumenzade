import React, { useEffect, useState } from "react";
import {
  fetchShipmentCost,
  updateShipmentCost,
  fetchSettingByKey,
  fetchMinOrderValue,
  fetchFreeShipmentThreshold,
  updateSetting,
  createSetting,
} from "../../api/setting/settingApi";
import { Snackbar } from "../index";

interface ShipmentCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export function DeciCalculationModal({
  isOpen,
  onClose,
  token,
}: ShipmentCostModalProps) {
  const [shipmentCost, setShipmentCost] = useState<string>("");
  const [minOrderValue, setMinOrderValue] = useState<string>("");
  const [freeShipmentThreshold, setFreeShipmentThreshold] =
    useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
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
      const cost = await fetchShipmentCost();
      const minOrder = await fetchMinOrderValue();
      const freeThreshold = await fetchFreeShipmentThreshold();

      setShipmentCost(cost.toString());
      setMinOrderValue(minOrder.toString());
      setFreeShipmentThreshold(freeThreshold.toString());
    } catch (error) {
      console.error("Ayarlar yüklenirken hata oluştu:", error);
      setShipmentCost("0");
      setMinOrderValue("");
      setFreeShipmentThreshold("");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const parsedShipment = parseFloat(shipmentCost);
    const parsedMinOrder = parseFloat(minOrderValue);
    const parsedFreeThreshold = parseFloat(freeShipmentThreshold);

    if (
      isNaN(parsedShipment) ||
      isNaN(parsedMinOrder) ||
      isNaN(parsedFreeThreshold)
    ) {
      setSnackbar({
        message: "Geçerli bir sayı girin.",
        type: "error",
      });
      return;
    }

    try {
      await updateShipmentCost(shipmentCost, token);

      const existingMinOrder = await fetchSettingByKey("min_order");
      const existingFreeThreshold = await fetchSettingByKey(
        "free_shipment_threshold"
      );

      if (existingMinOrder) {
        await updateSetting("min_order", minOrderValue, token);
      } else {
        await createSetting({ key: "min_order", value: minOrderValue }, token);
      }

      if (existingFreeThreshold) {
        await updateSetting(
          "free_shipment_threshold",
          freeShipmentThreshold,
          token
        );
      } else {
        await createSetting(
          { key: "free_shipment_threshold", value: freeShipmentThreshold },
          token
        );
      }

      setSnackbar({
        message: "Ayarlar başarıyla güncellendi!",
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl text-black font-semibold mb-6">
          Kargo ve Sipariş Ayarları
        </h3>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Kargo Ücreti (₺ / Desi)
              </label>
              <input
                type="text"
                value={shipmentCost}
                onChange={(e) => setShipmentCost(e.target.value)}
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Minimum Sepet Tutarı (₺)
              </label>
              <input
                type="text"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Ücretsiz Kargo Alt Limiti (₺)
              </label>
              <input
                type="text"
                value={freeShipmentThreshold}
                onChange={(e) => setFreeShipmentThreshold(e.target.value)}
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm"
              />
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white mx-1 px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Kapat
          </button>
          <button
            onClick={handleSave}
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
