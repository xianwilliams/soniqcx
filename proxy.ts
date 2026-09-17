import { NextResponse, type NextRequest } from "next/server";

const staticPrefixes = ["/_next/", "/legacy/_next/", "/assets/", "/cdn-cgi/"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (staticPrefixes.some((prefix) => pathname.startsWith(prefix)) || pathname.includes(".")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/index.html" : `${pathname.replace(/\/$/, "")}/index.html`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/:path*"],
};
