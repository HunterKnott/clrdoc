'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client';
import LandingPage from './LandingPage';
import NavBar from './NavBar';
import Footer from './Footer';
import Link from 'next/link';

const ProductCard = ({ product, selectedTenant }) => {
  const firstVariant = product.variants[0];
  const thumbnailImage = firstVariant?.gallery_images[0]?.image_url || firstVariant?.image_url;
  const tenantString = encodeURIComponent(JSON.stringify(JSON.stringify(selectedTenant)));

  return (
    <Link href={`/product/${product.id}?tenant=${tenantString}`} className='product-card'>
      <img 
        src={thumbnailImage+'?impolicy=OO_ratio&width=768'}
        alt={product.name} 
        className="product-image"
      />
      <div className='product-info'>
        <h3 className='product-name'>{product.name}</h3>
        <p className='product-color'>{firstVariant?.color}</p>
        <p className='product-price'>${product.base_price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default function Home() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [isValidSubdomain, setIsValidSubdomain] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    let domain;
    
    if (parts[0] === 'www') {
      domain = parts[1];
    } else {
      domain = parts[0];
    }
    const isSubdomain = !domain.includes('clrdoc') && !domain.includes('localhost');
    setIsSubdomain(isSubdomain);
  
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
          setSelectedTenant({ id: data[0].id, name: data[0].name, preferences: data[0].preferences });
        }

        // Validate the subdomain
        if (isSubdomain) {
          const isValid = data.some(tenant => tenant.name.toLowerCase() === domain.toLowerCase());
          setIsValidSubdomain(isValid);
        }
      }
    };

    if (isSubdomain && isValidSubdomain) {
      import('./subdomain.css');
    }

    fetchTenants();
  }, [isSubdomain, isValidSubdomain]);

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
          .eq('tenant_id', selectedTenant.id)
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

  const handleTenantChange = (e) => {
    const selectedTenantId = e.target.value;
    setSelectedTenant(selectedTenantId);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isSubdomain ? (
        isValidSubdomain ? (
          <main id="subdomain-page">
            <NavBar options={["App", "About", "Contact"]} logoText="" logoImage={`${selectedTenant.preferences ? selectedTenant.preferences.header_logo : ''}`} />
            <div id="search-section">
              <div className="container">
                <div className="search-content">
                  <h1>Find Your Perfect Eyewear</h1>
                  <div className="search-controls">
                    <div className="search-input-wrapper">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                      <FaSearch className="search-icon" />
                    </div>
                    <select
                      value={selectedTenant.id || ''}
                      onChange={handleTenantChange}
                      className="tenant-select"
                    >
                      {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div id='products-section'>
              <div className='container'>
                <h2>Featured Products</h2>
                <div className='products-grid'>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} selectedTenant={selectedTenant} />
                  ))}
                </div>
              </div>
            </div>
            <Footer background="#691b33" logoText="" logoImage={`${selectedTenant.preferences ? selectedTenant.preferences.footer_logo : ''}`} />
          </main>
        ) : (
          <main id="error-page">
            <h1>Error: Invalid subdomain</h1>
          </main>
        )
      ) : (
        <LandingPage />
      )}
    </>
  );
}