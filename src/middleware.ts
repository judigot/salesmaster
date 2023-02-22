// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: "/api/:resource*",
};

export function middleware(request: NextRequest, res: NextResponse) {
  const isAuth = true;
  if (isAuth) {
    return new NextResponse(
      JSON.stringify({ success: true, message: "Authentication successful" }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } else {
    return new NextResponse(
      JSON.stringify({ success: true, message: "Authentication successful" }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }
}
