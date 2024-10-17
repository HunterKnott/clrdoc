import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from '../../NavBar';
import Footer from '../../Footer';
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Login({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 items-center justify-between bg-gray-100">
      <Navbar options={["App", "About", "Contact"]} />
      <div className="flex flex-col items-center bg-white px-8 py-16 rounded shadow-md w-full max-w-lg mt-[80px] md:mt-[126px]">
        <h1 className="text-2xl font-bold mb-4">Provider Login</h1>
        <form className="w-full flex flex-col gap-4">
          {/* <p className="text-sm text-foreground">
            Don't have an account?{" "}
            <Link className="text-foreground font-medium underline" href="/sign-up">
              Sign up
            </Link>
          </p> */}
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              placeholder="you@example.com"
              className="border border-gray-300 p-2 rounded"
              required
            />
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              className="border border-gray-300 p-2 rounded"
              required
            />
            <SubmitButton pendingText="Signing In..." formAction={signInAction}>
              Sign in
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
}
