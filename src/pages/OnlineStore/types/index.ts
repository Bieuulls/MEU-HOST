export interface Theme {
  id: string;
  name: string;
  version: string;
  previewImage: string;
  status: 'active' | 'inactive';
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
