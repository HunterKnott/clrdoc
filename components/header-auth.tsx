import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className="flex items-center justify-center md:justify-between gap-4 px-6 py-4 bg-gray-200 fixed top-0 left-0 w-full shadow-md z-40">
      <Link href="../" className="flex flex-row gap-4 items-center">
        <h1 className="text-3xl font-bold text-blue-700">ClrDoc</h1>
        <img
          src="/Images/ClrDocIconTransparent.png"
          alt="Icon"
          className="w-[40px]"
        />
      </Link>
      <form action={signOutAction}>
        <Button type="submit" variant={"clrdoc"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/login">Sign in</Link>
      </Button>
    </div>
  );
}
