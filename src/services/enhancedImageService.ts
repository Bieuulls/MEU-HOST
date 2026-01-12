import { v4 as uuidv4 } from 'uuid';

interface ImageUploadResult {
  success: boolean;
  urls?: string[];
  thumbnails?: string[];
  error?: string;
}

interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

interface ImageValidationRules {
  maxSize?: number;
  allowedTypes?: string[];
  minWidth?: number;
  minHeight?: number;
}

export class EnhancedImageService {
  private readonly defaultValidation: ImageValidationRules = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    minWidth: 200,
    minHeight: 200
  };

  private readonly defaultOptimization: ImageOptimizationOptions = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 85,
    format: 'webp'
  };

  async uploadImages(
    files: File[],
    validation: Partial<ImageValidationRules> = {},
    optimization: Partial<ImageOptimizationOptions> = {}
  ): Promise<ImageUploadResult> {
    try {
      const validationRules = { ...this.defaultValidation, ...validation };
      const optimizationOptions = { ...this.defaultOptimization, ...optimization };

      // Validate all files first
      for (const file of files) {
        const validationError = await this.validateImage(file, validationRules);
        if (validationError) {
          return { success: false, error: validationError };
        }
      }

      const uploadPromises = files.map(async (file) => {
        const optimizedImage = await this.optimizeImage(file, optimizationOptions);
        const thumbnail = await this.createThumbnail(optimizedImage);

        // Generate unique filenames
        const filename = `${uuidv4()}-${file.name.toLowerCase()}`;
        const thumbnailFilename = `thumb-${filename}`;

        // Upload both optimized image and thumbnail
        const formData = new FormData();
        formData.append('image', optimizedImage, filename);
        formData.append('thumbnail', thumbnail, thumbnailFilename);

        const response = await fetch('/api/upload/multiple', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload images');
        }

        const result = await response.json();
        return {
          imageUrl: result.imageUrl,
          thumbnailUrl: result.thumbnailUrl
        };
      });

      const results = await Promise.all(uploadPromises);

      return {
        success: true,
        urls: results.map(r => r.imageUrl),
        thumbnails: results.map(r => r.thumbnailUrl)
      };

    } catch (error) {
      console.error('Error uploading images:', error);
      return { success: false, error: 'Failed to upload images' };
    }
  }

  private async validateImage(file: File, rules: ImageValidationRules): Promise<string | null> {
    if (!file) return 'No file provided';

    if (!rules.allowedTypes?.includes(file.type)) {
      return 'Invalid file type';
    }

    if (file.size > (rules.maxSize || this.defaultValidation.maxSize!)) {
      return `File size too large. Maximum size is ${Math.floor(rules.maxSize! / (1024 * 1024))}MB`;
    }

    // Check image dimensions
    const dimensions = await this.getImageDimensions(file);
    if (dimensions.width < (rules.minWidth || 0) || dimensions.height < (rules.minHeight || 0)) {
      return `Image dimensions too small. Minimum size is ${rules.minWidth}x${rules.minHeight} pixels`;
    }

    return null;
  }

  private async optimizeImage(file: File, options: ImageOptimizationOptions): Promise<Blob> {
    const image = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate new dimensions while maintaining aspect ratio
    let { width, height } = image;
    if (width > options.maxWidth! || height > options.maxHeight!) {
      const ratio = Math.min(options.maxWidth! / width, options.maxHeight! / height);
      width *= ratio;
      height *= ratio;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob!),
        `image/${options.format}`,
        options.quality! / 100
      );
    });
  }

  private async createThumbnail(imageBlob: Blob): Promise<Blob> {
    const image = await createImageBitmap(imageBlob);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const thumbnailSize = 200;
    const ratio = Math.min(thumbnailSize / image.width, thumbnailSize / image.height);
    canvas.width = image.width * ratio;
    canvas.height = image.height * ratio;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/webp',
        0.7
      );
    });
  }

  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  async deleteImages(fileUrls: string[]): Promise<boolean> {
    try {
      const deletePromises = fileUrls.map(url =>
        fetch(`/api/upload/${encodeURIComponent(url)}`, {
          method: 'DELETE'
        })
      );

      const results = await Promise.all(deletePromises);
      return results.every(response => response.ok);
    } catch (error) {
      console.error('Error deleting images:', error);
      return false;
    }
  }
}

export const enhancedImageService = new EnhancedImageService();