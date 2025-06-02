import { Injectable } from '@angular/core';
import { MovieResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MoodCacheService {
  private cache = new Map<number, { data: MovieResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  constructor() {}

  /**
   * Get cached movie data for a specific genre/mood
   * @param genreId The genre ID to retrieve
   * @returns The cached MovieResponse or null if not found/expired
   */
  get(genreId: number): MovieResponse | null {
    const cachedItem = this.cache.get(genreId);

    if (!cachedItem) {
      return null;
    }

    // Check if cache has expired
    if (Date.now() - cachedItem.timestamp > this.CACHE_DURATION) {
      this.cache.delete(genreId);
      return null;
    }

    return cachedItem.data;
  }

  /**
   * Store movie data for a specific genre/mood
   * @param genreId The genre ID to cache
   * @param data The movie response data to cache
   */
  set(genreId: number, data: MovieResponse): void {
    this.cache.set(genreId, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if a genre is cached and not expired
   * @param genreId The genre ID to check
   * @returns True if the genre is cached and not expired
   */
  has(genreId: number): boolean {
    const cachedItem = this.cache.get(genreId);
    if (!cachedItem) {
      return false;
    }

    const isValid = Date.now() - cachedItem.timestamp <= this.CACHE_DURATION;
    return isValid;
  }

  // Clear all cached data
  clear(): void {
    this.cache.clear();
  }

  //Get the number of items in the cache
  size(): number {
    return this.cache.size;
  }

  //Get all cached genre IDs
  getCachedGenres(): number[] {
    return Array.from(this.cache.keys());
  }
}
