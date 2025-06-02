import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { sanitizeError } from '../../shared/utils/error-utils';
import { 
  Movie, 
  MovieResponse, 
  MovieDetails, 
  ActorResponse, 
  MovieCredits, 
  Video 
} from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private baseUrl = environment.tmdbBaseUrl;
  private imageBaseUrl = environment.tmdbImageBaseUrl;
  private defaultImagePath = environment.defaultImagePath;

  constructor(private http: HttpClient) { }

  // Get movie poster URL
  getMoviePosterUrl(posterPath: string | null, size: string = 'w500'): string {
    if (!posterPath) return 'assets/no-poster.png';
    return `${this.imageBaseUrl}/${size}${posterPath}`;
  }

  // Get movies by genre
  getMoviesByGenre(genreId: number): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/discover/movie`, 
      { params: { api_key: environment.tmdbApiKey, with_genres: genreId.toString() } }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Search movies
  searchMovies(query: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/search/movie`, 
      { params: { api_key: environment.tmdbApiKey, query: query } }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Search actors
  searchActors(query: string): Observable<ActorResponse> {
    return this.http.get<ActorResponse>(
      `${this.baseUrl}/search/person`, 
      { params: { api_key: environment.tmdbApiKey, query: query } }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Get movie details
  getMovieDetails(movieId: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(
      `${this.baseUrl}/movie/${movieId}`, 
      { params: { api_key: environment.tmdbApiKey } }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Get movie videos (trailers)
  getMovieVideos(movieId: number): Observable<{results: Video[]}> {
    return this.http.get<{results: Video[]}>(
      `${this.baseUrl}/movie/${movieId}/videos`, 
      { params: { api_key: environment.tmdbApiKey } }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Get movie credits (cast & crew)
  getMovieCredits(movieId: number): Observable<MovieCredits> {
    return this.http.get<MovieCredits>(
      `${this.baseUrl}/movie/${movieId}/credits`, 
      { params: { api_key: environment.tmdbApiKey } }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Get similar movies
  getSimilarMovies(movieId: number): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/movie/${movieId}/similar`, 
      { params: { api_key: environment.tmdbApiKey } }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
  let errorMessage = 'An unknown error occurred';

  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = `Error: ${error.error.message}`;
  } else {
    // Server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }

  console.error('[MovieService] Error occurred:', sanitizeError(errorMessage));
  return throwError(() => new Error(errorMessage));
}
}