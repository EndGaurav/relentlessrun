import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    await auth.protect({
      unauthenticatedUrl: new URL(
        `/sign-in?redirect_url=${encodeURIComponent(request.nextUrl.pathname)}`,
        request.url,
      ).toString(),
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Clerk handshake / proxy endpoints
    "/__clerk/:path*",
  ],
};