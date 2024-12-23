"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { addImage, loadImages } from "../../../redux/slices/imageSlice";
import { updateImageApi, deleteImageApi } from "@/app/api/image/imageApi";
import { Snackbar } from "../../components/index";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string; // e.g., "blog" or "product"
  onSelectImage?: (imageId: string) => void; // For selecting an image
}

const typeMapping: Record<string, string> = {
  gallery: "Galeri",
  thumbnail: "Blog Görseli",
  banner: "Banner Görseli",
  product: "Ürün Görseli",
};

export function ImageModal({
  isOpen,
  onClose,
  type,
  onSelectImage, // New prop for selecting the image
}: ImageModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const images = useSelector((state: RootState) => state.image.images);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [file, setFile] = useState<File | null>(null);
  const [alt_text, setalt_text] = useState("");
  const [imageType, setImageType] = useState<string>("gallery");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editImageId, setEditImageId] = useState<string | null>(null);
  const [editAltText, setEditAltText] = useState("");
  const [editImageType, setEditImageType] = useState<string>("gallery");
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState<"type" | "date" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [deletePopupVisible, setDeletePopupVisible] = useState<string | null>(
    null
  );

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(loadImages(type));
    }
  }, [isOpen, type, dispatch]);

  const handleUpdateImage = async () => {
    if (!editImageId) return;

    if (!accessToken) {
      showSnackbar("You are not authorized. Please log in.", "error");
      return;
    }

    try {
      await updateImageApi(
        editImageId,
        editAltText,
        editImageType,
        accessToken
      );
      showSnackbar("Görsel bilgisi başarıyla güncellendi.", "success");
      setIsEditModalOpen(false);
      dispatch(loadImages(type));
    } catch (error) {
      console.error(":", error);
      showSnackbar(
        "Görsel bilgisi güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
        "error"
      );
    }
  };

  const handleUpload = async () => {
    if (!accessToken) {
      showSnackbar("You are not authorized. Please log in.", "error");
      return;
    }

    if (!file || !alt_text) {
      showSnackbar("Please select a file and provide alt text.", "error");
      return;
    }

    try {
      await dispatch(
        addImage({ file, alt_text, type: imageType, token: accessToken })
      ).unwrap();
      showSnackbar("Görsel başarıyla yüklendi!", "success");
      setFile(null);
      setalt_text("");
      dispatch(loadImages(type));
    } catch (error) {
      console.error("Error uploading image:", error);
      showSnackbar(
        "Görsel yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        "error"
      );
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!accessToken) {
      showSnackbar("Yetkiniz yok. Lütfen giriş yapın.", "error");
      return;
    }

    try {
      await deleteImageApi(imageId, accessToken); // Pass the token to deleteImageApi
      showSnackbar("Görsel başarıyla silindi!", "success");
      dispatch(loadImages(type));
      setDeletePopupVisible(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      showSnackbar(
        "Görsel silinirken bir hata oluştu. Lütfen tekrar deneyin.",
        "error"
      );
    }
  };

  const handleEditImage = (
    imageId: string,
    altText: string,
    imageType: string
  ) => {
    setEditImageId(imageId);
    setEditAltText(altText);
    setEditImageType(imageType);
    setIsEditModalOpen(true);
  };

  // Filter and sort logic
  const filteredImages = images
    .filter((image) => {
      const userFriendlyType =
        typeMapping[image.image_type] || image.image_type;
      return (
        image.alt_text.toLowerCase().includes(filter.toLowerCase()) ||
        userFriendlyType.toLowerCase().includes(filter.toLowerCase()) // Filter by user-friendly type
      );
    })
    .sort((a, b) => {
      if (!sortOption) return 0; // No sorting
      if (sortOption === "type") {
        const userFriendlyTypeA = typeMapping[a.image_type] || a.image_type;
        const userFriendlyTypeB = typeMapping[b.image_type] || b.image_type;
        return userFriendlyTypeA.localeCompare(userFriendlyTypeB);
      }
      if (sortOption === "date") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      return 0;
    });

  const handleSelectImage = (imageId: string) => {
    if (onSelectImage) {
      onSelectImage(imageId); // Send selected image ID to parent
    }
    onClose(); // Close the modal after selection
  };

  // Calculate pagination
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg overflow-y-auto">
        <h3 className="text-2xl text-black font-semibold mb-6">
          Resim Yönetimi
        </h3>

        <div className="flex">
          {/* Image Grid Section */}
          <div className="w-2/3 pr-4 border-r border-gray-300 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                placeholder="Alt Text veya Tip Adı ile Filtreleyebilirsiniz."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-white text-black p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setSortOption("type")}
                  className={`flex items-center p-2 border rounded-lg shadow-sm hover:bg-blue-100 transition ${
                    sortOption === "type"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                  title="Sort by Type"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-5 h-5 mr-1 ${
                      sortOption === "type" ? "text-white" : "text-black"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.88 3H7.12L3 12l4.12 9h9.76L21 12l-4.12-9z"
                    />
                  </svg>
                  Tip
                </button>
                <button
                  onClick={() => setSortOption("date")}
                  className={`flex items-center p-2 border rounded-lg shadow-sm hover:bg-blue-100 transition ${
                    sortOption === "date"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                  title="Tarihe göre sırala"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-5 h-5 mr-1 ${
                      sortOption === "date" ? "text-white" : "text-black"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15H5.25a2.25 2.25 0 01-2.25-2.25v-1.5A2.25 2.25 0 015.25 9h3M8.25 12h7.5m-7.5 0v3.75a3.75 3.75 0 007.5 0V12m0 0V8.25a3.75 3.75 0 10-7.5 0V12"
                    />
                  </svg>
                  Tarih
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentImages.length > 0 ? (
                currentImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group border rounded-lg shadow-sm overflow-hidden flex flex-col"
                  >
                    {deletePopupVisible === image.id ? (
                      <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
                        <p className="text-xs text-gray-700 mb-3">
                          Silmek istediğinize emin misiniz?
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setDeletePopupVisible(null)}
                            className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            İptal
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={() => handleSelectImage(image.id)}
                          className="relative group border rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer hover:border-blue-500"
                        >
                          <img
                            src={image.url}
                            alt={image.alt_text || "Image"}
                            className="object-cover h-48 w-full"
                          />
                        </div>

                        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center space-x-4">
                          <div className="flex flex-row">
                            <button
                              onClick={() =>
                                handleEditImage(
                                  String(image.id),
                                  image.alt_text || "",
                                  String(image.image_type) || "gallery"
                                )
                              }
                              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                            >
                              <FiEdit2 size={20} />
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => setDeletePopupVisible(image.id)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                              >
                                <FiTrash2 size={20} />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSelectImage(image.id)}
                            className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600"
                          >
                            Görseli Seç
                          </button>
                        </div>

                        <div className="p-4 text-gray-600">
                          <p className="font-semibold truncate">
                            {image.alt_text || "No Alt Text"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tip:{" "}
                            <span className="font-medium">
                              {{
                                gallery: "Galeri",
                                thumbnail: "Blog Görseli",
                                banner: "Banner Görseli",
                                product: "Ürün Görseli",
                              }[image.image_type] || "Bilinmeyen"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Oluşturuldu:{" "}
                            <span className="font-medium">
                              {new Date(image.created_at).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  Yüklenmiş resim bulunamadı.
                </p>
              )}
            </div>

            {/* Pagination Controls */}
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Previous Page"
              >
                {/* Left Arrow Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <p className="text-gray-700 font-medium">
                Sayfa {currentPage} / {totalPages}
              </p>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                title="Next Page"
              >
                {/* Right Arrow Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5L15.75 12l-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Upload Section */}
          <div className="w-1/3 pl-4">
            <h4 className="text-xl text-black font-semibold mb-4">
              Resim Yükle
            </h4>
            <div className="space-y-4">
              <label
                htmlFor="file-upload"
                className="block w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                {file ? (
                  <span className="text-sm text-gray-700">{file.name}</span>
                ) : (
                  <span className="text-sm px-4">
                    Resim yüklemek için tıklayın veya resmi buraya sürükleyin.
                    (Maksimum 2MB)
                  </span>
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className="hidden"
              />
              <label
                htmlFor="alt-text"
                className="block text-sm font-medium text-gray-700"
              >
                Alt Text
              </label>
              <input
                id="alt-text"
                type="text"
                placeholder="Alt Text"
                value={alt_text}
                onChange={(e) => setalt_text(e.target.value)}
                className="block w-full bg-white text-black p-2 border rounded-lg"
              />

              <label
                htmlFor="image-type"
                className="block text-sm font-medium text-gray-700 mt-4"
              >
                Görsel Tipi
              </label>
              <select
                id="image-type"
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                className="block w-full bg-white p-2 border rounded-lg text-black"
              >
                <option value="gallery" className="text-black">
                  Galeri
                </option>
                <option value="thumbnail" className="text-black">
                  Blog Görseli
                </option>
                <option value="banner" className="text-black">
                  Banner Görseli
                </option>
                <option value="product" className="text-black">
                  Ürün Görseli
                </option>
              </select>

              <button
                onClick={handleUpload}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
              >
                Seçilen Görseli Yükle
              </button>
            </div>
            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <h3 className="text-xl text-black font-semibold mb-4">
                Görseli Düzenle
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  placeholder="Alt Text"
                  className="w-full bg-white text-black p-2 border rounded-lg"
                />
                <select
                  value={editImageType}
                  onChange={(e) => setEditImageType(e.target.value)}
                  className="block w-full bg-white p-2 border rounded-lg text-black"
                >
                  <option value="gallery" className="text-black">
                    Galeri
                  </option>
                  <option value="thumbnail" className="text-black">
                    Blog Görseli
                  </option>
                  <option value="banner" className="text-black">
                    Banner Görseli
                  </option>
                  <option value="product" className="text-black">
                    Ürün Görseli
                  </option>
                </select>

                <button
                  onClick={handleUpdateImage}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  Görseli Güncelle
                </button>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </div>
        )}
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
