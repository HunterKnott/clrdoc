'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client';
import NavBar from './NavBar';
import Footer from './Footer';

const ProductCard = ({ product }) => (
  <div className='flex flex-col items-center max-w-xs bg-white shadow-lg rounded-lg overflow-hidden'>
    <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
    <div className='p-4'>
      <h3 className='font-bold text-xl mb-2 text-center'>{product.name}</h3>
      <p className='text-center text-gray-600 mb-2'>{product.description}</p>
      <p className='text-center text-lg font-bold'>${product.base_price.toFixed(2)}</p>
      <button className='mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300'>
        Add to Cart
      </button>
    </div>
  </div>
);

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
          .select('*')
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
      <NavBar options={["App", "About", "Contact"]} />
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
      <Footer />
    </main>
  )
}