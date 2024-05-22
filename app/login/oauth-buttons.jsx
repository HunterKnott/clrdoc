'use client';

import { Provider } from '@supabase/supabase-js';
import { FaGoogle } from 'react-icons/fa';
import { oAuthSignIn } from './actions';

export function OAuthButtons() {
    const oAuthProviders = [{
        providerName: 'google',
        displayName: 'Google',
        icon: <FaGoogle className="size-5" />
    },
    ];

    return (
        <>
            {oAuthProviders.map((provider) => (
                <button
                    key={provider.providerName}
                    className="flex items-center justify-center gap-2 py-2 border rounded-md"
                    onClick={async () => {
                        await oAuthSignIn(provider.providerName);
                    }}
                >
                    {provider.icon}
                    Login with {provider.displayName}
                </button>
            ))}
        </>
    );
}