'use client';

import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

// Store the API key in a separate variable
const apiKey = '4046ecc3-bc75-4bdf-ba48-e11ef8c8a0c1';
const apiUrl = `http://testapi.framesdata.com:80/api/brands?auth=${apiKey}`;

interface Tenant {
  id: string;
  name: string;
  email: string;
  brands: string[];
}

interface Brand {
  BrandName: string;
}

export default function Options() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [tenantBrands, setTenantBrands] = useState<string[]>([]);
  const [apiBrands, setApiBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      let domain: string;
      if (parts[0] === 'www') {
        domain = parts[1];
      } else {
        domain = parts[0];
      }
      setDomain(domain);
    }
  }, [isMounted]);

  useEffect(() => {
    const fetchTenant = async () => {
      if (domain) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('name', domain)
          .single();
        
        if (error) {
          console.error('Error fetching tenant:', error);
        } else {
          setTenant(data);
          setTenantBrands(data?.brands || []);

          const preSelectedBrands = data?.brands.map((brandName: string) => ({
            BrandName: brandName
          })) || [];
          setSelectedBrands(preSelectedBrands);
        }
        setLoading(false);
      }
    };

    fetchTenant();
  }, [domain]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(apiUrl);
        setApiBrands(response.data.Brands);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch brands');
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredBrands = apiBrands.filter(brand =>
    brand.BrandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectBrand = (brand: any) => {
    if (!selectedBrands.includes(brand)) {
      setSelectedBrands(prevSelectedBrands => [...prevSelectedBrands, brand]);
    }
  };

  const removeBrand = (brand: any) => {
    setSelectedBrands(prevSelectedBrands => prevSelectedBrands.filter(b => b !== brand));
  };

  const handleSaveChanges = async (): Promise<void> => {
    setLoading(true);
    setMessage('');

    if (tenant) {
      if (selectedBrands.length === 0 && tenantBrands.length === 0) {
        setMessage('No brands selected.');
        setLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 5000);
        return;
      }

      const newBrandsToAdd = selectedBrands.filter(
        (brand) => !tenantBrands.includes(brand.BrandName)
      );

      const removedBrands = tenantBrands.filter(
        (tenantBrand) => !selectedBrands.some((brand) => brand.BrandName === tenantBrand)
      );

      if (newBrandsToAdd.length === 0 && removedBrands.length === 0) {
        setMessage('No new brands to add or remove.');
        setLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 5000);
        return;
      }

      const updatedBrands = tenantBrands
        .filter((tenantBrand) => !removedBrands.includes(tenantBrand))
        .concat(newBrandsToAdd.map(brand => brand.BrandName));

      const supabase = createClient();
      const { error } = await supabase
        .from('tenants')
        .update({ brands: updatedBrands })
        .eq('id', tenant.id);
      
      if (error) {
        if (error.code === '42501') {
          // RLS Permission denied
          setMessage('You do not have the necessary permissions to perform this  action.');
        } else {
          console.error('Error updating tenant preferences:', error);
          setMessage('An unexpected error occured. Please try again.');
        }
      } else {
        console.log('Preferences updated successfully');
        setMessage('Your changes have been saved');

        setTimeout(() => {
          setMessage('');
        }, 5000);

        setTenantBrands(updatedBrands);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-6 bg-gray-200 border border-gray-600 rounded-xl p-4 my-2 ml-2">
      {/* Dropdown Section */}
      <div className="flex-1 relative" ref={dropdownRef}>
        <h1 className="text-gray-800 text-2xl font-bold my-1">Select your Brands</h1>

        {/* Dropdown Button */}
        <div className={`dropdown relative ${isOpen ? 'mb-40' : ''}`}>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="dropbtn bg-white border border-gray-400 rounded-md p-2 w-full text-left"
          >
            Select brands
          </button>

          {/* Dropdown Content */}
          {isOpen && (
            <div className="dropdown-content absolute z-10 bg-white border border-gray-400 w-full max-h-40 overflow-y-auto mt-1 rounded-md p-2 shadow-lg">
              <input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-2 p-1 border border-gray-300 rounded-md"
              />
              <ul>
                {filteredBrands.map((brand, index) => (
                  <li
                    key={index}
                    onClick={() => selectBrand(brand)}
                    className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                  >
                    {brand.BrandName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Save Changes Button */}
        <div className='flex flex-col'>
          <button
            className={`mt-4 ${loading ? 'bg-blue-700' : 'bg-blue-500'} text-white px-4 rounded h-12`}
            onClick={() => handleSaveChanges()}
            disabled={loading}
          >
            {loading ? 'Saving changes...' : 'Save changes'}
          </button>
          {message && <p className='text-green-600 font-semibold mt-2'>{message}</p>}
        </div>
      </div>

      {/* Selected Brands Section */}
      <div className="flex flex-col items-start space-y-2">
        {selectedBrands.length > 0 && (
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">Selected Brands:</h2>
            <div className="flex flex-col gap-2">
              {selectedBrands.map((brand, index) => (
                <div
                  key={index}
                  className="bg-gray-300 text-gray-800 border border-gray-500 rounded-md p-2 flex items-center w-full max-w-xs"
                >
                  {brand.BrandName}
                  <button
                    onClick={() => removeBrand(brand)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &#x2715;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
