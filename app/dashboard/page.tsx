import HeaderAuth from "@/components/header-auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Use the headers function directly
export default async function Dashboard() {
  const supabase = createClient();

  // Use headers() to get the headers
  const headers = new Headers(); // Create a Headers object to simulate header retrieval
  const host = headers.get('host') || ''; // Access the 'host' header

  // Handle the 'www' prefix
  const parts = host.split('.');
  let hostname = host.split(':')[0]; // Handle port if exists
  if (parts[0] === 'www') {
    hostname = parts.slice(1).join('.'); // Remove 'www' from hostname
  }


  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const fetchTenant = async () => {
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('name', hostname)
      .single();
    
    if (error || !tenant) {
      console.error("Tenant not found:", error?.message);
      return null; // Return null if tenant is not found
    }
    
    return tenant; // Return the tenant data
  };

  // Fetch the tenant data
  const tenant = await fetchTenant();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <HeaderAuth />
      {tenant ? (
        <div>
          <h2 className="font-bold text-2xl mb-4">Tenant Details</h2>
          <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(tenant, null, 2)}
          </pre>
        </div>
      ) : (
        <div>
          <h2 className="font-bold text-2xl mb-4">Error</h2>
          <p>Tenant not found.</p>
        </div>
      )}
    </div>
  );
}
