import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOutAction}>
        <button type="submit">
          Sign out
        </button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <button>
        <Link href="/login">Sign in</Link>
      </button>
    </div>
  );
}
