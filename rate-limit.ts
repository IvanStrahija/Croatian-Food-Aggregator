interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()

  async check(
    identifier: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<{ success: boolean; remaining: number; resetAt: number }> {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    // No entry or expired window - create new
    if (!entry || now > entry.resetAt) {
      const resetAt = now + windowSeconds * 1000
      this.limits.set(identifier, { count: 1, resetAt })
      return { success: true, remaining: maxRequests - 1, resetAt }
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return { success: false, remaining: 0, resetAt: entry.resetAt }
    }

    // Increment count
    entry.count++
    return {
      success: true,
      remaining: maxRequests - entry.count,
      resetAt: entry.resetAt,
    }
  }

  reset(identifier: string): void {
    this.limits.delete(identifier)
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(key)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

// Cleanup every minute
if (typeof window === 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup()
  }, 60 * 1000)
}

// Helper function for API routes
export async function checkRateLimit(
  req: Request,
  identifier: string,
  maxRequests: number = 60,
  windowSeconds: number = 60
): Promise<Response | null> {
  const result = await rateLimiter.check(identifier, maxRequests, windowSeconds)

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetAt.toString(),
          'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}
