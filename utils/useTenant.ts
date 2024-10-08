import { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define the Tenant interface
interface Tenant {
  id: string;
  name: string;
  email: string;
  created_at: string;
  preferences: {
    accent_color: string;
    primary_color: string;
    header_logo: string;
    footer_logo: string;
  };
  // Add other tenant fields as needed
}

export function useTenant() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTenantInfo = async () => {
      setIsLoading(true);
      const supabase: SupabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];

      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('name', subdomain)
          .single();

        if (error) throw error;
        console.log("Here is the tenant", data); // Move the console.log here
        setTenant(data as Tenant);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error("Error fetching tenant data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantInfo();
  }, []);

  return { tenant, isLoading, error };
}
