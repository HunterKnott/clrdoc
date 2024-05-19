// This API endpoint uses the code returned from the OAuth provider to sign in the user.
// The authenticated user is then redirected to the specified URL.
// If authentication fails, the user is redirected to an another page specified in the callback.

import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = createSupabaseServerClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-error`);
}