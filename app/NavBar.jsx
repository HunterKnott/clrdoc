'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageLink from './PageLink';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { logout } from './logout/actions';
import { createClient } from '@/utils/supabase/client';

export default function Navbar({ options }) {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const listLinks = options.map((option, index) =>
        <PageLink
            key={index}
            text={option === "App" ? "Home" : option}
            path={option === "App" ? "../" : `./${option.toLowerCase()}`}
        />
    );

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        async function getUser() {
            const supabase = createClient()
    
            // This should be changed because the get is throwing an error
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
              console.log('No user');
            } else {
                setUser(data.user);
            }
        }
        getUser();
    }, [])

    return (
        // <header className="flex justify-between items-center h-24 w-full px-4 pt-6 z-30 bg-gray-200">
        <header className="flex flex-row md:gap-64 justify-center items-center h-16 w-full px-4 py-6 z-30 bg-gray-200 fixed shadow-md">
            {!menuOpen ?
                <div className='flex flex-row gap-4'>
                    <h1 className="w-full text-3xl font-bold text-blue-700">Clrdoc</h1>
                    <img src="Images/ClrDocIconTransparent.png" alt="Icon" className="w-[30px]" />
                </div>
                : <h1></h1>
            }
            <ul className="hidden md:flex">
                <nav className='flex space-x-10 px-10 py-4'>
                    {listLinks}
                </nav>
                {/* <li>
                    {user ? (
                        <form action={logout}>
                            <button
                                type="submit"
                                className="bg-blue-500 w-[100px] rounded-md font-medium text-gray-200 p-4 hover:bg-blue-600 transition duration-300"
                                onClick={() => window.location.reload()}
                            >
                                Logout
                            </button>
                        </form>
                    ) : (
                        <Link href={'./login'}>
                            <button className="bg-blue-500 w-[80px] rounded-md font-medium text-gray-200 p-4 hover:bg-blue-600 transition duration-300">Login</button>
                        </Link>
                    )}
                </li> */}
            </ul>
            <div onClick={toggleMenu} className="block md:hidden">
                {menuOpen ? <AiOutlineClose size={20} className='ml-64' /> : <AiOutlineMenu size={20} className='ml-24' />}
            </div>
            <div className={menuOpen ? "fixed left-0 top-0 w-[60%] h-full bg-white border-r border-r-gray-900 ease-in-out duration-500 z-50" : "fixed left-[-100%]"}>
                <h1 className="w-full text-3xl font-bold text-blue-700 m-4">Clrdoc</h1>
                <ul className="uppercase p-4">
                    <nav className='flex flex-col gap-6 items-start px-4 pb-6 border-y divide-y'>
                        {listLinks}
                    </nav>
                    <li className="p-4 border-b border-gray-600">
                        {/* {user ? (
                            <form action={logout}>
                                <button
                                    type="submit"
                                    onClick={() => window.location.reload()}
                                >
                                LOGOUT</button>
                            </form>
                        ) : (
                            <Link href={'./login'}>Login</Link>
                        )} */}
                    </li>
                </ul>
            </div>
        </header>
    )
}