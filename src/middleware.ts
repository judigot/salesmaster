// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: "/api/:resource*",
};

export function middleware(request: any, res: NextResponse) {
  console.log("Middleware");
}
