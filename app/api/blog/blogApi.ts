import API_BASE_URL from "../../../util/config";
import axios from "axios";
import store from "@/redux/store";

// Helper function to get Authorization headers
const getAuthHeaders = () => {
  const state = store.getState();
  const token = state.auth.accessToken; // Assuming the token is stored in auth.accessToken
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchBlogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/uskumenzade/api/blogs/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const fetchBlogById = async (id: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/uskumenzade/api/blogs/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return {
      ...response.data,
      contentSections: response.data.contentSections || [], // Default to an empty array
    };
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    throw error;
  }
};

// Create a section
export const createSection = async (sectionData: {
  blog_id: string;
  section_type: string;
  order: number;
  content: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/uskumenzade/api/sections/`,
      sectionData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

// Add blog and sections
export const addBlog = async (blogData: {
  title: string;
  author: string;
  category_id: string | null; // Use category_id here
  content: string;
  related_item_ids: string[];
  sections: { order: number; section_type: string; content: string }[];
  image_ids: string[];
  tag_ids: string[];
  meta_tag_ids: string[];
  description: string; // Add description field
  read_time: string; // Add read_time field
}) => {
  try {
    // Step 1: Create the blog without sections
    const response = await axios.post(
      `${API_BASE_URL}/uskumenzade/api/blogs/`,
      {
        title: blogData.title,
        author: blogData.author,
        category_id: blogData.category_id, // Use category_id
        content: blogData.content,
        related_item_ids: blogData.related_item_ids,
        image_ids: blogData.image_ids,
        tag_ids: blogData.tag_ids,
        meta_tag_ids: blogData.meta_tag_ids,
        description: blogData.description, // Include description
        read_time: blogData.read_time, // Include read_time
      },
      { headers: getAuthHeaders() }
    );
    const createdBlog = response.data;

    // Step 2: Create sections for the blog
    for (const section of blogData.sections) {
      await createSection({
        blog_id: createdBlog.id, // Associate the section with the blog
        section_type: section.section_type,
        order: section.order,
        content: section.content,
      });
    }

    // Step 3: Fetch the blog again to include sections in the response
    const updatedBlog = await fetchBlogById(createdBlog.id);

    return updatedBlog; // Return the blog with sections
  } catch (error) {
    console.error("Error adding new blog:", error);
    throw error;
  }
};

// Update blog and sections
// Update blog and sections
export const updateBlog = async (
  id: string,
  blogData: {
    title: string;
    author: string;
    category_id: string | null; // Updated to accept category_id
    content: string;
    related_item_ids: string[];
    image_ids: string[];
    tag_ids: string[];
    meta_tag_ids: string[];
    description: string; // Include description
    read_time: string; // Include read_time
    sections: {
      id?: string; // Existing or new section ID
      parent_section_id?: string; // Optional parent section ID
      order: number;
      section_type: string;
      content: string;
    }[];
  }
) => {
  try {
    // Step 1: Update the blog
    const response = await axios.patch(
      `${API_BASE_URL}/uskumenzade/api/blogs/${id}`,
      {
        title: blogData.title,
        author: blogData.author,
        category_id: blogData.category_id, // Include category_id
        content: blogData.content,
        related_item_ids: blogData.related_item_ids,
        image_ids: blogData.image_ids,
        tag_ids: blogData.tag_ids,
        meta_tag_ids: blogData.meta_tag_ids,
        description: blogData.description, // Include description
        read_time: blogData.read_time, // Include read_time
      },
      { headers: getAuthHeaders() }
    );

    // Step 2: Update or create sections
    for (const section of blogData.sections) {
      if (section.id) {
        // Update existing section
        await axios.patch(
          `${API_BASE_URL}/uskumenzade/api/sections/${section.id}`,
          {
            blog_id: id,
            parent_section_id: section.parent_section_id, // If applicable
            section_type: section.section_type,
            order: section.order,
            content: section.content,
          },
          { headers: getAuthHeaders() }
        );
      } else {
        // Create new section
        await createSection({
          blog_id: id,
          section_type: section.section_type,
          order: section.order,
          content: section.content,
        });
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/uskumenzade/api/blogs/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};
