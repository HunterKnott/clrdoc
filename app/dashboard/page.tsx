import HeaderAuth from "@/components/header-auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Settings from "./settings";

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 items-center bg-gray-100">
      <HeaderAuth />
      <Settings />
    </main>
  );
}
