'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client';
import LandingPage from './LandingPage';
import NavBar from './NavBar';
import Banner from './Banner';
import Footer from './Footer';
import Link from 'next/link';
import ShimmerImage from './../components/ShimmerImage';
import './globals.css';
import { fetchFrameImage, fetchStyleConfigurations, StyleConfigurationsResponse, StyleConfiguration } from '@/utils/framesData';

interface Tenant {
  id: string;
  name: string;
  preferences: {
    accent_color: string;
    primary_color: string;
    text_color: string;
    header_logo: string;
    footer_logo: string;
    favicon: string;
  };
}

interface Product {
  id: string;
  name: string;
  base_price: number;
  variants: Variant[];
}

interface Variant {
  id: string;
  color: string;
  image_url: string;
  gallery_images: GalleryImage[];
}

interface GalleryImage {
  image_url: string;
}

interface ProductCardProps {
  product: Product;
  selectedTenant: Tenant;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, selectedTenant }) => {
  const firstVariant = product.variants[0];
  const thumbnailImage = firstVariant?.gallery_images[0]?.image_url || firstVariant?.image_url;
  const tenantString = selectedTenant ? encodeURIComponent(JSON.stringify(selectedTenant)) : '';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/product/${product.id}`}
      className={`flex flex-col items-center w-full max-w-[20rem] mx-auto bg-white shadow-md rounded overflow-hidden transition-shadow duration-300 border-2`}
      style={{
        borderColor: isHovered ? selectedTenant.preferences.accent_color : 'transparent',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-48 relative">
        <ShimmerImage 
          src={`${thumbnailImage}?impolicy=OO_ratio&width=768`}
          alt={product.name} 
          className="w-full h-full"
        />
      </div>
      <div className='p-4'>
        <h3
          className='text-lg font-semibold text-center mb-2'
          style={{ color: selectedTenant?.preferences.text_color || 'inherit' }}
        >
          {product.name}
        </h3>
        <p
          className='text-center mb-2'
          style={{ color: selectedTenant?.preferences.text_color || 'inherit' }}
        >
          {firstVariant?.color}
        </p>
        <p className='text-xl font-bold text-center'>${product.base_price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

interface FrameCardProps {
  frame: StyleConfiguration;
  selectedTenant: Tenant;
}

const FrameCard: React.FC<FrameCardProps> = ({ frame, selectedTenant }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const configurationsWithImages = frame.Configurations.filter(
        config => config.ConfigurationImageName !== ''
      );

      console.log('Checking if there are any images ...')
      if (configurationsWithImages.length > 0) {
        console.log('Configurations with images for', frame.StyleName, ':', configurationsWithImages);
        try {
          const url = await fetchFrameImage(configurationsWithImages[0].ConfigurationFPC);
          setImageUrl(url);
        } catch (error) {
          console.error('Error loading frame image:', error);
        }
      } else {
        console.log('No configurations with images for', frame.StyleName);
        console.log('All configurations:', frame.Configurations);
      }
    };

    loadImage();
  }, [frame]);

  return (
    <Link
      href={`/product/${frame.StyleFramesMasterID}`}
      className={`flex flex-col items-center w-full max-w-[20rem] mx-auto bg-white shadow-md rounded overflow-hidden transition-shadow duration-300 border-2`}
      style={{
        borderColor: isHovered ? selectedTenant.preferences.accent_color : 'transparent',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-48 relative bg-gray-200 flex items-center justify-center">
        {imageUrl ? (
          <ShimmerImage 
            src={imageUrl}
            alt={frame.StyleName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold">{frame.StyleName}</span>
        )}
      </div>
      <div className='p-4'>
        <h3
          className='text-lg font-semibold text-center mb-2'
          style={{ color: selectedTenant?.preferences.text_color || 'inherit' }}
        >
          {frame.StyleName}
        </h3>
        <p
          className='text-center mb-2'
          style={{ color: selectedTenant?.preferences.text_color || 'inherit' }}
        >
          {frame.BrandName}
        </p>
        <p className='text-xl font-bold text-center'>${frame.Configurations[0]?.CompletePrice || 'N/A'}</p>
      </div>
    </Link>
  );
};

export default function Home() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSubdomain, setIsSubdomain] = useState<boolean>(false);
  const [isValidSubdomain, setIsValidSubdomain] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [styleConfigurations, setStyleConfigurations] = useState<StyleConfigurationsResponse | null>(null);
  const [frames, setFrames] = useState<StyleConfiguration[]>([]);

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    let domain: string;
    
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
          setSelectedTenant(data[0]);
        }

        // Validate the subdomain
        if (isSubdomain) {
          const isValid = data.some(tenant => tenant.name.toLowerCase() === domain.toLowerCase());
          setIsValidSubdomain(isValid);
        }
      }
      setIsLoading(false);
    };

    fetchTenants();

    // Fetch style configurations
    const fetchConfigurations = async () => {
      try {
        const brandId = 8234; // OAKLEY brand ID
        const data = await fetchStyleConfigurations(brandId);
        setStyleConfigurations(data);
        console.log('Style Configurations:', data);
      } catch (error) {
        console.error('Error fetching style configurations:', error);
      }
    };

    fetchConfigurations();

    const fetchFrames = async () => {
      try {
        const brandId = 8234; // Gucci brand ID
        const data = await fetchStyleConfigurations(brandId);
        setFrames(data.StyleConfigurations);
        console.log('Frames:', data.StyleConfigurations);
      } catch (error) {
        console.error('Error fetching frames:', error);
      }
    };

    fetchFrames();
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

  useEffect(() => {
    const faviconElement = document.querySelector('link[rel="icon"]');
    const hostnameParts = window.location.hostname.split('.');
    let domain: string;
    if (hostnameParts[0] === 'www') {
      domain = hostnameParts[1];
    } else {
      domain = hostnameParts[0];
    }
    const useDefaultFavicon = domain === 'localhost' || domain === 'clrdoc';
    if (!useDefaultFavicon) {
      console.log("Running")
      const faviconUrl = useDefaultFavicon ? '/favicon.ico' : selectedTenant?.preferences?.favicon;
      if (faviconElement) {
        (faviconElement as HTMLLinkElement).href = faviconUrl || '';
      } else {
        const newFaviconElement = document.createElement('link');
        newFaviconElement.rel = 'icon';
        newFaviconElement.href = faviconUrl!;
        document.head.appendChild(newFaviconElement);
      }
    }
  }, [selectedTenant]);

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTenantId = e.target.value;
    const tenant = tenants.find(t => t.id === selectedTenantId);
    if (tenant) {
      setSelectedTenant(tenant);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFrames = frames.filter(frame =>
    frame.StyleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <main className="loading-page">
        <div className="spinner"></div>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <div>
      {isSubdomain ? (
        isValidSubdomain ? (
          <main className="flex flex-col min-h-screen" id="subdomain-page">
            <NavBar
              options={["App", "About", "Contact"]}
              // options={["Login"]}
              logoText=""
              logoImage={selectedTenant?.preferences ? selectedTenant.preferences.header_logo : ''}
              hoverColor={selectedTenant?.preferences ? selectedTenant.preferences.accent_color : ''}
            />
            <div className="pt-16 pb-8 md:pb-16">
              <Banner
                background={selectedTenant?.preferences ? selectedTenant.preferences.primary_color : undefined}
                bannerText='Welcome to KeenEye Family Vision'
                logoImage=''
              />
              <div className="max-w-screen-xl mx-auto"></div>
            </div>
            <div id="products-section" className="md:pt-8">
              <div className="max-w-screen-xl mx-auto px-4">
                <h2
                  className="text-3xl font-bold text-center mb-6"
                  style={{ color: selectedTenant?.preferences.text_color || 'inherit' }}
                >
                  Featured Frames
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
                  {filteredFrames.map((frame) => (
                    <FrameCard key={frame.StyleFramesMasterID} frame={frame} selectedTenant={selectedTenant!} />
                  ))}
                </div>
              </div>
            </div>
            <Footer
              background={selectedTenant?.preferences ? selectedTenant.preferences.primary_color : undefined}
              logoText=""
              logoImage={selectedTenant?.preferences ? selectedTenant.preferences.footer_logo : ''}
            />
          </main>
        ) : (
          <main className="flex flex-col min-h-screen items-center justify-center bg-gray-100" id="error-page">
            <h1 className="text-3xl font-bold text-red-600">Error: Invalid subdomain</h1>
          </main>
        )
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
