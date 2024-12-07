'use client';

import { Provider } from '@supabase/supabase-js';
import { FaGoogle } from 'react-icons/fa';
import { createClient } from '../../../utils/supabase/client';
// import { oAuthSignIn } from './actions';

export function OAuthButtons() {
    const supabase = createClient();

    const handleOAuthSignIn = async (provider: 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider as Provider,
        });
        if (error) {
            console.error("OAuth sign-in error:", error.message);
        }
    };

    return (
        <div className="mt-4">
          <button
            className="flex items-center justify-center gap-2 py-2 border rounded-md w-full"
            onClick={() => handleOAuthSignIn('google')}
          >
            <FaGoogle />
            Login with Google
          </button>
        </div>
      );
}