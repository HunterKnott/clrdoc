'use client';
import React, { useState, useEffect } from 'react';

export default function Template({ children }) {
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
    )
}