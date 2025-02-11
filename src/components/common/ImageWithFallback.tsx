import { useState } from 'react';
import { placeholderImage } from '../../assets/images/placeholder';

interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fallbackSrc = placeholderImage,
  className = '',
  ...props 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const imageSrc = error || !src ? fallbackSrc : src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
      {...props}
    />
  );
}
