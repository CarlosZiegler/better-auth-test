import { betterFetch } from "@better-fetch/fetch";
import { Session } from "better-auth";
import { NextRequest, NextResponse } from "next/server";
// import { verifySession } from "./lib/auth/dal";
// import { Session } from "better-auth";
// import { betterFetch } from "@better-fetch/fetch";
// import { headers } from "next/headers";
// import { Session } from "./lib/auth-types";
// import { auth } from "./lib/auth";

export default async function authMiddleware(request: NextRequest) {
  const cookie = request.headers.get("cookie");

  console.log("cookie", cookie);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
