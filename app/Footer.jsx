import React from 'react';
import Image from 'next/image';

export default function Footer({ background = '#0C0526', logoText = "ClrDoc", logoImage = "/Images/ClrDocIcon.png"}) {
    return (
        <footer className='flex items-center justify-center w-full py-4 md:py-8 mt-2' style={{backgroundColor: background}}>
            <div className='flex flex-row gap-4 items-center'>
                <h1 className="text-2xl md:text-4xl font-bold text-white">{logoText}</h1>
                <img
                    src={logoImage}
                    alt="Icon"
                    width={60}
                    height={60}
                    className={logoImage === "/Images/ClrDocIcon.png" ? "w-[30px] md:w-[60px]" : "w-[180px]"}
                />
            </div>
        </footer>
    )
}