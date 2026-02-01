import React from 'react';
import { Upload } from 'lucide-react';
import { useDropZone } from '../../hooks/useDropZone';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, disabled }) => {
  const {
    isDragActive,
    inputRef,
    handleDrag,
    handleDrop,
    handleClick,
    handleChange
  } = useDropZone(onFileSelect);

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2">
        Drag and drop your theme file here
      </p>
      <p className="text-sm text-gray-500">
        or <span className="text-blue-500">browse files</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".zip"
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};
