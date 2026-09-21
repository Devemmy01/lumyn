import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { slugifyTag } from "@/lib/tags";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token && request.nextUrl.pathname !== "/admin/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Legacy ?tag= listings (e.g. ?tag=product+design, ?tag=Product-Design) collapse
  // onto the one canonical /journal/tag/<slug> path, permanently.
  if (request.nextUrl.pathname === "/journal") {
    const rawTag = request.nextUrl.searchParams.get("tag");
    if (rawTag) {
      const slug = slugifyTag(rawTag);
      const url = request.nextUrl.clone();
      url.pathname = `/journal/tag/${slug}`;
      url.searchParams.delete("tag");
      url.searchParams.delete("q");
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/journal"],
};
