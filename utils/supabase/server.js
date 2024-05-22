import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// // Used in server actions and route handlers
// export function createSupabaseServerClient(component = false) {
//     cookies().getAll();
//     return createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//         {
//             cookies: {
//                 get(name) {
//                     return getCookie(name, { cookies });
//                 },
//                 set(name, value, options) {
//                     if (component) return;
//                     setCookie(name, value, { cookies, ...options });
//                 },
//                 remove(name, options) {
//                     if (component) return;
//                     deleteCookie(name, { cookies, ...options });
//                 },
//             },
//         }
//     );
// }

// // Used in server components
// export function createSupabaseServerComponentClient() {
//     // cookies.getAll();
//     // return createSupabaseServerClient(true);
//     return createSupabaseServerClient({
//         supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
//         supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//         cookieOptions: {
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Lax',
//             maxAge: 60 * 60 * 24 * 7, // 1 week
//         },
//     });
// }

// // Used in middleware
// export function createSupabaseReqResClient(req, res) {
//     cookies().getAll();
//     return createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//         {
//             cookies: {
//                 get(name) {
//                     return getCookie(name, { req, res });
//                 },
//                 set(name, value, options) {
//                     setCookie(name, value, { req, res, ...options });
//                 },
//                 remove(name, options) {
//                     setCookie(name, "", { req, res, ...options });
//                 },
//             },
//         }
//     );
// }