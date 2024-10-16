'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { initPayPal, createPayPalButton } from '@/utils/paypalClient';
import { useTenant } from '@/utils/useTenant';
import NavBar from '../../../NavBar';
import Footer from '../../../Footer';
import Link from 'next/link';
import ShimmerImage from '../../../../components/ShimmerImage';

interface Product {
  id: string;
  name: string;
  base_price: number;
  variants: {
    id: string;
    color: string;
    image_url: string;
  }[];
}

interface LensOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

const lensTypes: LensOption[] = [
  { id: 'single', name: 'Single Vision', description: 'Corrects vision for a single distance, ideal for most prescriptions.', price: 30 },
  { id: 'bifocal', name: 'Bifocal', description: 'Combines two prescriptions in one lens, typically for near and far vision.', price: 60 },
];

const lensMaterials: LensOption[] = [
  { id: 'polycarbonate', name: 'Polycarbonate (1.59)', description: 'Highly impact-resistant, ideal for sports and children.', price: 35 },
  { id: 'trivex', name: 'Trivex (1.53)', description: 'Lightweight and impact-resistant, good for rimless frames. Includes anti-scratch and anti-chip.', price: 50 },
  { id: 'high-index', name: 'High Index (1.67)', description: 'Thinner and lighter lenses for stronger prescriptions. Includes anti-scratch and anti-chip.', price: 80 },
];

const lensCoatings: LensOption[] = [
  { id: 'anti-glare', name: 'Anti-Glare Coating', description: 'Reduces reflections and improves clarity.', price: 35 },
  { id: 'anti-scratch', name: 'Anti-Scratch and Anti-Chip Coating', description: 'Increases durability and extends lens life.', price: 15 },
  { id: 'transitions', name: 'Transitions', description: 'Lenses that darken in sunlight, clear indoors.', price: 75 },
];

export default function SelectLensesPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedLensType, setSelectedLensType] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedCoatings, setSelectedCoatings] = useState<string[]>([]);
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  const { tenant, isLoading: isTenantLoading, error: tenantError } = useTenant();

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, base_price,
          variants (id, color, image_url)
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data as Product);
      }
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    const initializePayPal = async () => {
      if (product && selectedLensType && selectedMaterial && paypalButtonRef.current) {
        try {
          const paypal = await initPayPal();
          if (paypal) {
            const totalPrice = calculateTotalPrice();
            const PayPalButton = createPayPalButton(paypal, totalPrice);
            if (paypalButtonRef.current.firstChild) {
              paypalButtonRef.current.removeChild(paypalButtonRef.current.firstChild);
            }
            PayPalButton.render(paypalButtonRef.current);
          }
        } catch (error) {
          console.error('PayPal initialization failed:', error);
        }
      }
    };

    initializePayPal();
  }, [product, selectedLensType, selectedMaterial, selectedCoatings]);

  if (isTenantLoading || !product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (tenantError) return <div className="min-h-screen flex items-center justify-center">Error loading tenant information</div>;
  if (!tenant) return <div className="min-h-screen flex items-center justify-center">Tenant information not available</div>;

  const handleLensTypeSelect = (id: string) => setSelectedLensType(id);
  const handleMaterialSelect = (id: string) => setSelectedMaterial(id);
  const handleCoatingToggle = (id: string) => {
    if (id === 'anti-scratch' && isAntiScratchIncluded) {
      return; // Do nothing if anti-scratch is included and user tries to toggle it
    }
    setSelectedCoatings(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const isAntiScratchIncluded = selectedMaterial === 'high-index' || selectedMaterial === 'trivex';

  const calculateTotalPrice = () => {
    const lensTypePrice = lensTypes.find(lt => lt.id === selectedLensType)?.price || 0;
    const materialPrice = lensMaterials.find(lm => lm.id === selectedMaterial)?.price || 0;
    const coatingsPrice = selectedCoatings.reduce((total, id) => {
      const coating = lensCoatings.find(lc => lc.id === id);
      if (coating && coating.id === 'anti-scratch' && isAntiScratchIncluded) {
        return total; // Don't add price for anti-scratch if it's included
      }
      return total + (coating ? coating.price : 0);
    }, 0);
    
    return product.base_price + lensTypePrice + materialPrice + coatingsPrice;
  };

  const getOptimizedImageUrl = (url: string, width: number): string => 
    `${url}?impolicy=OO_ratio&width=${width}`;

  const primaryColor = tenant.preferences?.primary_color || "#3b82f6";
  const accentColor = tenant.preferences?.accent_color || "#2563eb";

  return (
    <main className="flex min-h-screen flex-col bg-gray-100 lens-selection-page">
      <NavBar
        options={["App", "About", "Contact"]}
        logoText=""
        logoImage={tenant.preferences?.header_logo || ""}
        hoverColor={accentColor}
      />
      <div className="flex-grow container mx-auto px-4 py-8 mt-[76px]">
        <Link
          href={`/product/${params.id}`}
          className="hover:underline mb-4 inline-block"
          style={{ color: accentColor }}>
          &larr; Back to Product
        </Link>
        <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="rounded-3xl overflow-hidden shadow-lg bg-gray-50 p-4">
                <ShimmerImage
                  src={getOptimizedImageUrl(product.variants[0].image_url, 400)}
                  alt={`${product.name} - ${product.variants[0].color}`}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
              <p className="text-center mt-4 text-lg font-semibold text-gray-700">{product.variants[0].color}</p>
            </div>
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
              <p className="text-xl mb-6 text-gray-600">Base Price: ${product.base_price.toFixed(2)}</p>
              
              <div className="space-y-6">
                {/* Lens Type Section */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Select Lens Type</h2>
                  <div className="space-y-4">
                    {lensTypes.map((type) => (
                      <button
                        key={type.id}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                          selectedLensType === type.id
                            ? 'shadow-md'
                            : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow'
                        }`}
                        style={{
                          backgroundColor: selectedLensType === type.id ? primaryColor : '',
                          borderColor: selectedLensType === type.id ? primaryColor : '',
                          color: selectedLensType === type.id ? 'white' : 'rgb(31, 41, 55)',
                        }}
                        onClick={() => handleLensTypeSelect(type.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-lg">{type.name}</span>
                          <span className="text-lg">+${type.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm mt-2">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Lens Material Section */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Select Lens Material</h2>
                  <div className="space-y-4">
                    {lensMaterials.map((material) => (
                      <button
                        key={material.id}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                          selectedMaterial === material.id
                            ? 'shadow-md'
                            : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow'
                        }`}
                        style={{
                          backgroundColor: selectedMaterial === material.id ? primaryColor : '',
                          borderColor: selectedMaterial === material.id ? primaryColor : '',
                          color: selectedMaterial === material.id ? 'white' : 'rgb(31, 41, 55)',
                        }}
                        onClick={() => handleMaterialSelect(material.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-lg">{material.name}</span>
                          <span className="text-lg">+${material.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm mt-2">{material.description}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Lens Coatings Section */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Select Lens Coatings</h2>
                  <div className="space-y-4">
                    {lensCoatings.map((coating) => {
                      const isIncluded = coating.id === 'anti-scratch' && isAntiScratchIncluded;
                      const isSelected = selectedCoatings.includes(coating.id) || isIncluded;
                      
                      return (
                        <button
                          key={coating.id}
                          className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                            isSelected
                              ? 'shadow-md'
                              : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow'
                          } ${isIncluded ? 'cursor-not-allowed' : ''}`}
                          style={{
                            color: isSelected ? 'white' : 'rgb(31, 41, 55)',
                            backgroundColor: isSelected ? (isIncluded ? 'rgb(138, 145, 155)' : primaryColor) : '',
                            borderColor: isSelected ? (isIncluded ? '#A0AEC0' : primaryColor) : '',
                          }}
                          onClick={() => handleCoatingToggle(coating.id)}
                          disabled={isIncluded}>
                          <div className="flex justify-between items-start">
                            <div className="flex-grow">
                              <span className="font-medium text-lg">{coating.name}</span>
                              <p className="text-sm mt-2">{coating.description}</p>
                            </div>
                            <div className="text-right flex flex-col items-end ml-4">
                              <span className="text-lg">
                                {isIncluded ? 'FREE' : `+$${coating.price.toFixed(2)}`}
                              </span>
                              {isIncluded && (
                                <div className="text-xs mt-2">
                                  Included with selected material
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="border-t pt-4 mt-6">
                <p className="text-2xl font-bold mb-4 text-gray-800">
                  Total: ${calculateTotalPrice().toFixed(2)}
                </p>
                <div ref={paypalButtonRef} className="w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        background={primaryColor}
        logoText=""
        logoImage={tenant.preferences?.footer_logo || ""}
      />
    </main>
  );
}