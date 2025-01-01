"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ImageModal, CategoryModal } from "../../../components/";
import { TagModal } from "../../Modal/TagIdModal";
import { MetaTagModal } from "../../Modal/MetaTagModal";

export const DefinitionsComponent = () => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showMetaTagModal, setShowMetaTagModal] = useState(false);

  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);

  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  const openTagModal = () => setShowTagModal(true);
  const closeTagModal = () => setShowTagModal(false);

  const openMetaTagModal = () => setShowMetaTagModal(true);
  const closeMetaTagModal = () => setShowMetaTagModal(false);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Tanımlar</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Images Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
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

        {/* Manage Categories Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Kategorileri Yönet</h3>
          <p className="text-gray-600 text-center mb-6">
            Kategori ekle, güncelle veya sil
          </p>
          <button
            onClick={openCategoryModal}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            Kategori Ekranını Aç
          </button>
        </div>

        {/* Manage Tags Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Etiketleri Yönet</h3>
          <p className="text-gray-600 text-center mb-6">
            Etiket ekle, güncelle veya sil
          </p>
          <button
            onClick={openTagModal}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            <FaPlus className="inline mr-2" />
            Etiket Ekranını Aç
          </button>
        </div>

        {/* Manage Meta Tags Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
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

      {showCategoryModal && (
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={closeCategoryModal}
          onCategorySelect={(categories) => {
            console.log("Selected Categories:", categories);
            closeCategoryModal();
          }}
        />
      )}

      {showTagModal && (
        <TagModal
          isOpen={showTagModal}
          onClose={closeTagModal}
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
