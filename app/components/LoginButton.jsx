'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export default function LoginButton(props) {
    const supabase = createSupabaseBrowserClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback?next=${props.nextUrl  || ''}`,
            },
        });
    };

    return <button className="btn btn-primary btn-lg" onClick={handleLogin}>Login</button>;
}