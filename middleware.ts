import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  (request: NextRequestWithAuth) => {
    const {
      nextauth: { token },
      nextUrl,
    } = request;
    const pathname = nextUrl.pathname;

    // Restricted paths for "Admin"
    const restrictedPathsAdmin = [
      "/",
      "/signup",
      "/forgot-password",
      "/change-password",
    ];

    const isRestrictedAdmin = restrictedPathsAdmin.includes(pathname);

    // Restricted paths for "Manager"
    const restrictedPathsManager = [
      "/users",
      "/",
      "/signup",
      "/forgot-password",
      "/change-password",
    ];

    const isRestrictedManager = restrictedPathsManager.includes(pathname);

    // Restricted paths for "Staff"
    const restrictedPathsStaff = [
      "/dashboard",
      "/inventory",
      "/returns",
      "/replacements",
      "/suppliers",
      "/categories",
      "/",
      "/brands",
      "/forgot-password",
      "/change-password",
      "/payment-methods",
      "/reports",
      "/users",
    ];

    const isRestrictedStaff = restrictedPathsStaff.includes(pathname);

    // General restricted paths for unauthenticated users
    const restrictedPaths = [
      "/dashboard",
      "/inventory",
      "/sales-orders",
      "/returns",
      "/replacements",
      "/suppliers",
      "/categories",
      "/brands",
      "/payment-methods",
      "/reports",
      "/users",
    ];

    const isRestrictedPath = restrictedPaths.includes(pathname);

    // Role-based conditions
    if (token?.role === "Admin" && isRestrictedAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token?.role === "Manager" && isRestrictedManager) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token?.role === "Staff" && isRestrictedStaff) {
      return NextResponse.redirect(new URL("/sales-orders", request.url));
    }

    if (!token && isRestrictedPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard",
    "/inventory",
    "/sales-orders",
    "/returns",
    "/replacements",
    "/suppliers",
    "/categories",
    "/",
    "/brands",
    "/forgot-password",
    "/change-password",
    "/payment-methods",
    "/reports",
    "/users",
  ],
};
