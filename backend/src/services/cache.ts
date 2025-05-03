interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly TTL = 3600000; // 1 hour

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cache = new Cache();