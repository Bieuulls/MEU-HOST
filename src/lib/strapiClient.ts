import axios from 'axios';

// Create an axios instance with default configuration
const strapiClient = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token if available
strapiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('strapi_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to format data for Strapi
export const formatStrapiData = (data: any, files?: Record<string, File[]>) => {
  // If no files, just return the data formatted for Strapi
  if (!files) {
    return {
      data: data
    };
  }

  // If there are files, we need to use FormData
  const formData = new FormData();

  // Add the JSON data
  formData.append('data', JSON.stringify({ data }));

  // Add each file to the FormData
  Object.entries(files).forEach(([fieldName, fieldFiles]) => {
    fieldFiles.forEach((file) => {
      formData.append(`files.${fieldName}`, file, file.name);
    });
  });

  return formData;
};

export { strapiClient };