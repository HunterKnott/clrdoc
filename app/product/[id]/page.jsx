'use client';

import { useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import NavBar from '../../NavBar';
import Footer from '../../Footer';
import Link from 'next/link';

export default function ProductPage({ params, searchParams }) {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const tenantString = searchParams.tenant;
  let tenant;
  const decodedString = decodeURIComponent(tenantString);
  tenant = JSON.parse(decodedString);
  tenant = JSON.parse(tenant);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          variants (
            id,
            color,
            image_url,
            gallery_images (
              image_url
            )
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
        setSelectedVariant(data.variants[0]);
      }
    };

    fetchProduct();
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [params.id]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const getOptimizedImageUrl = (url, width) => {
    return `${url}?impolicy=OO_ratio&width=${width}`;
  };

  const images = [selectedVariant.image_url, ...selectedVariant.gallery_images.map(img => img.image_url)];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <NavBar options={["App", "About", "Contact"]} logoText="" logoImage={`${tenant.logo_url}`} />
      <div className="flex-grow container mx-auto px-4 py-8 mt-[76px]">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Products</Link>
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              {isMobile ? (
                <div className="flex flex-col gap-4">
                  {images.map((image, index) => (
                    <img 
                      key={index}
                      src={getOptimizedImageUrl(image, 600)} 
                      alt={`${product.name} view ${index + 1}`} 
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="relative">
                    <img 
                      src={getOptimizedImageUrl(images[currentImageIndex], 600)} 
                      alt={`${product.name} view ${currentImageIndex + 1}`} 
                      className="w-full h-auto object-cover rounded-lg"
                    />
                    <button 
                      onClick={prevImage} 
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
                    >
                      &lt;
                    </button>
                    <button 
                      onClick={nextImage} 
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
                    >
                      &gt;
                    </button>
                  </div>
                  <div className="flex mt-4 gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <img 
                        key={index}
                        src={getOptimizedImageUrl(image, 100)} 
                        alt={`${product.name} thumbnail ${index + 1}`} 
                        className={`w-20 h-20 object-cover rounded cursor-pointer ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold mb-6 text-gray-800">${product.base_price.toFixed(2)}</p>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Color Options:</h2>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      className={`px-4 py-2 rounded-md ${
                        selectedVariant.id === variant.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
              <Link href={`/product/${params.id}/select-lenses?tenant=${tenantString}`} className="inline-block">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 w-full md:w-auto">
                  Select Lenses
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}