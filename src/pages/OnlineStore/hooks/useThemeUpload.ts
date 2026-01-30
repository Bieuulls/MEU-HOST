import { useState, useCallback } from 'react';
import { themeService } from '../services/themeService';
import { Theme, UploadProgress } from '../types';

export const useThemeUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith('.zip')) {
      return 'Please upload a valid .zip file';
    }

    if (file.size > 50 * 1024 * 1024) {
      return 'File size exceeds 50MB limit';
    }

    return null;
  };

  const uploadTheme = useCallback(async (file: File): Promise<Theme | null> => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress({
          loaded: (file.size * i) / 100,
          total: file.size,
          percentage: i
        });
      }

      const theme = await themeService.uploadTheme(file);
      return theme;
    } catch (err) {
      setError('Failed to upload theme. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, []);

  return {
    uploadTheme,
    isUploading,
    error,
    progress,
  };
};
