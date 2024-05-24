import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTHEN_TOKEN_KEY } from "@/apis/constants/const";
import { VerifyAuth } from "./lib/jwt";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get(AUTHEN_TOKEN_KEY)?.value; // accessing cookies using square brackets
    const url = new URL("/auth/login", request.url);

    const verifiedToken = token && (
        await VerifyAuth(token).catch(err => {
            console.log(err)
        })
    )
    if (request.nextUrl.pathname.startsWith("/auth/login") && !verifiedToken) {
        return
    }

    if (request.url.includes("/auth/login") && verifiedToken) {
        return NextResponse.redirect(new URL('/dashboards/main', request.url))
    }

    if (!verifiedToken) {
        return NextResponse.redirect(url)
    }
}

export const config = {
    // Match all URLs
    matcher: ['/dashboards/main', '/auth/login'],
};
