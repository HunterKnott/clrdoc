'use client';

import Link from 'next/link';
import { useState, MouseEventHandler } from 'react';

interface PageLinkProps {
  path?: string;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  hoverColor: string;
}

export default function PageLink({ path, text, onClick, hoverColor }: PageLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`text-gray-800 font-bold text-lg transition-colors duration-180`}
        style={{ color: isHovered ? hoverColor : 'black' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text}
      </button>
    );
  }

  return (
    <Link href={path || '#'}>
      <button
        className={`text-gray-800 font-bold text-lg transition-colors duration-180`}
        style={{ color: isHovered ? hoverColor : 'black' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text}
      </button>
    </Link>
  );
}
