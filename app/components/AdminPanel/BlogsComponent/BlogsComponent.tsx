"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  fetchBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  fetchBlogById,
} from "../../../api/blog/blogApi";
import { ImageModal } from "../../index";
import { CategoryModal } from "../../Modal/CategoryModal";
import { TagModal } from "../../Modal/TagIdModal";
import { MetaTagModal } from "../../Modal/MetaTagModal";

interface Category {
  id: string;
  name: string;
}

export const BlogsComponent = () => {
  const images = useSelector((state: RootState) => state.image.images);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showMetaTagModal, setShowMetaTagModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMetaTags, setSelectedMetaTags] = useState<string[]>([]);

  const openTagModal = () => setShowTagModal(true);
  const closeTagModal = () => setShowTagModal(false);

  const openMetaTagModal = () => setShowMetaTagModal(true);
  const closeMetaTagModal = () => setShowMetaTagModal(false);

  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  interface Section {
    id?: string; // Make ID optional
    content: string;
    order: number;
    section_type: string;
    heading: string;
    body: string;
  }

  interface Image {
    id: string;
    url: string;
    alt_text: string;
  }

  interface Blog {
    id: string;
    title: string;
    author: string;
    category: string;
    content: string;
    related_item_ids: string[];
    tags: string[];
    images: Image[];
    sections: Section[];
    created_at: string;
    updated_at: string;
    excerpt?: string;
    readTime?: string;
    relatedProducts?: string[];
  }

  const [newBlogData, setNewBlogData] = useState<{
    id?: string;
    title: string;
    author: string;
    category: string;
    content: string;
    related_item_ids: string[];
    publishedDate: string;
    excerpt: string;
    contentSections: Section[];
    tags: string;
    imageUrl: string;
    readTime: string;
    relatedProducts: string;
  }>({
    id: undefined,
    title: "",
    author: "",
    category: "",
    content: "",
    related_item_ids: [],
    publishedDate: "",
    excerpt: "",
    contentSections: [
      {
        id: undefined,
        content: "\n",
        order: 0,
        section_type: "body",
        heading: "",
        body: "",
      },
    ],
    tags: "",
    imageUrl: "",
    readTime: "",
    relatedProducts: "",
  });

  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<() => void>(
    () => {}
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const fetchedBlogs = await fetchBlogs();
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    getBlogs();
  }, []);

  // Function to add a new blog
  // Function to add a new blog
  const handleAddBlogSubmit = async () => {
    try {
      // Prepare the payload
      const newBlogPayload = {
        title: newBlogData.title || "",
        author: newBlogData.author || "",
        category_id:
          selectedCategories.length > 0 ? selectedCategories[0].id : null, // Map category_id
        content: newBlogData.content || "No content provided",
        related_item_ids: newBlogData.related_item_ids || [],
        image_ids: selectedImageId ? [selectedImageId] : [],
        tag_ids: selectedTags.length > 0 ? selectedTags : [], // Ensure selected tags are passed
        meta_tag_ids: selectedMetaTags.length > 0 ? selectedMetaTags : [], // Ensure selected meta tags are passed
        description: newBlogData.excerpt || "Default Description", // Map description
        read_time: newBlogData.readTime || "1", // Default to "1 minute" if not provided
        sections: newBlogData.contentSections.map((section, index) => ({
          order: index,
          section_type: section.section_type || "body", // Use section_type or default to "body"
          content: `${section.heading}\n\n${section.body}`, // Combine heading and body
        })),
      };

      // Send payload to the API
      const addedBlog = await addBlog(newBlogPayload);

      // Optional: Fetch updated blog data
      const updatedBlog = await fetchBlogById(addedBlog.id);
      setBlogs([...blogs, updatedBlog]);

      resetBlogData();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  const handleEditBlogSubmit = async () => {
    if (!currentBlog) return;

    try {
      const updatedBlogPayload = {
        title: newBlogData.title || currentBlog.title,
        author: newBlogData.author || currentBlog.author,
        category_id:
          selectedCategories.length > 0 ? selectedCategories[0].id : null, // Use category_id
        content: newBlogData.content || "No content provided",
        related_item_ids: newBlogData.related_item_ids || [],
        image_ids: selectedImageId
          ? [selectedImageId]
          : currentBlog.images.map((img) => img.id),
        tag_ids: selectedTags.length > 0 ? selectedTags : [],
        meta_tag_ids: selectedMetaTags.length > 0 ? selectedMetaTags : [],
        description: newBlogData.excerpt || "Default description", // Ensure description is sent
        read_time: newBlogData.readTime || "1", // Default to "1 minute" if not provided
        sections: newBlogData.contentSections.map((section, index) => ({
          id: section.id,
          order: index,
          section_type: section.section_type || "body",
          content: `${section.heading}\n\n${section.body}`,
        })),
      };

      // Send the payload to the API
      const editedBlog = await updateBlog(currentBlog.id, updatedBlogPayload);

      // Update the local blog list
      setBlogs(
        blogs.map((blog) => (blog.id === currentBlog.id ? editedBlog : blog))
      );
      setShowEditModal(false);
      resetBlogData();
      setSelectedCategories([]);
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const resetBlogData = () => {
    setNewBlogData({
      title: "",
      author: "",
      category: "",
      content: "",
      related_item_ids: [],
      publishedDate: "",
      excerpt: "",
      contentSections: [
        {
          id: undefined,
          content: "", // Initialize with an empty heading and body joined by "\n"
          order: 0,
          section_type: "", // Default type, adjust as needed
          heading: "",
          body: "",
        },
      ],
      tags: "",
      imageUrl: "",
      readTime: "",
      relatedProducts: "",
    });
    setSelectedImageId(null); // Reset selected image ID
  };

  // Function to show the Snackbar
  const triggerSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  };

  const confirmDeleteBlog = (blog: Blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!blogToDelete) return;

    try {
      await deleteBlog(blogToDelete.id);
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      setShowDeleteModal(false);
      triggerSnackbar("Blog deleted successfully.");
    } catch (error) {
      console.error("Error deleting blog:", error);
      triggerSnackbar("Failed to delete blog.");
    }
  };

  // Handle search query input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEditBlog = (blog: Blog) => {
    setCurrentBlog(blog);

    setNewBlogData({
      id: blog.id, // `id` is now correctly typed as `string | undefined`
      title: blog.title,
      author: blog.author,
      category: blog.category,
      content: blog.content || "",
      related_item_ids: blog.related_item_ids || [],
      publishedDate: blog.created_at.split("T")[0], // Use created_at date for initial value
      excerpt: blog.excerpt || "",
      contentSections: blog.sections.map((section: Section) => {
        const [heading, ...bodyParts] = section.content.split("\n\n"); // Split the content into heading and body
        return {
          id: section.id, // Keep `id` from the section
          content: section.content, // Preserve the full content
          order: section.order, // Include the order
          section_type: section.section_type, // Include the section type
          heading: heading || "",
          body: bodyParts.join("\n\n") || "", // Join the remaining parts as body
        };
      }),
      tags: (blog.tags || []).join(", "), // Join tags into a string
      imageUrl: blog.images[0]?.url || "",
      readTime: blog.readTime || "",
      relatedProducts: (blog.relatedProducts || []).join(", "), // Join related products
    });

    setShowEditModal(true);
  };

  // Manage content sections dynamically
  // Updated Content Sections Dynamic Management
  const handleContentSectionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedSections = newBlogData.contentSections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    );
    setNewBlogData({ ...newBlogData, contentSections: updatedSections });
  };

  const addContentSection = () => {
    setNewBlogData({
      ...newBlogData,
      contentSections: [
        ...newBlogData.contentSections,
        {
          id: undefined, // Optional since it may not exist for new sections
          heading: "",
          body: "",
          content: "", // Initialize content
          order: newBlogData.contentSections.length, // Set order based on the current length
          section_type: "body", // Default section type
        },
      ],
    });
  };

  const removeContentSection = (index: number) => {
    const updatedSections = newBlogData.contentSections.filter(
      (_, i) => i !== index
    );
    setNewBlogData({ ...newBlogData, contentSections: updatedSections });
  };

  const handleCategorySelect = (categories: Category[]) => {
    setSelectedCategories(categories); // Save selected categories
    setNewBlogData((prevState) => ({
      ...prevState,
      tag_ids: categories.map((category) => category.id), // Map category IDs to tag_ids
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {showSnackbar && (
        <div
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg"
          style={{ zIndex: 9999 }}
        >
          {snackbarMessage}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Blog Yönetimi</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Blogları başlık, yazar veya kategori olarak arayın..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>

      {/* Blog Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">ID</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Başlık
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">Yazar</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Kategori
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Yayınlanma Tarihi
            </th>
            <th className="p-4 text-center font-semibold text-gray-600">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog) => (
              <tr key={blog.id} className="border-t">
                <td className="p-4 text-gray-600">{blog.id}</td>
                <td className="p-4 text-gray-600">{blog.title}</td>
                <td className="p-4 text-gray-600">{blog.author}</td>
                <td className="p-4 text-gray-600">{blog.category}</td>
                <td className="p-4 text-gray-600">{blog.created_at}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="mr-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    <FaEdit />
                  </button>

                  {showDeleteModal && (
                    <div
                      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      <div
                        className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                      >
                        <h2 className="text-xl text-black font-semibold mb-4">
                          Silme işlemini onayla
                        </h2>
                        <p className="text-gray-800">
                          Bu blog yazısını silmek istediğinizden emin misiniz?
                        </p>
                        <div className="mt-6 flex justify-end space-x-4">
                          <button
                            onClick={() => setShowDeleteModal(false)} // Cancel delete
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                          >
                            İptal
                          </button>
                          <button
                            onClick={handleDeleteConfirmed} // Confirm delete
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      confirmDeleteBlog({
                        ...blog,
                        content: blog.content ?? "Default Content", // Varsayılan içerik
                        related_item_ids: blog.related_item_ids ?? [], // Varsayılan boş dizi
                      })
                    }
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Blog Bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Blog Button */}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => {
            resetBlogData(); // Reset form fields when opening the modal
            setShowAddModal(true);
          }}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" />
          Yeni Blog Ekle
        </button>
        <button
          onClick={openImageModal}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" />
          Görsel Ekle
        </button>
      </div>
      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={closeImageModal}
        type="blog"
        onSelectImage={(imageId) => {
          setSelectedImageId(imageId); // Save selected image ID
          closeImageModal(); // Close modal after selecting
        }}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={closeCategoryModal}
        onCategorySelect={handleCategorySelect} // Pass the function here
      />

      <TagModal
        isOpen={showTagModal}
        onClose={closeTagModal}
        onTagSelect={(tags) => {
          setSelectedTags(tags.map((tag) => tag.id)); // Save tag IDs
          closeTagModal();
        }}
      />

      <MetaTagModal
        isOpen={showMetaTagModal}
        onClose={closeMetaTagModal}
        onMetaTagSelect={(metaTags) => {
          setSelectedMetaTags(metaTags.map((metaTag) => metaTag.id)); // Save meta tag IDs
          closeMetaTagModal();
        }}
      />

      {/* Pagination Controls */}
      {blogs.length > blogsPerPage && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 p-2 border rounded-lg ${
                page === currentPage
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Add Blog Modal */}
      {showAddModal && (
        <>
          {showConfirmationModal && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 "
              style={{ zIndex: 9999 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h3 className="text-xl text-black font-bold mb-4">
                  Çıkmak istediğinize emin misiniz?
                </h3>
                <p className="mb-6 text-gray-800">
                  Değişiklikleriniz kaydedilmeyecektir.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    onClick={() => setShowConfirmationModal(false)}
                  >
                    İptal
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                    onClick={() => {
                      confirmationAction();
                      setShowConfirmationModal(false);
                    }}
                  >
                    Onayla
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-y-auto"
            onClick={() => {
              setConfirmationAction(() => () => {
                setShowAddModal(false);
                resetBlogData(); // Reset fields when canceling
              });
              setShowConfirmationModal(true);
            }}
          >
            <div
              className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto my-8 max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent modal content click from closing
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Yeni Blog Ekle
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blog Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Blog Başlığı
                  </label>
                  <input
                    type="text"
                    placeholder="Blog Title"
                    value={newBlogData.title}
                    onChange={(e) =>
                      setNewBlogData({ ...newBlogData, title: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Yazar
                  </label>
                  <input
                    type="text"
                    placeholder="Author"
                    value={newBlogData.author}
                    onChange={(e) =>
                      setNewBlogData({ ...newBlogData, author: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Kategori
                  </label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={newBlogData.category}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Published Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Yayınlanma Tarihi
                  </label>
                  <input
                    type="date"
                    value={newBlogData.publishedDate}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        publishedDate: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Excerpt */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Kısa Açıklama
                  </label>
                  <textarea
                    placeholder="Blog yazısının kısa bir özeti"
                    value={newBlogData.excerpt}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        excerpt: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Related Products */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    İlgili Ürünler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Herbal Cream, Lavender Oil"
                    value={newBlogData.relatedProducts || ""}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        relatedProducts: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Kategoriler
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => openCategoryModal()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Kategorileri Seç
                    </button>
                    <span className="text-gray-700">
                      {selectedCategories.map((cat) => cat.name).join(", ") ||
                        "Seçilmedi"}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Etiketler
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={openTagModal}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Etiketleri Seç
                    </button>
                    <span className="text-gray-700">
                      {selectedTags.length > 0
                        ? selectedTags.join(", ")
                        : "Seçilmedi"}
                    </span>
                  </div>
                </div>

                {/* Meta Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Meta Etiketler
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={openMetaTagModal}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Meta Etiketleri Seç
                    </button>
                    <span className="text-gray-700">
                      {selectedMetaTags.length > 0
                        ? selectedMetaTags.join(", ")
                        : "Seçilmedi"}
                    </span>
                  </div>
                </div>

                {/* Image Upload */}
                {/* Image Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Blog Görseli
                  </label>
                  <button
                    onClick={openImageModal}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Görsel Seç
                  </button>
                  {selectedImageId && (
                    <div className="mt-4">
                      <img
                        src={
                          images.find((img) => img.id === selectedImageId)
                            ?.url || newBlogData.imageUrl
                        }
                        alt="Selected Blog Image"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Okuma Süresi (dakika)
                  </label>
                  <input
                    type="text"
                    placeholder="Read time"
                    value={newBlogData.readTime}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        readTime: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Dynamic Content Sections */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    İçerik
                  </h4>
                  {newBlogData.contentSections.map((section, index) => (
                    <div key={section.id || index} className="mb-6">
                      <input
                        type="text"
                        placeholder={`Section ${index + 1} Heading`}
                        value={section.heading}
                        onChange={(e) =>
                          handleContentSectionChange(
                            index,
                            "heading",
                            e.target.value
                          )
                        }
                        className="w-full p-2 mb-2 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        placeholder={`Section ${index + 1} Body`}
                        value={section.body}
                        onChange={(e) =>
                          handleContentSectionChange(
                            index,
                            "body",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* Remove Section Button */}
                      <button
                        className="absolute top-0 right-0 mt-2 mr-2 text-red-500"
                        onClick={() => removeContentSection(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addContentSection}
                    className="text-blue-600 hover:underline"
                  >
                    + Yeni Bölüm Ekle
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleAddBlogSubmit}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Blogu Ekle
                </button>

                <button
                  onClick={() => {
                    setConfirmationAction(() => () => {
                      setShowAddModal(false);
                      resetBlogData(); // Reset fields when canceling
                    });
                    setShowConfirmationModal(true);
                  }}
                  className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Blog Modal */}
      {showEditModal && (
        <>
          {showConfirmationModal && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 "
              style={{ zIndex: 9999 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h3 className="text-xl text-black font-bold mb-4">
                  Çıkmak istediğinize emin misiniz?
                </h3>
                <p className="mb-6 text-gray-800">
                  Değişiklikleriniz kaydedilmeyecektir.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    onClick={() => setShowConfirmationModal(false)}
                  >
                    İptal
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                    onClick={() => {
                      confirmationAction();
                      setShowConfirmationModal(false);
                    }}
                  >
                    Onayla
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-y-auto"
            onClick={() => {
              setConfirmationAction(() => () => {
                setShowEditModal(false);
                resetBlogData(); // Reset fields when canceling
              });
              setShowConfirmationModal(true);
            }}
          >
            <div
              className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto my-8 max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent modal content click from closing
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Blog Yazısını Düzenle
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blog Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Blog Başlığı
                  </label>
                  <input
                    type="text"
                    placeholder="Blog Title"
                    value={newBlogData.title}
                    onChange={(e) =>
                      setNewBlogData({ ...newBlogData, title: e.target.value })
                    }
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Yazar
                  </label>
                  <input
                    type="text"
                    placeholder="Author"
                    value={newBlogData.author}
                    onChange={(e) =>
                      setNewBlogData({ ...newBlogData, author: e.target.value })
                    }
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Kategori
                  </label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={newBlogData.category}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Published Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Yayınlanma Tarihi
                  </label>
                  <input
                    type="date"
                    value={newBlogData.publishedDate}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        publishedDate: e.target.value,
                      })
                    }
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Excerpt */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Kısa Açıklama
                  </label>
                  <textarea
                    placeholder="Short description of the blog"
                    value={newBlogData.excerpt}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        excerpt: e.target.value,
                      })
                    }
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Related Products */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    İlgili Ürünler (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Herbal Cream, Lavender Oil"
                    value={newBlogData.relatedProducts || ""}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        relatedProducts: e.target.value,
                      })
                    }
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Kategoriler
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => openCategoryModal()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Kategorileri Seç
                    </button>
                    <span className="text-gray-700">
                      {selectedCategories.map((cat) => cat.name).join(", ") ||
                        "Seçilmedi"}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Etiketler
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={openTagModal}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Etiketleri Seç
                    </button>
                    <span className="text-gray-700">
                      {selectedTags.length > 0
                        ? selectedTags.join(", ")
                        : "Seçilmedi"}
                    </span>
                  </div>
                </div>

                {/* Meta Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Meta Etiketler
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={openMetaTagModal}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Meta Etiketleri Seç
                    </button>
                    <span className="text-gray-700">
                      {selectedMetaTags.length > 0
                        ? selectedMetaTags.join(", ")
                        : "Seçilmedi"}
                    </span>
                  </div>
                </div>

                {/* Image Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Blog Görseli
                  </label>
                  <button
                    onClick={openImageModal}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Görsel Seç
                  </button>
                  {selectedImageId && (
                    <div className="mt-4">
                      <img
                        src={
                          images.find((img) => img.id === selectedImageId)
                            ?.url || newBlogData.imageUrl
                        }
                        alt="Selected Blog Image"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Okuma Süresi (dakika)
                  </label>
                  <input
                    type="text"
                    placeholder="Read time"
                    value={newBlogData.readTime}
                    onChange={(e) =>
                      setNewBlogData({
                        ...newBlogData,
                        readTime: e.target.value,
                      })
                    }
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Dynamic Content Sections */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    İçerik
                  </h4>
                  {newBlogData.contentSections.map((section, index) => (
                    <div key={index} className="mb-6">
                      <input
                        type="text"
                        placeholder={`Section ${index + 1} Heading`}
                        value={section.heading}
                        onChange={(e) =>
                          handleContentSectionChange(
                            index,
                            "heading",
                            e.target.value
                          )
                        }
                        className="w-full p-2 mb-2 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        placeholder={`Section ${index + 1} Body`}
                        value={section.body}
                        onChange={(e) =>
                          handleContentSectionChange(
                            index,
                            "body",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addContentSection}
                    className="text-blue-600 hover:underline"
                  >
                    + Yeni Bölüm Ekle
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleEditBlogSubmit}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Blogu Güncelle
                </button>

                <button
                  onClick={() => {
                    setConfirmationAction(() => () => {
                      setShowEditModal(false);
                      resetBlogData();
                    });
                    setShowConfirmationModal(true);
                  }}
                  className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
