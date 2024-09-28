'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import NavBar from '../../../NavBar';
import Footer from '../../../Footer';
import Link from 'next/link';
import { createCheckoutSession, getStripe } from '@/utils/stripe';

const lensTypes = [
  { id: 'single', name: 'Single Vision', price: 0 },
  { id: 'bifocal', name: 'Bifocal', price: 50 },
  { id: 'progressive', name: 'Progressive', price: 100 },
];

export default function SelectLensesPage({ params, searchParams }) {
  const [product, setProduct] = useState(null);
  const [selectedLens, setSelectedLens] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleLensSelect = (lens) => {
    setSelectedLens(lens);
  };

  const totalPrice = product.base_price + (selectedLens ? selectedLens.price : 0);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const session = await createCheckoutSession({
        productId: product.id,
        productName: product.name,
        productPrice: product.base_price,
        lensType: selectedLens.name,
        lensPrice: selectedLens.price,
        totalPrice: totalPrice,
      });

      const stripe = await getStripe();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <NavBar
        options={["App", "About", "Contact"]}
        logoText=""
        logoImage={`${tenant.styles.header_logo}`}
        hoverColor={`${tenant.styles.accent_color}`}
      />
      <div className="flex-grow container mx-auto px-4 py-8 mt-[76px]">
        <Link href={`/product/${params.id}?tenant=${tenantString}`} className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Product</Link>
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Select Lenses for {product.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {lensTypes.map((lens) => (
              <button
                key={lens.id}
                className={`p-4 rounded-md border ${
                  selectedLens?.id === lens.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => handleLensSelect(lens)}
              >
                <h3 className="font-bold">{lens.name}</h3>
                <p>{lens.price === 0 ? 'Included' : `+$${lens.price.toFixed(2)}`}</p>
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-2xl font-bold mb-4 md:mb-0 text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <button
              className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ${
                !selectedLens || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!selectedLens || isLoading}
              onClick={handleCheckout}
            >
              {isLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
      <Footer background="#691b33" logoText="" logoImage={`${tenant.styles.footer_logo}`} />
    </main>
  );
}
