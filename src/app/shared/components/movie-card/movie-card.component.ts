import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Movie } from '../../../core/models/movie.model';
import { TmdbService } from '../../../core/services/tmdb.service';
import { WatchlistService } from '../../../core/services/watchlist.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;
  
  constructor(
    private tmdbService: TmdbService,
    private watchlistService: WatchlistService
  ) { }

  ngOnInit(): void {
    if (!this.movie) {
      console.error('Movie card component: movie input is required');
      throw new Error('Movie input is required for MovieCardComponent');
    }
  }

  getMoviePosterUrl(): string {
    if (!this.movie.poster_path) {
      return 'assets/images/imgNotAvailable.png';
    }
    return this.tmdbService.getMoviePosterUrl(this.movie.poster_path);
  }

  getReleaseYear(): string {
    if (!this.movie.release_date) return 'N/A';
    return this.movie.release_date.split('-')[0];
  }

  toggleWatchlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.watchlistService.toggleWatchlist(this.movie);
  }

  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.movie.id);
  }
  
  getWatchlistLabel(): string {
    return this.isInWatchlist() ? 
      `Remove ${this.movie.title} from watchlist` : 
      `Add ${this.movie.title} to watchlist`;
  }
}