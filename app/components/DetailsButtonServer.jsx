import { createSupabaseServerComponentClient } from '@/utils/supabase/server';
import DetailsButtonClient from './DetailsButtonClient';

export default async function DetailsButtonServer() {
    const {
        data: { session },
        error,
    } = await createSupabaseServerComponentClient().auth.getSession();

    return <DetailsButtonClient session={session} />;
}