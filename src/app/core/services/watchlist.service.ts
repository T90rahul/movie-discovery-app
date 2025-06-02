import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private watchlistKey = 'movie-watchlist';
  private watchlistSubject = new BehaviorSubject<Movie[]>([]);
  private maxWatchlistSize = 100; // Limit to prevent localStorage overflow
  
  // watchlist count
  private watchlistCount$ = this.watchlistSubject.pipe(
    map(movies => movies.length)
  );
  
  constructor() {
    this.loadWatchlist();
  }

  private loadWatchlist(): void {
    try {
      const storedWatchlist = localStorage.getItem(this.watchlistKey);
      if (storedWatchlist) {
        const watchlist = JSON.parse(storedWatchlist);
        if (Array.isArray(watchlist)) {
          this.watchlistSubject.next(watchlist);
        } else {
          throw new Error('Stored watchlist is not an array');
        }
      }
    } catch (e) {
      console.error('Error loading watchlist from localStorage', e);
      this.watchlistSubject.next([]);
      // Reset corrupted data
      localStorage.removeItem(this.watchlistKey);
    }
  }

  private saveWatchlist(watchlist: Movie[]): void {
    try {
      localStorage.setItem(this.watchlistKey, JSON.stringify(watchlist));
      this.watchlistSubject.next(watchlist);
    } catch (e) {
      console.error('Error saving watchlist to localStorage', e);
    }
  }

  getWatchlist(): Observable<Movie[]> {
    return this.watchlistSubject.asObservable();
  }

  getWatchlistCount(): number {
    return this.watchlistSubject.getValue().length;
  }
  
  getWatchlistCount$(): Observable<number> {
    return this.watchlistCount$;
  }

  addToWatchlist(movie: Movie): void {
    if (!movie || !movie.id) {
      console.error('Cannot add invalid movie to watchlist');
      return;
    }
    
    const currentWatchlist = this.watchlistSubject.getValue();
    
    if (currentWatchlist.length >= this.maxWatchlistSize) {
      console.warn('Watchlist size limit reached');
      return;
    }
    
    if (!this.isInWatchlist(movie.id)) {
      this.saveWatchlist([...currentWatchlist, movie]);
    }
  }

  removeFromWatchlist(movieId: number): void {
    if (!movieId) return;
    
    const currentWatchlist = this.watchlistSubject.getValue();
    const updatedWatchlist = currentWatchlist.filter(movie => movie.id !== movieId);
    this.saveWatchlist(updatedWatchlist);
  }

  toggleWatchlist(movie: Movie): void {
    if (!movie || !movie.id) return;
    
    if (this.isInWatchlist(movie.id)) {
      this.removeFromWatchlist(movie.id);
    } else {
      this.addToWatchlist(movie);
    }
  }

  isInWatchlist(movieId: number): boolean {
    if (!movieId) return false;
    return this.watchlistSubject.getValue().some(movie => movie.id === movieId);
  }

  clearWatchlist(): void {
    this.saveWatchlist([]);
  }
}