'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { initPayPal, createPayPalOrder } from '@/utils/paypalClient';
import NavBar from '../../../NavBar';
import Footer from '../../../Footer';
import Link from 'next/link';

interface LensType {
  id: string;
  name: string;
  price: number;
}

interface ProductDetails {
    productId: string;
    priceId: string;
    productName: string;
    productPrice: number;
    lensType: string;
    lensPrice: number;
    quantity: number;
  }
  
  interface Product {
    id: string;
    name: string;
    base_price: number;
    price_id: string;
  }

interface TenantPreferences {
  header_logo: string;
  accent_color: string;
  primary_color: string;
  footer_logo: string;
}

interface Tenant {
  preferences: TenantPreferences;
}

interface SelectLensesPageProps {
  params: {
    id: string;
  };
  searchParams: {
    tenant: string;
  };
}

const lensTypes: LensType[] = [
  { id: 'single', name: 'Single Vision', price: 0 },
  { id: 'bifocal', name: 'Bifocal', price: 50 },
  { id: 'progressive', name: 'Progressive', price: 100 },
];

export default function SelectLensesPage({ params, searchParams }: SelectLensesPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedLens, setSelectedLens] = useState<LensType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hoveredLens, setHoveredLens] = useState<string | null>(null);
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  const tenantString = searchParams.tenant;
  let tenant: Tenant | null = null;
  try {
    tenant = JSON.parse(decodeURIComponent(tenantString));
  } catch (error) {
    console.error("Failed to parse tenant data:", error);
  }
  if (!tenant || !tenant.preferences) {
    console.error("Tenant data is missing or malformed.");
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
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
      if (product && selectedLens && paypalButtonRef.current) {
        try {
          const paypal = await initPayPal('YOUR_PAYPAL_CLIENT_ID');
          if (paypal) {
            const totalPrice = product.base_price + selectedLens.price;
            const PayPalButton = await createPayPalOrder(paypal, totalPrice);
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
  }, [product, selectedLens]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleLensSelect = (lens: LensType) => {
    setSelectedLens(lens);
  };

  const totalPrice = product.base_price + (selectedLens ? selectedLens.price : 0);

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <NavBar
        options={["App", "About", "Contact"]}
        logoText=""
        logoImage={tenant?.preferences.header_logo}
        hoverColor={tenant?.preferences.accent_color}
      />
      <div className="flex-grow container mx-auto px-4 py-8 mt-[76px]">
        <Link
          href={`/product/${params.id}?tenant=${encodeURIComponent(JSON.stringify(tenant))}`}
          className="hover:underline mb-4 inline-block"
          style={{ color: tenant?.preferences.accent_color }}>
          &larr; Back to Product
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Select Lenses for {product.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {lensTypes.map((lens) => (
              <button
                key={lens.id}
                className="p-4 rounded-md border"
                onClick={() => handleLensSelect(lens)}
                onMouseEnter={() => setHoveredLens(lens.id)}
                onMouseLeave={() => setHoveredLens(null)}
                style={{
                  backgroundColor:
                    selectedLens?.id === lens.id
                      ? tenant?.preferences
                        ? tenant.preferences.primary_color
                        : '#3b82f6'
                      : hoveredLens === lens.id
                      ? '#f3f4f6'
                      : '#ffffff',
                  color: selectedLens?.id === lens.id ? '#ffffff' : '#1f2937',
                }}
              >
                <h3
                  className="font-bold"
                  style={{
                    color: selectedLens?.id === lens.id ? '#ffffff' : '#1f2937',
                  }}
                >
                  {lens.name}
                </h3>
                <p
                  style={{
                    color: selectedLens?.id === lens.id ? '#ffffff' : '#1f2937',
                  }}
                >
                  {lens.price === 0 ? 'Included' : `+$${lens.price.toFixed(2)}`}
                </p>
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-2xl font-bold mb-4 md:mb-0 text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <div ref={paypalButtonRef} className="w-full md:w-auto"></div>
          </div>
        </div>
      </div>
      <Footer
        background="#691b33"
        logoText=""
        logoImage={tenant?.preferences.footer_logo}
      />
    </main>
  );
}