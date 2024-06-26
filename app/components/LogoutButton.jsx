'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return <button className="btn btn-primary btn-lg" onClick={handleLogout}>Logout</button>;
}