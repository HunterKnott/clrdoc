import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

export default async function ConsolePage() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    return (
        <div>
            <h1>Welcome to the Console Page</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}