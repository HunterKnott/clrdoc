import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';


export function middleware(req) {

  // if (isProtectedRoute(req)) auth().protect();

  const url = req.nextUrl;

  // Get hostname (e.g., 'hunter.com', 'test.hunter.com')
  const hostname = req.headers.get('host');
  const currentHost = hostname.split('.')[0];

  if (currentHost === 'keeneyefamilyvision') {
    return NextResponse.rewrite(`/keeneyefamilyvision/${req.nextUrl.pathname}`);
  }

  return NextResponse.next();

  // if (!currentHost) {
  //   // Continue to the next Middleware or serve the root content
  //   return NextResponse.next();
  // }

  // // Fetch tenant-specific data based on the hostname
  // const response = await readSiteDomain(currentHost);

  // if (!response || !response.length) {
  //   // Continue to next middleware or serve the root content
  //   return NextResponse.next();
  // }

  // const site_id = response[0].site_id;
  // const tenantSubdomain = response[0]?.site_subdomain;
  // const mainDomain = response[0]?.site_custom_domain;

  // // Determine which domain to use for rewriting
  // const rewriteDomain = tenantSubdomain // || mainDomain

  // console.log("Hostname:", hostname);
  // console.log("Current Host:", currentHost);
  // console.log("Rewrite Domain:", rewriteDomain);

  // if (rewriteDomain) {
  //   // Add the subdomain to the request headers
  //   const requestHeaders = new Headers(req.headers);
  //   requestHeaders.set('x-subdomain', currentHost);
    
  //   // Rewrite the URL to the tenant-specific path, using the site_id
  //   const rewrittenUrl = new URL(`/${site_id}${pathname}`, req.url);

  //   // Add subdomain as a URL parameter
  //   rewrittenUrl.searchParams.set('subdomain', currentHost);

  //   return NextResponse.rewrite(rewrittenUrl, {
  //     request: {
  //       headers: requestHeaders,
  //     },
  //   });
  // }

  // If no rewrite domain is found, continue to the next middleware
  // return await updateSession(request)
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
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/:path*',
  ],
}