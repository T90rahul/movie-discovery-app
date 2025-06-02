import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TmdbService } from '../core/services/tmdb.service';
import { WatchlistService } from '../core/services/watchlist.service';
import { Movie, MovieDetails, Actor, Video } from '../core/models/movie.model';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movieId!: number;
  movie?: MovieDetails;
  cast: Actor[] = [];
  similarMovies: Movie[] = [];
  videos: Video[] = [];
  trailerUrl?: string;
  
  activeTab: 'trailer' | 'cast' | 'similar' = 'trailer';
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private tmdbService: TmdbService,
    private watchlistService: WatchlistService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.movieId = +id;
        this.loadMovieDetails();
      }
    });
  }

  loadMovieDetails(): void {
    this.loading = true;
    this.error = false;
    
    forkJoin({
      details: this.tmdbService.getMovieDetails(this.movieId),
      credits: this.tmdbService.getMovieCredits(this.movieId).pipe(catchError(() => of({ cast: [], crew: [] }))),
      videos: this.tmdbService.getMovieVideos(this.movieId).pipe(catchError(() => of({ results: [] }))),
      similar: this.tmdbService.getSimilarMovies(this.movieId).pipe(catchError(() => of({ results: [], page: 1, total_pages: 0, total_results: 0 })))
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (data) => {
        this.movie = data.details;
        this.cast = data.credits.cast.slice(0, 10); // Get top 10 cast members
        this.similarMovies = data.similar.results.slice(0, 8); // Get top 8 similar movies
        this.videos = data.videos.results;
        
        // Find a trailer
        const trailer = this.videos.find(video => 
          video && typeof video.site === 'string' && typeof video.type === 'string' &&
          video.site.toLowerCase() === 'youtube' && 
          (video.type.toLowerCase() === 'trailer' || video.type.toLowerCase() === 'teaser')
        );
        
        if (trailer && typeof trailer.key === 'string') {
          this.trailerUrl = `https://www.youtube.com/embed/${encodeURIComponent(trailer.key)}`;
        }
      },
      error: () => {
        this.error = true;
      }
    });
  }

  setActiveTab(tab: 'trailer' | 'cast' | 'similar'): void {
    this.activeTab = tab;
  }

  toggleWatchlist(): void {
    if (this.movie) {
      this.watchlistService.toggleWatchlist(this.movie);
    }
  }

  isInWatchlist(): boolean {
    return this.movie ? this.watchlistService.isInWatchlist(this.movie.id) : false;
  }

  getMoviePosterUrl(path: string | null): string {
    if (!path) {
      return 'assets/images/imgNotAvailable.png';
    }
    return this.tmdbService.getMoviePosterUrl(path);
  }

  getMovieBackdropUrl(path: string | null): string {
    if (!path) return '';
    return `${this.tmdbService.getMoviePosterUrl(path, 'original')}`;
  }
  
  // Navigate back to the previous page
  goBack(): void {
    this.location.back();
  }
}