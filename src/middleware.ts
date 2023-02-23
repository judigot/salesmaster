import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function AuthMiddleware(req: NextRequest, res: NextResponse) {}

export default function middleware(req: NextRequest, res: NextResponse) {
  return AuthMiddleware(req, res);
}
