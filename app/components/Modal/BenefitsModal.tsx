"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchHealthBenefits,
  addHealthBenefit,
  editHealthBenefit,
  deleteHealthBenefitById,
} from "../../../redux/slices/benefitsSlice";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Snackbar } from "../../components";

interface BenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBenefitSelect: (benefits: Benefit[]) => void; // Ensure this is present
}

interface Benefit {
  id: string;
  item_id: string;
  benefit: string;
}

export function BenefitsModal({
  isOpen,
  onClose,
  onBenefitSelect,
}: BenefitsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const benefits = useSelector((state: RootState) => state.benefits.benefits);
  const [newBenefit, setNewBenefit] = useState("");
  const [editBenefitId, setEditBenefitId] = useState<string | null>(null);
  const [editBenefitName, setEditBenefitName] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<Benefit[]>([]);

  const handleSaveSelectedBenefits = () => {
    if (selectedBenefits.length > 0) {
      console.log("Selected Benefits:", selectedBenefits);
      onBenefitSelect(selectedBenefits); // Pass selected benefits to parent
      onClose();
    } else {
      console.error("No benefits selected to save.");
    }
  };

  const handleSelectBenefit = (benefit: Benefit) => {
    if (!selectedBenefits.some((b) => b.id === benefit.id)) {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const handleDeselectBenefit = (id: string) => {
    setSelectedBenefits(
      selectedBenefits.filter((benefit) => benefit.id !== id)
    );
  };

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const benefits = await dispatch(
          fetchHealthBenefits({ offset: 0, limit: 1000 })
        ).unwrap();
        console.log("Available benefits from backend:", benefits);
      } catch (error) {
        console.error("Error fetching benefits:", error);
      }
    };

    fetchBenefits();
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchHealthBenefits({ offset: 0, limit: 1000 }));
    }
  }, [isOpen, dispatch]);

  const handleAddBenefit = async () => {
    if (!newBenefit.trim()) {
      showSnackbar("Fayda açıklaması boş olamaz.", "error");
      return;
    }

    try {
      await dispatch(
        addHealthBenefit({ item_id: "", benefit: newBenefit.trim() })
      ).unwrap();
      setNewBenefit("");
      showSnackbar("Fayda başarıyla eklendi!", "success");
    } catch (error) {
      console.error("Error adding benefit:", error);
      showSnackbar("Fayda eklenirken bir hata oluştu.", "error");
    }
  };

  const handleUpdateBenefit = async () => {
    if (!editBenefitName.trim() || !editBenefitId) return;

    try {
      await dispatch(
        editHealthBenefit({
          id: editBenefitId,
          benefitData: { item_id: "", benefit: editBenefitName.trim() },
        })
      ).unwrap();
      setEditBenefitId(null);
      setEditBenefitName("");
      showSnackbar("Fayda başarıyla güncellendi!", "success");
    } catch (error) {
      console.error("Error updating benefit:", error);
      showSnackbar("Fayda güncellenirken bir hata oluştu.", "error");
    }
  };

  const handleDeleteBenefit = async (id: string) => {
    try {
      await dispatch(deleteHealthBenefitById(id)).unwrap();
      showSnackbar("Fayda başarıyla silindi!", "success");
    } catch (error) {
      console.error("Error deleting benefit:", error);
      showSnackbar("Fayda silinirken bir hata oluştu.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl text-black font-semibold mb-6">
          Fayda Yönetimi
        </h3>

        <div className="mb-6">
          <label
            htmlFor="benefit-input"
            className="block text-sm font-medium text-gray-700"
          >
            Yeni Fayda
          </label>
          <div className="flex items-center">
            <input
              id="benefit-input"
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              className="flex-1 bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddBenefit}
              className="ml-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Ekle
            </button>
          </div>
        </div>
        <div className="flex flex-row">
          {/* Defined Benefits Section */}
          <div className="flex-1 mx-1">
            <h4 className="text-xl text-black font-semibold mb-4">
              Tanımlanmış Faydalar
            </h4>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li
                  key={benefit.id}
                  className={`flex items-center justify-between border p-3 rounded-lg shadow-sm cursor-pointer ${
                    selectedBenefits.some((b) => b.id === benefit.id)
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleSelectBenefit(benefit)}
                >
                  {editBenefitId === benefit.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editBenefitName}
                        onChange={(e) => setEditBenefitName(e.target.value)}
                        className="flex-1 bg-white text-black p-2 border rounded-lg"
                      />
                      <button
                        onClick={handleUpdateBenefit}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditBenefitId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-800">{benefit.benefit}</span>
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditBenefitId(benefit.id);
                        setEditBenefitName(benefit.benefit);
                      }}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBenefit(benefit.id);
                      }}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-300 mx-2"></div>

          {/* Selected Benefits Section */}
          <div className="flex-1 mx-1">
            <h4 className="text-xl text-black font-semibold mb-4">
              Seçilen Faydalar
            </h4>
            <ul className="space-y-4">
              {selectedBenefits.map((benefit) => (
                <li
                  key={benefit.id}
                  className="flex items-center justify-between border p-3 rounded-lg shadow-sm bg-green-100"
                >
                  <span className="text-gray-800">{benefit.benefit}</span>
                  <button
                    onClick={() => handleDeselectBenefit(benefit.id)}
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
            onClick={handleSaveSelectedBenefits}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Kaydet
          </button>
        </div>

        {snackbar && (
          <Snackbar
            message={snackbar.message}
            type={snackbar.type}
            onClose={() => setSnackbar(null)}
          />
        )}
      </div>
    </div>
  );
}
