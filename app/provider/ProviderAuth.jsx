import { createSupabaseServerComponentClient } from '@/lib/supabase/server-client';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

export default async function ProviderAuth() {
    const {
        data: { session },
        error,
    } = await createSupabaseServerComponentClient().auth.getSession();

    const user = session?.user;

    // return <>{user ? <LogoutButton /> : <LoginButton />}</>;
    return (
        <div className="flex w-full">
            <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center"><LoginButton /></div>
            {/* <div className="divider divider-horizontal">OR</div>
            <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">content</div> */}
        </div>
    )
}