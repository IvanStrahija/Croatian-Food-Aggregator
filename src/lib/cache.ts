interface CacheEntry<T> {
  value: T
  expiresAt: number
}

class InMemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  set<T>(key: string, value: T, ttlSeconds: number = 900): void {
    const expiresAt = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { value, expiresAt })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.value as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries (run periodically)
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new InMemoryCache()

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 5 * 60 * 1000)
}
