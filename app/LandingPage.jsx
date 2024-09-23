'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from './Footer';
import { FaChartLine, FaGlasses, FaUserPlus, FaLaptopMedical, FaLock } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client';

const SolutionItem = ({ icon: Icon, text, subtext }) => (
  <div className='flex flex-col items-center max-w-xs'>
    <div className='w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4'>
      <Icon className='text-6xl text-white'/>
    </div>
    <h3 className='font-bold text-xl mb-2 text-center text-gray-800'>{text}</h3>
    <p className='text-center text-gray-600'>{subtext}</p>
  </div>
);

export default function Home() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
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
      icon: FaChartLine, 
      text: "Boost Your Revenue", 
      subtext: "Increase sales by offering your glasses online 24/7. Our platform enables you to reach customers beyond your physical store hours, significantly expanding your earning potential."
    },
    { 
      icon: FaLaptopMedical, 
      text: "Seamless Integration", 
      subtext: "Easily connects with your existing Practice Management System and inventory management."
    },
    { 
      icon: FaUserPlus, 
      text: "Reach More Customers", 
      subtext: "Attract new clients with the convenience of online shopping. Our platform makes it easy for customers to browse and purchase glasses from the comfort of their homes."
    },
    { 
      icon: FaGlasses, 
      text: "Expand Your Inventory", 
      subtext: "Sell your in-store stock or partner with distributors for a wider selection. Give more options to your customers and save inventory space."
    },
  ];

  return (
    <main className="bg-gradient-to-b from-gray-100 to-gray-200 flex min-h-screen flex-col items-center">
      <div className="w-full relative md:flex md:flex-row" style={{ background: '#EEF1F2' }}>
        {/* Image container - visible on small screens */}
        <div className='md:hidden w-full h-screen absolute inset-0'>
          <img src="Images/FrontImage.jpg" alt="ClrDoc Sample" className="w-full h-full object-cover opacity-50" />
        </div>
        {/* Text content */}
        <div className='w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center md:items-start px-8 md:px-16 text-center md:text-left relative z-10 bg-[#EEF1F2]/80 md:bg-transparent'>
          <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl mb-6 text-gray-800">Sell Your Glasses Online</h1>
          <p className="font-medium text-xl sm:text-2xl md:text-3xl mb-8 text-gray-600">ClrDoc.com lets you sell <strong className="text-blue-600">your</strong> glasses on <strong className="text-blue-600">your</strong> website.</p>
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
          <img src="Images/FrontImage.jpg" alt="ClrDoc Sample" className="w-full h-full object-cover" />
        </div>
      </div>
      <div id="clrdoc-solutions" className='w-full text-center py-16 bg-white'>
        <h2 className='font-bold mb-12 px-4 text-4xl md:text-5xl text-gray-800'>ClrDoc Solutions</h2>
        <div className='flex flex-col md:flex-row justify-center gap-12 px-4 md:px-8 max-w-7xl mx-auto'>
          {solutions.map((solution, index) => (
            <SolutionItem key={index} {...solution} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}