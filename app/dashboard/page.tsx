import HeaderAuth from "@/components/header-auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";
import Settings from "./settings";

// Dummy components for PAYMENTS and ACCOUNT sections
const PaymentsContent = () => <div>Payments settings go here.</div>;
const AccountContent = () => <div>Account settings go here.</div>;

export default async function Dashboard({ searchParams }: { searchParams?: { section?: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Determine which section to show based on the searchParams
  const selectedSection = searchParams?.section || "STYLE";

  const renderContent = () => {
    switch (selectedSection) {
      case "STYLE":
        return <Settings />;
      case "PAYMENTS":
        return <PaymentsContent />;
      case "ACCOUNT":
        return <AccountContent />;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <HeaderAuth />
        <section className="flex-1 p-6 ml-auto mt-[80px]">
          {renderContent()}
        </section>
      </div>
    </main>
  );
}
