// No imports needed for client-side image service

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class ImageService {
  constructor() {
    // Remove baseUrl since we'll use absolute paths
  }

  async uploadImage(file: File): Promise<UploadResult> {
    try {
      if (!file) {
        return { success: false, error: 'No file provided' };
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Invalid file type. Only images are allowed.' };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        return { success: false, error: 'File size too large. Maximum size is 5MB.' };
      }

      // Validate file extension
      const fileName = file.name.toLowerCase();
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

      if (!hasValidExtension) {
        return { success: false, error: 'Invalid file extension. Allowed: jpg, jpeg, png, gif, webp' };
      }

      // Create form data for upload
      const formData = new FormData();
      formData.append('image', file);

      // Send request to server using the correct endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: error || 'Failed to upload image' };
      }

      const result = await response.json();
      return { success: true, url: result.url };

    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: 'Failed to upload image' };
    }
  }

  async deleteImage(fileName: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/upload/${fileName}`, {
        method: 'DELETE'
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
}

export const imageService = new ImageService();