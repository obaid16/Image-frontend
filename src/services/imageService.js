import axios from 'axios';

const API_BASE_URL = '/api';

// Flag to switch to localStorage mock DB if backend is offline or not implemented yet
let useMock = false;

// Helper to retrieve images from localStorage mock DB
const getMockDatabase = () => {
  const data = localStorage.getItem('gallery_mock_db');
  return data ? JSON.parse(data) : [];
};

// Helper to save images to localStorage mock DB
const saveMockDatabase = (db) => {
  localStorage.setItem('gallery_mock_db', JSON.stringify(db));
};

export const imageService = {
  /**
   * Fetches paginated images from backend or localStorage mock fallback.
   * @param {number} page - The current page number.
   * @param {number} limit - Number of images per page.
   * @returns {Promise<{images: Array, totalPages: number, currentPage: number, totalImages: number}>}
   */
  fetchImages: async (page = 1, limit = 9, type = 'all', sort = 'desc') => {
    if (useMock) {
      return getMockedImages(page, limit, type, sort);
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/images`, {
        params: { page, limit, type, sort }
      });
      const data = response.data;
      if (data && Array.isArray(data.images)) {
        data.images = data.images.map((img) => ({
          id: img.id || img._id,
          url: img.imagePath,
          name: img.originalName || img.filename,
          uploadedAt: img.uploadDate,
          size: img.fileSize
        }));
      }
      return data;
    } catch (error) {
      console.warn('Backend API GET /api/images failed, switching to localStorage mock fallback.', error);
      useMock = true;
      return getMockedImages(page, limit);
    }
  },

  /**
   * Deletes an image by ID.
   * @param {string|number} id - The unique identifier of the image.
   * @returns {Promise<{success: boolean}>}
   */
  deleteImage: async (id) => {
    const isMockId = String(id).startsWith('mock-');
    if (useMock || isMockId) {
      const db = getMockDatabase();
      const updated = db.filter(img => img.id !== id);
      saveMockDatabase(updated);
      return { success: true };
    }
    try {
      const response = await axios.delete(`${API_BASE_URL}/images/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend DELETE /api/images/${id} failed, attempting localStorage mock deletion.`, error);
      const db = getMockDatabase();
      const updated = db.filter(img => img.id !== id);
      saveMockDatabase(updated);
      return { success: true };
    }
  },

  /**
   * Saves an image in the local mock database.
   * Useful for testing upload functionality offline.
   * @param {object} image - The image metadata object.
   */
  addMockImage: (image) => {
    const db = getMockDatabase();
    db.unshift(image); // Add newest uploads first
    saveMockDatabase(db);
  }
};

/**
 * Simulates pagination for local storage mock database.
 */
function getMockedImages(page, limit, type = 'all') {
  let db = getMockDatabase();

  // Apply mock file extension filter
  if (type && type !== 'all') {
    db = db.filter((img) => {
      const name = img.name || img.filename || '';
      const ext = name.split('.').pop().toLowerCase();
      if (type === 'jpg' || type === 'jpeg') {
        return ext === 'jpg' || ext === 'jpeg';
      }
      return ext === type;
    });
  }

  const totalImages = db.length;
  const totalPages = Math.max(1, Math.ceil(totalImages / limit));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedImages = db.slice(startIndex, endIndex);

  return {
    images: paginatedImages,
    totalPages,
    currentPage: page,
    totalImages
  };
}
