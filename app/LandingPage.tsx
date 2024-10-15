'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Footer from './Footer';
import { FaStore, FaGlasses, FaCog, FaClock, FaLock } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client';

interface SolutionItemProps {
  icon: React.ElementType;
  text: string;
  subtext: string;
}

const SolutionItem: React.FC<SolutionItemProps> = ({ icon: Icon, text, subtext }) => (
  <div className='flex flex-col items-center max-w-xs mx-auto'>
    <div className='w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4'>
      <Icon className='text-4xl text-white' />
    </div>
    <h3 className='font-bold text-xl mb-2 text-center text-gray-800 h-14 flex items-center'>{text}</h3>
    <p className='text-center text-gray-600 h-20'>{subtext}</p>
  </div>
);

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const faviconElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  //   if (faviconElement) {
  //     faviconElement.href = '/favicon.ico';
  //   } else {
  //     const link = document.createElement('link');
  //     link.rel = 'icon';
  //     link.href = '/favicon.ico';
  //     document.head.appendChild(link);
  //   }
  // }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();

    const { data: existingData, error: existingError } = await supabase
      .from('Waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      setMessage('Error checking waitlist. Please try again.');
      setIsLoading(false);
      return;
    }

    if (existingData) {
      setMessage('You\'re already on our waitlist. We\'ll be in touch soon!');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('Waitlist')
      .insert([{ email: email }]);

    if (error) {
      setMessage('Error adding to waitlist. Please try again.');
    } else {
      setMessage('Thank you for joining our waitlist!');
      setEmail('');
    }
    setIsLoading(false);
  };

  const solutions = [
    { 
      icon: FaStore, 
      text: "Digital window shopping", 
      subtext: "Your digital showcase drives in-store traffic."
    },
    { 
      icon: FaGlasses, 
      text: "See more, sell more", 
      subtext: "Present your entire catalog to turn browsers into buyers."
    },
    { 
      icon: FaCog, 
      text: "Easy setup", 
      subtext: "Select your brands, and we'll list the glasses for you."
    },
    { 
      icon: FaClock, 
      text: "Never lose another after-hours sale", 
      subtext: "Your online store is always open."
    },
  ];

  return (
    <main className="bg-gradient-to-b from-gray-100 to-gray-200 flex min-h-screen flex-col items-center">
      <div className="w-full relative md:flex md:flex-row" style={{ background: '#EEF1F2' }}>
        {/* Image container - visible on small screens */}
        <div className='md:hidden w-full h-screen absolute inset-0'>
          <img src="Images/FrontImage.png" alt="ClrDoc Sample" className="w-full h-full object-cover opacity-50" />
        </div>
        {/* Text content */}
        <div className='w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center md:items-start px-8 md:px-16 text-center md:text-left relative z-10 bg-[#EEF1F2]/80 md:bg-transparent'>
          <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl mb-6 text-gray-800">Sell Your Glasses Online</h1>
          <p className="font-medium text-xl sm:text-2xl md:text-3xl mb-4 text-gray-600">ClrDoc.com lets you sell <strong className="text-blue-600">your</strong> glasses on <strong className="text-blue-600">your</strong> website.</p>
          
          {/* New risk-free revenue message */}
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-r-lg shadow-md">
            <p className="font-semibold text-lg">
              Risk-free revenue: If our product doesn&apos;t pay for itself, you get your money back!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border-2 border-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-full hover:bg-blue-700 transition duration-300 text-xl font-medium flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Get me started for free'
              )}
            </button>
            {message && (
              <p className="text-center text-sm font-medium text-green-600">
                {message}
              </p>
            )}
            <div className="flex items-center justify-center text-xs text-gray-500">
              <FaLock className="mr-2" />
              <p>We&apos;ll never share your information.</p>
            </div>
          </form>
        </div>
        {/* Image container - visible on medium and larger screens */}
        <div className='hidden md:block md:w-1/2 h-screen'>
          <img src="Images/FrontImage.png" alt="ClrDoc Sample" className="w-full h-full object-cover" />
        </div>
      </div>
      <div id="clrdoc-solutions" className='w-full text-center py-16 bg-white'>
        <h2 className='font-bold mb-12 px-4 text-4xl md:text-5xl text-gray-800'>Here&apos;s what we can do for you</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8 max-w-6xl mx-auto'>
          {solutions.map((solution, index) => (
            <SolutionItem key={index} {...solution} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}