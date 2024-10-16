import HeaderAuth from "@/components/header-auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";
import Content from "./content";

// This page is meant to be a server-side component that handles the Supabase login session
// Most other page content is in the Content component
export default async function Dashboard({ searchParams }: { searchParams?: { section?: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const selectedSection = decodeURIComponent(searchParams?.section || "STYLE");

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar/>
      <div className="flex flex-col flex-grow">
        <HeaderAuth />
        <section className="flex-1 p-6 ml-auto mt-[80px]">
          <Content initialSection={selectedSection} />
        </section>
      </div>
    </main>
  );
}