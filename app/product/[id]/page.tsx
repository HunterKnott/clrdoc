'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useTenant } from '@/utils/useTenant';
import NavBar from '../../NavBar';
import Footer from '../../Footer';
import Link from 'next/link';
import ShimmerImage from '../../../components/ShimmerImage';
import { SupabaseClient } from '@supabase/supabase-js';

interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  variants: Variant[];
}

interface Variant {
  id: number;
  color: string;
  image_url: string;
  gallery_images: { image_url: string }[];
}

interface TenantPreferences {
  header_logo: string;
  footer_logo: string;
  accent_color: string;
  primary_color: string;
}

interface Tenant {
  preferences: TenantPreferences;
}

interface ProductPageProps {
  params: {
    id: string;
  };
  searchParams: {
    tenant: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { tenant, isLoading: isTenantLoading, error: tenantError } = useTenant();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHoveredOption, setIsHoveredOption] = useState<boolean>(false);
  const [isHoveredSelect, setIsHoveredSelect] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!tenant) return;
      
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
        .eq('tenant_id', tenant.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data as Product);
        setSelectedVariant(data.variants[0]);
      }
    };

    fetchProduct();
  }, [params.id, tenant]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const getOptimizedImageUrl = (url: string, width: number): string => {
    return `${url}?impolicy=OO_ratio&width=${width}`;
  };

  const images = selectedVariant
    ? [selectedVariant.image_url, ...selectedVariant.gallery_images.map((img) => img.image_url)]
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <NavBar
        options={["App", "About", "Contact"]}
        logoText=""
        logoImage={tenant?.preferences?.header_logo || ""}
        hoverColor={tenant?.preferences?.accent_color || ""}
      />
      <div className="flex-grow container mx-auto px-4 py-8 mt-[76px]">
        <Link
          href="/"
          className="hover:underline mb-4 inline-block"
          style={{ color: tenant?.preferences?.accent_color }}
        >
          &larr; Back to Products
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              {isMobile ? (
                <div className="flex flex-col gap-4">
                  {images.map((image, index) => (
                    <ShimmerImage
                      key={index}
                      src={getOptimizedImageUrl(image, 600)}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-[400px]"
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <div className="relative h-[400px]">
                    <ShimmerImage
                      src={getOptimizedImageUrl(images[currentImageIndex], 600)}
                      alt={`${product.name} view ${currentImageIndex + 1}`}
                      className="w-full h-full"
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
                      <div
                        key={index}
                        className="relative w-20 h-20 cursor-pointer"
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          border: index === currentImageIndex ? '2px solid' : '',
                          borderColor:
                            index === currentImageIndex && tenant?.preferences
                              ? tenant.preferences.primary_color
                              : index === currentImageIndex
                              ? '#3b82f6'
                              : '',
                        }}
                      >
                        <ShimmerImage
                          src={getOptimizedImageUrl(image, 100)}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold mb-6 text-gray-800">
                ${product.base_price.toFixed(2)}
              </p>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Color Options:</h2>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      className="px-4 py-2 rounded-md"
                      style={{
                        backgroundColor:
                          selectedVariant?.id === variant.id
                            ? tenant?.preferences?.accent_color || '#2563eb'
                            : '#e5e7eb',
                        color: selectedVariant?.id === variant.id ? 'white' : '#1f2937',
                      }}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
              <Link
                href={`/product/${params.id}/select-lenses`}
                className="inline-block"
              >
                <button
                  className="text-white py-2 px-4 rounded-md transition duration-300 w-full md:w-auto"
                  style={{
                    backgroundColor: isHoveredSelect
                      ? tenant?.preferences?.accent_color || '#2563eb'
                      : tenant?.preferences?.primary_color || '#3b82f6',
                  }}
                  onMouseEnter={() => setIsHoveredSelect(true)}
                  onMouseLeave={() => setIsHoveredSelect(false)}
                >
                  Select Lenses
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer
        background="#691b33"
        logoText=""
        logoImage={tenant?.preferences?.footer_logo || ""}
      />
    </main>
  );
}