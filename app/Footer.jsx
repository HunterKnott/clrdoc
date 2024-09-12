import React from 'react';

export default function Footer() {
    return (
        <footer className='flex items-center justify-center w-full py-4 md:py-8' style={{backgroundColor: '#0C0526'}}>
            <div className='flex flex-row gap-4 items-center'>
                <h1 className="text-2xl md:text-4xl font-bold text-white">ClrDoc</h1>
                <img src="Images/ClrDocIcon.png" alt="Icon" className="w-[30px] md:w-[60px]" />
            </div>
        </footer>
    )
}