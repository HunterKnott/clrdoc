import React from 'react';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className='flex items-center justify-center w-full py-4 md:py-8' style={{backgroundColor: '#0C0526'}}>
            <div className='flex flex-row gap-4 items-center'>
                <h1 className="text-2xl md:text-4xl font-bold text-white">ClrDoc</h1>
                <Image src="/Images/ClrDocIcon.png" alt="Icon" width={60} height={60} className="w-[30px] md:w-[60px]" />
            </div>
        </footer>
    )
}