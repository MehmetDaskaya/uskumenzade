"use client";
import { useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { mockBlogData } from "../../../../util/mock/mockBlogData";

export const BlogsComponent = () => {
  const [blogs, setBlogs] = useState(mockBlogData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);

  const [newBlogData, setNewBlogData] = useState({
    title: "",
    author: "",
    category: "",
    publishedDate: "",
    excerpt: "",
    contentSections: [{ heading: "", body: "" }],
    tags: "",
    imageUrl: "",
    readTime: "",
    relatedProducts: "", // Initialize as an empty string, not an array
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<() => void>(
    () => {}
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Function to show the Snackbar
  const triggerSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000); // Hide the Snackbar after 3 seconds
  };

  const confirmDeleteBlog = (blog: Blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (!blogToDelete) return;
    const updatedBlogs = blogs.filter((blog) => blog.id !== blogToDelete.id);
    setBlogs(updatedBlogs);
    setShowDeleteModal(false);
    triggerSnackbar("Blog deleted.");
  };

  // Handle search query input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog); // Now use currentPage and blogsPerPage

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle add and edit blog
  const handleAddBlogSubmit = () => {
    // Check if any field is empty
    const {
      title,
      author,
      category,
      publishedDate,
      excerpt,
      tags,
      imageUrl,
      readTime,
      contentSections,
    } = newBlogData;

    if (
      !title.trim() ||
      !author.trim() ||
      !category.trim() ||
      !publishedDate.trim() ||
      !excerpt.trim() ||
      !tags.trim() ||
      !imageUrl.trim() ||
      !readTime.trim() ||
      contentSections.some(
        (section) => !section.heading.trim() || !section.body.trim()
      ) // Check if any content section is empty
    ) {
      triggerSnackbar("Please fill in all required fields.");
      return; // Prevent submission
    }

    const newBlog = {
      id: blogs.length + 1,
      ...newBlogData,
      tags: newBlogData.tags.split(",").map((tag) => tag.trim()), // Split tags by comma
      relatedProducts: newBlogData.relatedProducts
        .split(",")
        .map((product) => product.trim()), // Split related products by comma
      contentSections: newBlogData.contentSections.map((section) => ({
        ...section,
      })),
    };

    setBlogs([...blogs, newBlog]);
    setShowAddModal(false);
    resetBlogData();
  };

  interface Blog {
    id: number;
    title: string;
    author: string;
    category: string;
    publishedDate: string;
    excerpt: string;
    contentSections: { heading: string; body: string }[];
    tags: string[];
    imageUrl: string;
    readTime: string;
    relatedProducts: string[]; // Should be an array of strings
  }

  const handleEditBlog = (blog: Blog) => {
    resetBlogData(); // Reset form fields before opening the modal
    setCurrentBlog(blog);
    setNewBlogData({
      ...blog,
      tags: blog.tags.join(", "), // Join tags to make them comma-separated string for input field
      relatedProducts: Array.isArray(blog.relatedProducts)
        ? blog.relatedProducts.join(", ")
        : "",
    });
    setShowEditModal(true);
  };

  const handleEditBlogSubmit = () => {
    if (!currentBlog) return; // Check if currentBlog is null

    const updatedBlogs = blogs.map((blog) =>
      blog.id === currentBlog.id
        ? {
            ...blog,
            ...newBlogData,
            tags: newBlogData.tags.split(",").map((tag) => tag.trim()), // Split the tags into an array
            relatedProducts: newBlogData.relatedProducts
              .split(",")
              .map((product) => product.trim()), // Split related products by comma
          }
        : blog
    );

    setBlogs(updatedBlogs);
    setShowEditModal(false);
    resetBlogData();
  };

  const resetBlogData = () => {
    setNewBlogData({
      title: "",
      author: "",
      category: "",
      publishedDate: "",
      excerpt: "",
      contentSections: [{ heading: "", body: "" }],
      tags: "",
      imageUrl: "",
      readTime: "",
      relatedProducts: "",
    });
  };

  // Manage content sections dynamically
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
        { heading: "", body: "" },
      ],
    });
  };

  const removeContentSection = (index: number) => {
    const updatedSections = newBlogData.contentSections.filter(
      (_, i) => i !== index
    );
    setNewBlogData({ ...newBlogData, contentSections: updatedSections });
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

      <h2 className="text-2xl font-bold mb-6">Manage Blogs</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search blogs by title, author, or category..."
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
            <th className="p-4 text-left font-semibold text-gray-600">Title</th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Author
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Category
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              Published Date
            </th>
            <th className="p-4 text-center font-semibold text-gray-600">
              Actions
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
                <td className="p-4 text-gray-600">{blog.publishedDate}</td>
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
                          Confirm Delete
                        </h2>
                        <p className="text-gray-800">
                          Are you sure you want to delete this blog?
                        </p>
                        <div className="mt-6 flex justify-end space-x-4">
                          <button
                            onClick={() => setShowDeleteModal(false)} // Cancel delete
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteConfirmed} // Confirm delete
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => confirmDeleteBlog(blog)} // Updated this line
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
                No blogs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Blog Button */}
      <div className="mt-6">
        <button
          onClick={() => {
            resetBlogData(); // Reset form fields when opening the modal
            setShowAddModal(true);
          }}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New Blog
        </button>
      </div>

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
                  Are you sure?
                </h3>
                <p className="mb-6 text-gray-800">
                  Your changes will not be saved.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    onClick={() => setShowConfirmationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                    onClick={() => {
                      confirmationAction();
                      setShowConfirmationModal(false);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-y-auto"
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
                Add New Blog
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blog Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Blog Title
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
                    Author
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
                    Category
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
                    Published Date
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
                    Excerpt
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
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Related Products */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Related Products (comma-separated)
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
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. skincare, health"
                    value={newBlogData.tags}
                    onChange={(e) =>
                      setNewBlogData({ ...newBlogData, tags: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Image Upload
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewBlogData({
                            ...newBlogData,
                            imageUrl: reader.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full p-3 bg-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {newBlogData.imageUrl && (
                    <img
                      src={newBlogData.imageUrl}
                      alt="Uploaded"
                      className="mt-4 w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  )}
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Read Time (minutes)
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
                    Content Sections
                  </h4>
                  {newBlogData.contentSections.map((section, index) => (
                    <div key={index} className="mb-6 relative">
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
                        className="w-full bg-gray-800 p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full bg-gray-800 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    + Add Section
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleAddBlogSubmit}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Add Blog
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
                  Cancel
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
                  Are you sure?
                </h3>
                <p className="mb-6 text-gray-800">
                  Your changes will not be saved.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    onClick={() => setShowConfirmationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                    onClick={() => {
                      confirmationAction();
                      setShowConfirmationModal(false);
                    }}
                  >
                    Confirm
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
                Edit Blog
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blog Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Blog Title
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
                    Author
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
                    Category
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
                    Published Date
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
                    Excerpt
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
                    Related Products (comma-separated)
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
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. skincare, health"
                    value={newBlogData.tags}
                    onChange={(e) =>
                      setNewBlogData({ ...newBlogData, tags: e.target.value })
                    }
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Image Upload
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewBlogData({
                            ...newBlogData,
                            imageUrl: reader.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full p-3 border bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {newBlogData.imageUrl && (
                    <img
                      src={newBlogData.imageUrl}
                      alt="Uploaded"
                      className="mt-4 w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  )}
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Read Time (minutes)
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
                    Content Sections
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
                    + Add Section
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to update this blog?")) {
                      handleEditBlogSubmit();
                    }
                  }}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Update Blog
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
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
