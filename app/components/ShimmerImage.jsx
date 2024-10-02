import { useState, useEffect } from 'react';

const ShimmerImage = ({ src, alt, className }) => {
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
    <div className={`relative overflow-hidden ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      )}
      <img 
        src={currentSrc} 
        alt={alt} 
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default ShimmerImage;