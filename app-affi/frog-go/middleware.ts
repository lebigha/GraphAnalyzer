import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// RATE LIMITING CONFIGURATION
// ============================================================================

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 requests per minute per IP

// In-memory store for rate limiting (resets on server restart)
// For production at scale, consider using Redis or Upstash
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// ============================================================================
// SECURITY HEADERS
// ============================================================================

const securityHeaders = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getClientIP(request: NextRequest): string {
    // Check various headers for the real IP (behind proxies/load balancers)
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
        return realIP;
    }

    // Fallback to a generic identifier
    return "unknown";
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
        // First request from this IP
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    if (now > record.resetTime) {
        // Window expired, reset counter
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    // Increment counter
    record.count++;

    if (record.count > MAX_REQUESTS_PER_WINDOW) {
        return true;
    }

    return false;
}

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

// ============================================================================
// MIDDLEWARE
// ============================================================================

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply rate limiting to API routes
    if (pathname.startsWith("/api/")) {
        const ip = getClientIP(request);

        // Check rate limit
        if (isRateLimited(ip)) {
            console.warn(`[SECURITY] Rate limit exceeded for IP: ${ip}`);
            return new NextResponse(
                JSON.stringify({
                    error: "Trop de requêtes. Réessayez dans une minute.",
                    code: "RATE_LIMIT_EXCEEDED"
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "Retry-After": "60",
                        ...securityHeaders
                    }
                }
            );
        }
    }

    // Continue with the request and add security headers
    const response = NextResponse.next();

    // Add security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

// ============================================================================
// MATCHER CONFIG
// ============================================================================

export const config = {
    matcher: [
        // Apply to all routes except static files and _next
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
