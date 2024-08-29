import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;
  const publicRoutes = [
    "/",
    // "/signup",
    "/login",
  ];

  if (!session && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }

  if (session && (pathname === `/login` || pathname === "/admin")) {
    return NextResponse.redirect(new URL(`/admin/home`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    // "/signup",
    "/login",
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sw.js|site.webmanifest|fonts|images|assets|icons).*)",
  ],
};
