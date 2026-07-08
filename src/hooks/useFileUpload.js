import { useState, useCallback } from 'react';
import axios from 'axios';
import { imageService } from '../services/imageService';

// Support production split-hosting by checking for target backend URL variables
const BACKEND_URL = import.meta.env.VITE_API_URL || '';
const UPLOAD_URL = `${BACKEND_URL}/api/images`;

/**
 * Custom hook to manage image file uploads with Axios.
 * Provides real-time upload progress tracking and falls back
 * to a smooth local simulation if the backend server is offline.
 */
export const useFileUpload = () => {
  const [files, setFiles] = useState([]);

  // Handle uploading of a single file
  const uploadSingleFile = useCallback(async (fileObj) => {
    const { id, file } = fileObj;

    // Helper to update the state of a specific file
    const updateFileState = (updates) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    };

    updateFileState({ status: 'uploading', progress: 0 });

    const formData = new FormData();
    formData.append('image', file);

    try {
      // 1. Attempt real API upload using Axios
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            updateFileState({ progress: percentCompleted });
          }
        },
      });

      // Upload succeeded on backend
      updateFileState({
        status: 'success',
        progress: 100,
        url: response.data?.url || '',
      });
    } catch (error) {
      console.warn(
        `Backend upload failed for ${file.name}. Activating localStorage fallback simulation.`,
        error
      );

      // 2. Fallback simulation (smooth progress updates & save as data URL)
      try {
        const dataUrl = await readFileAsDataURL(file);

        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
            clearInterval(interval);

            // Add image to our local database
            const mockImage = {
              id: 'mock-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
              url: dataUrl,
              name: file.name,
              size: file.size,
              uploadedAt: new Date().toISOString(),
            };
            imageService.addMockImage(mockImage);

            updateFileState({
              status: 'success',
              progress: 100,
            });
          } else {
            updateFileState({ progress });
          }
        }, 100); // 1-second simulation
      } catch (err) {
        updateFileState({
          status: 'failed',
          progress: 0,
          error: 'Failed to read file or simulate upload',
        });
      }
    }
  }, []);

  // Public method to batch-upload multiple files
  const uploadFiles = useCallback(
    (selectedFiles) => {
      const newFiles = Array.from(selectedFiles).map((file) => ({
        id: 'file-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'idle', // 'idle' | 'uploading' | 'success' | 'failed'
        file,
        error: null,
      }));

      // Add to beginning of files list so newest uploads are visible first
      setFiles((prev) => [...newFiles, ...prev]);

      // Start uploading each file asynchronously
      newFiles.forEach((fileObj) => {
        uploadSingleFile(fileObj);
      });
    },
    [uploadSingleFile]
  );

  // Clear current upload list
  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    uploadFiles,
    clearFiles,
  };
};

/**
 * Utility to convert local file to DataURL.
 * Useful for mocking backend image URLs.
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
