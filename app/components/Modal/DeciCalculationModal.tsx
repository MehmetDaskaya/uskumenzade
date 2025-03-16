import React, { useEffect, useState } from "react";
import {
  fetchShipmentCost,
  updateShipmentCost,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch existing shipment cost when modal opens
  useEffect(() => {
    if (isOpen) {
      loadShipmentCost();
    }
  }, [isOpen]);

  const loadShipmentCost = async () => {
    setLoading(true);
    try {
      const cost = await fetchShipmentCost();
      setShipmentCost(cost.toString());
    } catch (error) {
      console.error(
        "Kargo ücreti ayarı bulunamadı, varsayılan olarak 0 atandı.",
        error
      );
      setShipmentCost("0"); // Default value if setting is missing
    }
    setLoading(false);
  };

  const handleUpdateShipmentCost = async () => {
    if (!shipmentCost.trim() || isNaN(parseFloat(shipmentCost))) {
      setSnackbar({ message: "Geçerli bir sayı girin.", type: "error" });
      return;
    }

    try {
      await updateShipmentCost(shipmentCost, token);
      setSnackbar({
        message: "Kargo ücreti başarıyla güncellendi!",
        type: "success",
      });
    } catch {
      setSnackbar({
        message: "Kargo ücreti güncellenirken hata oluştu.",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl text-black font-semibold mb-6">
          Kargo Ücreti Güncelleme
        </h3>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <div className="mb-6">
            <label
              htmlFor="shipment-cost-input"
              className="block text-sm font-medium text-gray-700"
            >
              Güncel Kargo Ücreti (₺/Desi)
            </label>
            <input
              id="shipment-cost-input"
              type="text"
              value={shipmentCost}
              onChange={(e) => setShipmentCost(e.target.value)}
              className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: 3.14"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white mx-1 px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Kapat
          </button>
          <button
            onClick={handleUpdateShipmentCost}
            className="bg-blue-500 text-white mx-1 px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Güncelle
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
