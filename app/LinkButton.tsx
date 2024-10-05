'use client';

import Image from 'next/image';
import { MouseEventHandler } from 'react';

interface LinkButtonProps {
  srcPath: string;
  altText: string;
  url: string;
  position?: string; // Optional, if you don't always pass this prop
}

export default function LinkButton({ srcPath, altText, url, position }: LinkButtonProps) {
  const openUrl: MouseEventHandler<HTMLButtonElement> = () => {
    const newTab = window.open(url, '_blank');
    if (newTab) {
      newTab.focus();
    }
  };

  return (
    <div className="hover:scale-105 transition-transform duration-300">
      <button
        className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center transform transition-transform hover:bg-gradient-to-r from-gray-200 to-gray-300 duration-1000"
        onClick={openUrl}
      >
        <Image src={srcPath} alt={altText} className={position || ''} />
      </button>
    </div>
  );
}
    