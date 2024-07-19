import React from 'react';
import LinkButton from './LinkButton';

export default function Footer() {
    return (
        <div className='flex flex-col gap-12 items-center h-72 w-full p-8 bg-indigo-900'>
            <div className='flex flex-row gap-6 justify-center'>
                <LinkButton />
                <LinkButton />
                <LinkButton />
                <LinkButton />
            </div>
            <div className='flex flex-row gap-4'>
                <h1 className="w-full text-4xl font-bold text-white">Clrdoc</h1>
                <img src="Images/ClrDocIcon.png" alt="Icon" className="w-[60px]" />
            </div>
        </div>
    )
}