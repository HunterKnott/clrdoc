'use client';

import React, { useEffect, useState, MouseEvent } from 'react';
import Link from 'next/link';
import PageLink from './PageLink';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

interface NavbarProps {
  options: string[];
  logoText?: string;
  logoImage?: string;
  hoverColor?: string;
}

export default function Navbar({ options = [""], logoText = "ClrDoc", logoImage = "/Images/ClrDocIconTransparent.png", hoverColor = "#4338ca" }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAboutClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const solutionsSection = document.getElementById('clrdoc-solutions');
    if (solutionsSection) {
      solutionsSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();

      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.log('No user');
      } else {
        setUser(data.user);
      }
    }
    getUser();
  }, []);

  const listLinks = options.map((option, index) => (
    <PageLink
      key={index}
      text={option === "App" ? "Home" : option}
      path={option === "App" ? "/" : `/${option.toLowerCase()}`}
      hoverColor={hoverColor}
    />
  ));

  return (
    <header className="flex flex-row justify-between items-center h-[76px] w-full px-6 md:px-12 lg:px-24 py-6 z-30 bg-gray-200 fixed shadow-md">
      <div>
        <Link href="../" className="flex flex-row gap-4 items-center">
          <h1 className="text-3xl font-bold text-blue-700">{logoText}</h1>
          <img 
            src={logoImage} 
            alt="Icon" 
            className={logoImage === "/Images/ClrDocIconTransparent.png" ? "w-[40px]" : "w-[150px]"} 
          />
        </Link>
      </div>
      <nav className="hidden md:flex space-x-10">
        {listLinks}
      </nav>
      <div onClick={toggleMenu} className="block md:hidden">
        {menuOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <div className={menuOpen ? "fixed left-0 top-0 w-[60%] h-full bg-white border-r border-r-gray-900 ease-in-out duration-500 z-50" : "fixed left-[-100%]"}>
        <div className="flex flex-row gap-4 items-center m-4">
          <h1 className="text-3xl font-bold text-blue-700">{logoText}</h1>
          <img 
            src={logoImage} 
            alt="Icon" 
            className={logoImage === "/Images/ClrDocIconTransparent.png" ? "w-[40px]" : "w-[150px]"} 
          />
        </div>
        <ul className="uppercase p-4">
          <nav className="flex flex-col gap-6 items-start px-4 pb-6 border-y divide-y">
            {listLinks}
          </nav>
        </ul>
      </div>
    </header>
  );
}
