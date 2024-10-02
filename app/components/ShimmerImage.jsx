import { useState, useEffect } from 'react';

const ShimmerImage = ({ src, alt, className, width, height }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setImageLoaded(false);
    setCurrentSrc(src);

    const img = new Image();
    img.src = src;
    img.onload = () => setImageLoaded(true);
  }, [src]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ width, height }}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer ${
          imageLoaded ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
        style={{
          backgroundSize: '200% 100%',
          backgroundPositionX: '180%',
        }}
      />
      <img 
        src={currentSrc} 
        alt={alt} 
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default ShimmerImage;