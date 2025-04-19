import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Just return the request without any modification
  // This should stop the middleware error without breaking anything
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match minimal amount of paths to avoid issues
    '/api/:path*',
  ],
};
