import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function AuthMiddleware(req: NextRequest, res: NextResponse) {}

export default function middleware(req: NextRequest, res: NextResponse) {
  const authHeader = req.headers.get("authorization");
  const accessToken = authHeader && authHeader.split(" ")[1];
  const secretToken = process.env.ACCESS_TOKEN_SECRET;
  return AuthMiddleware(req, res);
}
