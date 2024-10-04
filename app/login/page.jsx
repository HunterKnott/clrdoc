// // 'use client';

// // import { login, signup } from './actions';
// // import { OAuthButtons } from './oauth-buttons';
// import { createClient } from '@supabase/supabase-js';
// // import { useState, useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// import NavBar from '../NavBar';
// import AuthButton from "../components/header-auth";
// import { signInAction } from "@/app/actions";
// import Input from '../components/Input';

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// const allowedSubdomains = {
//   keeneye: 'hunterknott00@gmail.com', // Will replace with actual doctor later
// }

// export default function LoginPage() {
//   // const [email, setEmail] = useState('');
//   // const [password, setPassword] = useState('');
//   // const [error, setError] = useState(null);
//   // const [session, setSession] = useState(null);
//   // const router = useRouter();

//   return (
//     <main className="flex min-h-screen flex-col gap-6 items-center justify-center bg-gray-100">
//       {/* <NavBar options={["App", "About", "Providers", "Contact"]}/> */}
//       <div className="flex flex-col md:flex-row md:gap-12">
//         <div className="flex flex-col gap-4 w-80">
//           <h1 className="font-bold md:text-3xl sm:text-3xl text-2xl">Provider Authentication</h1>
//           <p>Opening opportunities for optometrists to do a world of good</p>
//         </div>
//         <form
//           className="flex flex-col gap-4 max-w-lg bg-white py-10 px-5 m-auto w-full mt-10"
//           // onSubmit={handleLogin}
//         >
//           <div className="flex flex-col md:flex-row gap-4 max-w-xl m-auto">
//             <div className="">
//               <label htmlFor="email">Email:</label>
//               {/* <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="border-gray-400 border-2 rounded p-3 md:text-xl w-full"
//                 required
//               /> */}
//               <Input name="email" placeholder="name@example.com" required />
//             </div>
//             <div className="">
//               <label htmlFor="password">Password:</label>
//               {/* <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="border-gray-400 border-2 rounded p-3 md:text-xl w-full"
//                 required
//               /> */}
//               <Input type="password" name="password" placeholder="Your password" required/>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4">
//             <button
//               className="bg-blue-500 w-full rounded-md font-medium text-gray-200 py-3 hover:bg-blue-600 transition duration-300"
//               type="submit"
//               formAction={signInAction}
//             >
//               Login
//             </button>
//             {/* <OAuthButtons /> */}
//             <AuthButton/>
//           </div>
//         </form>
//       </div>
//     </main>
//   )
// }

import { signInAction } from "@/app/actions";
import Link from "next/link";

export default function Login({ searchParams }) {
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/login">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <label htmlFor="email">Email</label>
        <input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <label htmlFor="password">Password</label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <button type="submit" formAction={signInAction}>
          Sign in
        </button>
      </div>
    </form>
  );
}
