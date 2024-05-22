import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTHEN_TOKEN_KEY } from "@/apis/constants/const";

export function middleware(request: NextRequest) {
    const token = request.cookies.get(AUTHEN_TOKEN_KEY); // accessing cookies using square brackets
    const url = new URL("/auth/login", request.url);
    if (token) {
        return NextResponse.next();
    }
    return NextResponse.redirect(url);
}

export const config = {
    // Match all URLs
    matcher: "/dashboards/:path*",
};
