import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(req) {
  try {
    const token = await getToken({ req });
    const reqHeader = new Headers(req.headers);
    reqHeader.set("Authorization", token?.email);
    return NextResponse.next({
      request: {
        headers: reqHeader,
      },
    });

    // req.next()
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: [
    "/",
    "/profile",
    "/teams",
    "/teams/(.*)",
    "/api/user",
    "/api/team",
    "/api/quiz",
    "/api/quiz/(.*)",
    "/api/team/(.*)",
    "/api/user/(.*)",
  ],
};
