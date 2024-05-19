import { createSupabaseServerComponentClient } from '@/lib/supabase/server-client';
import DetailsButtonClient from './DetailsButtonClient';

export default async function DetailsButtonServer() {
    const {
        data: { session },
        error,
    } = await createSupabaseServerComponentClient().auth.getSession();

    return <DetailsButtonClient session={session} />;
}