import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";

const { auth } = NextAuth(authConfig);

// Removed "/books" from publicRoutes and will handle it separately
export default auth(async (req): Promise<Response | void> => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  console.log(nextUrl.pathname);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  // Check if the path starts with /books and optionally follows by / and any character except for / (to match dynamic bookId)
  const isBooksRoute = /^\/books(\/[^\/]+)?$/.test(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || isBooksRoute;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", "/loginRequests"],
};
