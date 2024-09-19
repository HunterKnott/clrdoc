'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const firstVariant = product.variants[0];
  const thumbnailImage = firstVariant?.gallery_images[0]?.image_url || firstVariant?.image_url;

  return (
    <Link href={`/product/${product.id}`} className='flex flex-col items-center max-w-xs bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
      <img 
        src={thumbnailImage+'?impolicy=OO_ratio&width=768'}
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className='p-4'>
        <h3 className='font-bold text-xl mb-2 text-center'>{product.name}</h3>
        <p className='text-center text-gray-600 mb-2'>{firstVariant?.color}</p>
        <p className='text-center text-lg font-bold'>${product.base_price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default function Home() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tenants')
        .select('*');

      if (error) {
        console.error('Error fetching tenants:', error);
      } else {
        setTenants(data);
        if (data.length > 0) {
          setSelectedTenant(data[0].id);
        }
      }
    };

    fetchTenants();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedTenant) {
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
          .eq('tenant_id', selectedTenant)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data);
        }
      }
    };

    fetchProducts();
  }, [selectedTenant]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-gray-100 flex min-h-screen flex-col">
      <div className="bg-white shadow-md mt-[76px]"> {/* Add mt-[76px] to push content below navbar */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="font-bold text-3xl mb-4 sm:mb-0">Find Your Perfect Eyewear</h1>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 w-48 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <select
                value={selectedTenant || ''}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className='flex-grow bg-gray-100 py-8'>
        <div className='container mx-auto px-4'>
          <h2 className='font-bold mb-8 text-3xl text-center'>Featured Products</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}