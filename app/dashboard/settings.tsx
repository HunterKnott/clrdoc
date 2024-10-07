'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { createClient } from '@/utils/supabase/client';
import { HexColorPicker } from "react-colorful";

interface Tenant {
    id: string;
    name: string;
    email: string;
    preferences: {
      accent_color: string;
      primary_color: string;
      text_color: string;
      header_logo: string;
      footer_logo: string;
      favicon: string;
    };
  }

  export default function Settings() {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [domain, setDomain] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [mainColor, setMainColor] = useState<string>(tenant?.preferences.primary_color || '#fff');
    const [accentColor, setAccentColor] = useState<string>(tenant?.preferences.accent_color || '#fff');
    const [textColor, setTextColor] = useState<string>(tenant?.preferences.text_color || '#000');
    const [showPicker, setShowPicker] = useState<{
        main: boolean,
        accent: boolean,
        text: boolean,
    }>({ main: false, accent: false, text: false });
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const hostname = window.location.hostname;
            const parts = hostname.split('.');
            let domain: string;
            if (parts[0] === 'www') {
                domain = parts[1];
            } else {
                domain = parts[0];
            }
            setDomain(domain);
        }
    }, [isMounted]);

    useEffect(() => {
        const fetchTenant = async () => {
            if (domain) {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('tenants')
                    .select('*')
                    .eq('name', domain)
                    .single();
                
                if (error) {
                    console.error('Error fetching tenant:', error);
                } else {
                    setTenant(data);
                    setMainColor(data?.preferences.primary_color);
                    setAccentColor(data?.preferences.accent_color);
                    setTextColor(data?.preferences.text_color);
                }
                setIsLoading(false);
            }
        };

        fetchTenant();
    }, [domain]);

    const handleColorChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (color: string) => {
        setter(color);
    }

    const handleSaveChanges = async (): Promise<void> => {
        setLoading(true);
        setMessage('');

        if (tenant) {
            const updatedPreferences = {
                primary_color: mainColor,
                accent_color: accentColor,
                text_color: textColor,
            };

            const supabase = createClient();
            const { error } = await supabase
                .from('tenants')
                .update({ preferences: { ...tenant.preferences, ...updatedPreferences } })
                .eq('id', tenant.id);
            
            if (error) {
                console.error('Error updating tenant preferences:', error);
            } else {
                console.log('Preferences updated successfully');
                setMessage('Your changes have been saved')

                setTimeout(() => {
                    setMessage('');
                }, 5000);
            }
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col gap-6 bg-gray-200 border border-gray-600 rounded-xl p-4 my-2">
            <h1 className="text-gray-800 text-2xl font-bold my-1">Your Preferences</h1>
            
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left Area for Name and Email */}
                <ul className="flex-1">
                    <li className="text-gray-800 text-lg my-1">Name: {tenant?.name}</li>
                    <li className="text-gray-800 text-lg my-1">Email: {tenant?.email}</li>
                </ul>

                {/* Right Area for Color Preferences */}
                <ul className="flex-1 flex flex-col md:flex-row gap-4">
                    <li className="flex flex-col items-center">
                        <div
                            className="w-16 h-16 rounded-xl border border-gray-400 cursor-pointer"
                            style={{ backgroundColor: mainColor || "#fff" }}
                            onClick={() => setShowPicker({ ...showPicker, main: !showPicker.main })}
                        ></div>
                        <span className="text-gray-800 text-lg">Main Color</span>
                        {showPicker.main && (
                            <>
                                <HexColorPicker color={mainColor || '#fff'} onChange={handleColorChange(setMainColor)} />
                                <input
                                    type="text"
                                    value={mainColor || ''}
                                    onChange={(e) => setMainColor(e.target.value)}
                                    className="mt-2 p-1 border rounded text-center"
                                    placeholder="#FFFFFF"
                                />
                            </>
                        )}
                    </li>
                    <li className="flex flex-col items-center">
                        <div
                            className="w-16 h-16 rounded-xl border border-gray-400 cursor-pointer"
                            style={{ backgroundColor: accentColor || '#fff' }}
                            onClick={() => setShowPicker({ ...showPicker, accent: !showPicker.accent })}
                        ></div>
                        <span className="text-gray-800 text-lg">Accent Color</span>
                        {showPicker.accent && (
                            <>
                                <HexColorPicker color={accentColor || '#fff'} onChange={handleColorChange(setAccentColor)} />
                                <input
                                    type="text"
                                    value={accentColor || ''}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="mt-2 p-1 border rounded text-center"
                                    placeholder="#FFFFFF"
                                />
                            </>
                        )}
                    </li>
                    <li className="flex flex-col items-center">
                        <div
                            className="w-16 h-16 rounded-xl border border-gray-400 cursor-pointer"
                            style={{ backgroundColor: textColor || '#fff' }}
                            onClick={() => setShowPicker({ ...showPicker, text: !showPicker.text })}
                        ></div>
                        <span className="text-gray-800 text-lg">Text Color</span>
                        {showPicker.text && (
                            <>
                                <HexColorPicker color={textColor || '#fff'} onChange={handleColorChange(setTextColor)} />
                                <input
                                    type="text"
                                    value={textColor || ''}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="mt-2 p-1 border rounded text-center"
                                    placeholder="#FFFFFF"
                                />
                            </>
                        )}
                    </li>
                </ul>
            </div>

            {/* Section for Icons */}
            <div className="flex flex-col gap-4">
                <h2 className="text-gray-800 text-xl font-bold">Logos and Icons</h2>
                <ul className="flex flex-col md:flex-row gap-4 justify-center">
                    <li className="flex flex-col items-center flex-1">
                        <img src={tenant?.preferences.header_logo} alt="Header Logo" className="w-30 h-20 object-cover" />
                        <span className="text-gray-800 text-lg">Header Logo</span>
                    </li>
                    <li className="flex flex-col items-center flex-1">
                        <img src={tenant?.preferences.footer_logo} alt="Footer Logo" className="w-30 h-20 object-cover" />
                        <span className="text-gray-800 text-lg">Footer Logo</span>
                    </li>
                    <li className="flex flex-col items-center flex-1">
                        <img src={tenant?.preferences.favicon} alt="Favicon" className="w-12 h-12 object-cover" />
                        <span className="text-gray-800 text-lg">Favicon</span>
                    </li>
                </ul>
            </div>

            {/* Save Changes Button */}
            <button
                className={`mt-4 ${loading ? 'bg-blue-700' : 'bg-blue-500'} text-white py-2 px-4 rounded`}
                onClick={handleSaveChanges}
                disabled={loading}
            >
                {loading ? 'Saving changes...' : 'Save changes'}
            </button>
            {message && <p className="text-green-600 font-semibold mt-2">{message}</p>}
        </div>
    );
};