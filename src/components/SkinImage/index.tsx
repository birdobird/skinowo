import { useState } from 'react';

interface SkinImageProps {
  src: string;
  alt: string;
  className?: string;
  steamUrl?: string;
}

const SkinImage = ({ src, alt, className = '', steamUrl }: SkinImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Check if the source is a local asset
  const isLocalAsset = src?.startsWith('src/assets/');
  
  // Handle image source with error state
  const displaySrc = (() => {
    if (isLocalAsset) {
      // For local assets, use the path as is
      return src;
    }
    
    if (hasError) {
      // If there's an error and it's not a local asset, try to get a fallback
      if (src?.startsWith('http')) {
        return src; // Already a full URL, use as is
      }
      
      if (src?.startsWith('/')) {
        return `https://steamcommunity-a.akamaihd.net${src}`;
      }
      
      return 'https://firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png';
    }
    
    return src || 'https://firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png';
  })();
    
  // Add cache busting only for non-local assets
  const cacheBustedSrc = isLocalAsset 
    ? displaySrc 
    : displaySrc.includes('?') 
      ? `${displaySrc}&t=${Date.now()}` 
      : `${displaySrc}?t=${Date.now()}`;

  return (
    <div className={`relative ${className}`}>
      <img
        src={cacheBustedSrc}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${steamUrl ? 'cursor-pointer hover:opacity-90' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        onClick={() => {
          if (steamUrl) {
            window.open(steamUrl, '_blank');
          }
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-700 rounded w-16 h-16"></div>
        </div>
      )}
    </div>
  );
};

export default SkinImage;