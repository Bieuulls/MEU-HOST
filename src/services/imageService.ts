// Mock image service
export const imageService = {
    uploadImage: async (file: File) => URL.createObjectURL(file),
};
