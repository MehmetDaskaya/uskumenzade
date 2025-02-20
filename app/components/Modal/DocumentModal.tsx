"use client";

import React, { useState, useEffect } from "react";
import {
  fetchDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
} from "@/app/api/document/documentApi";
import { Snackbar } from "../../components/index";
import { FiTrash2, FiEdit2, FiX } from "react-icons/fi";

interface Document {
  id: string;
  name: string;
  type: string;
  created_at: string;
  url: string; // Add this line
}

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSelectDocument: (documentId: string) => void; // Add this line
}

export function DocumentModal({
  isOpen,
  onClose,
  token,
  onSelectDocument,
}: DocumentModalProps) {
  const [documents, setDocuments] = useState<Document[] | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDocumentId, setEditDocumentId] = useState<string | null>(null);
  const [editDocumentName, setEditDocumentName] = useState("");
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [documentName, setDocumentName] = useState("");
  const [customDocumentName, setCustomDocumentName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const predefinedOptions = [
    "KVKK",
    "Kullanıcı Sözleşmesi",
    "Satış Sözleşmesi",
    "Özel Ad Gir",
  ];

  const translateErrorToTurkish = (message: string): string => {
    const translations: Record<string, string> = {
      "Only PDF files are allowed.": "Yalnızca PDF dosyalarına izin verilir.",
      "File size exceeds the allowed limit.":
        "Dosya boyutu izin verilen sınırı aşıyor.",
      "Invalid file format.": "Geçersiz dosya formatı.",
      "Unauthorized request.": "Yetkisiz istek.",
      "Server error. Please try again later.":
        "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
    };

    return translations[message] || "Bilinmeyen hata oluştu.";
  };

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await fetchDocuments(0, 100, token); // Fetch documents
        if (Array.isArray(data)) {
          setDocuments(data); // Ensure the response is correctly set
        } else if (data.results && Array.isArray(data.results)) {
          setDocuments(data.results); // Handle nested results if applicable
        } else {
          setDocuments([]); // Default to empty if no documents found
        }
      } catch (error) {
        console.error("Error loading documents:", error);
        showSnackbar("Belgeler yüklenirken bir hata oluştu.", "error");
      }
    };

    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen, token]);

  const handleUpload = async () => {
    if (!file || !documentName) {
      showSnackbar("Lütfen bir dosya seçin ve belge adını girin.", "error");
      return;
    }

    // Check if a document with the same name already exists
    const existingDocument = documents?.find(
      (doc) => doc.name === documentName
    );
    if (existingDocument) {
      showSnackbar("Bu isimde bir belge zaten mevcut.", "error");
      return;
    }

    try {
      const newDocument = await uploadDocument(file, documentName, token);
      setDocuments((prev) => (prev ? [...prev, newDocument] : [newDocument]));

      showSnackbar("Belge başarıyla yüklendi!", "success");
      setFile(null);
      setDocumentName("");
      setCustomDocumentName("");
      setSelectedOption("");
    } catch (error) {
      console.error("Error uploading document:", error);

      if (error instanceof Error && error.message) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.detail) {
            const translatedMessage = translateErrorToTurkish(errorData.detail);
            showSnackbar(translatedMessage, "error");
            return;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
      }

      showSnackbar("Belge yüklenirken bir hata oluştu.", "error");
    }
  };

  const handleEditDocument = async () => {
    if (!editDocumentId || !editDocumentName) {
      showSnackbar("Lütfen geçerli bir belge adı girin.", "error");
      return;
    }

    try {
      const updatedDocument = await updateDocument(
        editDocumentId,
        editDocumentName,
        token
      );
      setDocuments((prev) =>
        prev
          ? prev.map((doc) =>
              doc.id === updatedDocument.id ? updatedDocument : doc
            )
          : []
      );

      showSnackbar("Belge başarıyla güncellendi!", "success");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating document:", error);
      showSnackbar("Belge güncellenirken bir hata oluştu.", "error");
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId, token);
      setDocuments((prev) =>
        prev ? prev.filter((doc) => doc.id !== documentId) : []
      );

      showSnackbar("Belge başarıyla silindi!", "success");
    } catch (error) {
      console.error("Error deleting document:", error);
      showSnackbar("Belge silinirken bir hata oluştu.", "error");
    }
  };

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg">
        {/* Close Button (Top Right Corner) */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Belge Yönetimi</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Document Upload Section */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold">Belge Yükle (PDF)</h4>
          <div className="space-y-4 mt-3">
            <label
              htmlFor="file-upload"
              className="block w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              {file ? (
                <span className="text-sm text-gray-700 truncate max-w-[80%]">
                  {file.name}
                </span>
              ) : (
                <span className="text-sm">
                  Belge yüklemek için tıklayın veya buraya sürükleyin. (PDF)
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
            <h4 className="text-lg font-semibold">Belge İsmi</h4>
            <select
              value={selectedOption}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedOption(value);
                if (value === "Özel Ad Gir") {
                  setDocumentName(""); // Clear predefined selection
                } else {
                  setDocumentName(value); // Set the document name directly
                  setCustomDocumentName(""); // Clear the custom input
                }
              }}
              className="block bg-white text-black w-full p-2 border rounded-lg"
            >
              <option className="!text-gray-100" value="" disabled hidden>
                Belge Adını Seçin
              </option>
              {predefinedOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {selectedOption === "Özel Ad Gir" && (
              <input
                type="text"
                placeholder="Belge Adını Girin"
                value={customDocumentName}
                onChange={(e) => {
                  setCustomDocumentName(e.target.value);
                  setDocumentName(e.target.value); // Ensure it's updated
                }}
                className="block bg-white text-black w-full p-2 border rounded-lg mt-2"
              />
            )}

            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Belge Yükle
            </button>
          </div>
        </div>

        {/* Document List Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Yüklenmiş Belgeler</h4>
          <div className="h-64 overflow-y-auto border rounded-lg p-2">
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0"
                  onClick={() => onSelectDocument(doc.id)} // Trigger onSelectDocument on click
                >
                  <div className="flex-1">
                    <p className="font-semibold truncate w-48">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      Yüklendi: {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the onSelectDocument
                        setEditDocumentId(doc.id);
                        setEditDocumentName(doc.name);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the onSelectDocument
                        handleDeleteDocument(doc.id);
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Henüz belge yok.</p>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h3 className="text-xl font-semibold mb-4">Belgeyi Düzenle</h3>

              {/* PDF Viewer */}
              {editDocumentId && (
                <iframe
                  src={documents?.find((doc) => doc.id === editDocumentId)?.url}
                  className="w-full h-64 border rounded-lg mb-4"
                ></iframe>
              )}

              {/* File Upload */}
              <input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className="block w-full border p-2 rounded-lg mb-4"
              />

              {/* Document Name Input */}
              <input
                type="text"
                value={editDocumentName}
                onChange={(e) => setEditDocumentName(e.target.value)}
                className="w-full bg-white text-black p-2 border rounded-lg mb-4"
              />

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditModalOpen(false)} // Close only the edit modal ✅
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Kapat
                </button>
                <button
                  onClick={handleEditDocument}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar */}
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
