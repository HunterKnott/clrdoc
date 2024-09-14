'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import NavBar from '../../NavBar';
import Footer from '../../Footer';
import Link from 'next/link';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);

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

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <NavBar options={["App", "About", "Contact"]} />
      <div className="flex-grow container mx-auto px-4 py-8 mt-[76px]">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Products</Link>
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img src={product.image_url} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold mb-6 text-gray-800">${product.base_price.toFixed(2)}</p>
              <Link href={`/product/${params.id}/select-lenses`} className="inline-block">
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
