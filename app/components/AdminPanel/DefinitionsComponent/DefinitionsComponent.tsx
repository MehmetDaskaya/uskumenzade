"use client";

import { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { ImageModal, CategoryModal } from "../../../components/";
import { TagModal } from "../../Modal/TagIdModal";
import { MetaTagModal } from "../../Modal/MetaTagModal";
import { DocumentModal } from "../../Modal/DocumentModal";
import { DeciCalculationModal } from "../../Modal/DeciCalculationModal";
import { DiscountModal } from "../../Modal/DiscountModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store"; // Adjust path if necessary
import {
  fetchDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  Discount,
} from "@/app/api/discount/discountApi";

export const DefinitionsComponent = () => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showMetaTagModal, setShowMetaTagModal] = useState(false);
  const [showDeciCalculationModal, setShowDeciCalculationModal] =
    useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken); // Get token from Redux

  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);

  const openDocumentModal = () => setShowDocumentModal(true);
  const closeDocumentModal = () => setShowDocumentModal(false);

  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  const openTagModal = () => setShowTagModal(true);
  const closeTagModal = () => setShowTagModal(false);

  const openMetaTagModal = () => setShowMetaTagModal(true);
  const closeMetaTagModal = () => setShowMetaTagModal(false);

  const openDeciCalculationModal = () => setShowDeciCalculationModal(true);
  const closeDeciCalculationModal = () => setShowDeciCalculationModal(false);

  const openDiscountModal = () => setShowDiscountModal(true);
  const closeDiscountModal = () => setShowDiscountModal(false);

  // Load discounts on component mount

  const loadDiscounts = useCallback(async () => {
    if (!accessToken) return;

    try {
      const fetchedDiscounts = await fetchDiscounts(accessToken);

      // Ensure eligible_items & eligible_users exist
      setDiscounts(
        fetchedDiscounts.map((discount) => ({
          ...discount,
          eligible_items: discount.eligible_items || [],
          eligible_users: discount.eligible_users || [],
        }))
      );
    } catch (error) {
      console.error("Failed to load discounts:", error);
    }
  }, [accessToken]); // ✅ Include accessToken as a dependency

  // Now include loadDiscounts safely in useEffect
  useEffect(() => {
    loadDiscounts();
  }, [loadDiscounts]);

  const handleSaveDiscount = async (newDiscount: Partial<Discount>) => {
    try {
      if (!accessToken) return;
      const createdDiscount = await createDiscount(newDiscount, accessToken);
      setDiscounts([...discounts, createdDiscount]);
    } catch (error) {
      console.error("Failed to create discount:", error);
    }
  };

  const handleUpdateDiscount = async (
    discountId: string,
    updatedDiscount: Partial<Discount>
  ) => {
    try {
      if (!accessToken) return;
      const updated = await updateDiscount(
        discountId,
        updatedDiscount,
        accessToken
      );
      setDiscounts(discounts.map((d) => (d.id === discountId ? updated : d)));
    } catch (error) {
      console.error("Failed to update discount:", error);
    }
  };
  const handleDeleteDiscount = async (discountId: string) => {
    try {
      if (!accessToken) return;
      await deleteDiscount(discountId, accessToken);
      setDiscounts(discounts.filter((d) => d.id !== discountId));
    } catch (error) {
      console.error("Failed to delete discount:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Images Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Görselleri Yönet</h3>
          <p className="text-gray-600 text-center mb-6">
            Görsel yükle, güncelle veya sil
          </p>
          <button
            onClick={openImageModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            Görsel Ekranını Aç
          </button>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Dokümanları Yönet</h3>
          <p className="text-gray-600 text-center mb-6">
            Doküman yükle, güncelle veya sil
          </p>
          <button
            onClick={openDocumentModal}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            Doküman Ekranını Aç
          </button>
        </div>

        {/* Manage Categories Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Kategorileri Yönet</h3>
          <p className="text-gray-600 text-center mb-6">
            Kategori ekle, güncelle veya sil
          </p>
          <button
            onClick={openCategoryModal}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            Kategori Ekranını Aç
          </button>
        </div>
        {/* Manage Deci Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Desi Hesaplama</h3>
          <p className="text-gray-600 text-center mb-6">
            Desi bilgilerini ekle, güncelle veya sil
          </p>
          <button
            onClick={openDeciCalculationModal}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            Desi Hesaplama Ekranını Aç
          </button>
        </div>

        {/* Manage Discounts Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">İndirimleri Yönet</h3>
          <p className="text-gray-600 text-center mb-6">
            İndirim ekle, güncelle veya sil
          </p>
          <button
            onClick={openDiscountModal}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            İndirim Ekranını Aç
          </button>
        </div>

        {/* Manage Tags Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Etiketleri Yönet</h3>
          <p className="text-gray-600 text-center mb-6">
            Etiket ekle, güncelle veya sil
          </p>
          <button
            onClick={openTagModal}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            Etiket Ekranını Aç
          </button>
        </div>

        {/* Manage Meta Tags Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Meta Etiketleri Yönet</h3>
          <p className="text-gray-600 text-center mb-6">
            Meta etiket ekle, güncelle veya sil
          </p>
          <button
            onClick={openMetaTagModal}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            Meta Etiket Ekranını Aç
          </button>
        </div>
      </div>

      {/* Modals */}
      {showImageModal && (
        <ImageModal
          isOpen={showImageModal}
          onClose={closeImageModal}
          onSelectImage={(imageId) => {
            console.log("Selected Image ID:", imageId);
            closeImageModal();
          }}
          type="blog"
        />
      )}

      {showDocumentModal &&
        accessToken && ( // Ensure token is available
          <DocumentModal
            isOpen={showDocumentModal}
            onClose={closeDocumentModal}
            token={accessToken} // Pass the token
            onSelectDocument={(documentId) => {
              console.log("Selected Document ID:", documentId);
              closeDocumentModal();
            }}
          />
        )}

      {showCategoryModal && (
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={closeCategoryModal}
          definitionPage={true}
          onCategorySelect={(categories) => {
            console.log("Selected Categories:", categories);
            closeCategoryModal();
          }}
        />
      )}

      {showDeciCalculationModal && (
        <DeciCalculationModal
          isOpen={showDeciCalculationModal}
          onClose={closeDeciCalculationModal}
          token={accessToken || ""} // Ensure token is always a string
        />
      )}

      {showDiscountModal && (
        <DiscountModal
          isOpen={showDiscountModal}
          onClose={closeDiscountModal}
          onSave={handleSaveDiscount}
          onUpdate={handleUpdateDiscount}
          onDelete={handleDeleteDiscount}
          discounts={discounts}
        />
      )}

      {showTagModal && (
        <TagModal
          isOpen={showTagModal}
          onClose={closeTagModal}
          definitionPage={true}
          onTagSelect={(tags) => {
            console.log("Selected Tags:", tags);
            closeTagModal();
          }}
        />
      )}

      {showMetaTagModal && (
        <MetaTagModal
          isOpen={showMetaTagModal}
          onClose={closeMetaTagModal}
          definitionPage={true}
          onMetaTagSelect={(metaTags) => {
            console.log("Selected Meta Tags:", metaTags);
            closeMetaTagModal();
          }}
        />
      )}
    </div>
  );
};

export default DefinitionsComponent;
