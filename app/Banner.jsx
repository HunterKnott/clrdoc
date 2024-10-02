import React from 'react';

export default function Banner({ background = '#0C0526', bannerText = "ClrDoc", logoImage = "/Images/ClrDocIcon.png" }) {
    return (
        <div className='flex flex-col items-center justify-center w-full py-4 md:py-10' style={{ backgroundColor: background }}>
            <div className='flex flex-col items-center gap-4 w-full'>
                <h1 className='text-2xl md:text-4xl font-bold text-white text-center w-3/4'>{bannerText}</h1>
                {logoImage && (
                    <img
                        src={logoImage}
                        className={logoImage === "/Images/ClrDocIcon.png" ? "w-[40px] md:w-[60px]" : "w-[200px]"}
                        alt="Logo"
                    />
                )}
            </div>
            <div className="border-b border-white w-3/4 mt-8" />
        </div>
    )
}
