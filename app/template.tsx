'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 20}px)`,
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
