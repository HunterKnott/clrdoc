'use client';

// import { createSupabaseServerComponentClient } from '@/lib/supabase/server';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

export default function ProviderSignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleSignIn = async () => {
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.log(error);
        }
        return router.push('/');
    };

    return (
        <div>
            <form onSubmit={handleSignIn}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

// export default async function ProviderAuth() {
//     const {
//         data: { session },
//         error,
//     } = await createSupabaseServerComponentClient().auth.getSession();

//     const user = session?.user;

//     // return <>{user ? <LogoutButton /> : <LoginButton />}</>;
//     return (
//         <div className="flex w-full">
//             <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center"><LoginButton /></div>
//             {/* <div className="divider divider-horizontal">OR</div>
//             <div className="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">content</div> */}
//         </div>
//     )
// }