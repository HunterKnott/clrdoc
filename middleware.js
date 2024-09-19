import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';


export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host');
  const currentHost = hostname.split('.')[0];

  console.log("URL:", url.toString());
  console.log("Hostname:", hostname);
  console.log("Current Host:", currentHost);

  if (currentHost === 'keeneyefamilyvision' && !url.pathname.startsWith('/keeneyefamilyvision')) {
    console.log('Rewriting to:', `/keeneyefamilyvision${req.nextUrl.pathname}`);
    const rewrittenUrl = new URL(`/keeneyefamilyvision${url.pathname}`, url);
    return NextResponse.rewrite(rewrittenUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}