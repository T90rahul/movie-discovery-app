import { Component, OnInit, OnDestroy } from '@angular/core';
import { TmdbService } from '../core/services/tmdb.service';
import { Movie, Actor, MovieResponse } from '../core/models/movie.model';
import { finalize } from 'rxjs/operators';
import { MoodCacheService } from '../core/services/mood-cache.service';
import { NavigationStateService } from '../core/services/navigation-state.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-movie-hub',
  templateUrl: './movie-hub.component.html',
  styleUrls: ['./movie-hub.component.scss']
})
export class MovieHubComponent implements OnInit, OnDestroy {
  // Mood-based discovery
  movies: Movie[] = [];
  loading = false;
  error = false;
  selectedMood = '';
  cacheStatus = '';
  
  // Search results handling
  searchResults = false;
  searchedMovies: Movie[] = [];
  searchedActors: Actor[] = [];
  
  // Throttling properties
  private lastMoodSelectionTime = 0;
  private readonly THROTTLE_TIME = 1000; // 1 second

  // Genre IDs for different moods
  readonly moodGenres = {
    'Feel Good': 35, // Comedy
    'Action Fix': 28, // Action
    'Mind Benders': 9648 // Mystery
  };

  constructor(
    private tmdbService: TmdbService,
    private moodCache: MoodCacheService,
    private navigationState: NavigationStateService
  ) { }

  ngOnInit(): void {
    // Check if we have saved state
    if (this.navigationState.hasMovieHubState()) {
      console.log('Restoring saved state');
      const state = this.navigationState.getMovieHubState();
      
      this.selectedMood = state.selectedMood;
      this.movies = state.movies;
      this.searchResults = state.searchResults;
      this.searchedMovies = state.searchedMovies;
      this.searchedActors = state.searchedActors;
      
      if (this.selectedMood) {
        this.cacheStatus = 'Restored from saved state';
      }
    }
  }
  
  ngOnDestroy(): void {
    // Save current state when navigating away
    this.saveCurrentState();
  }
  
  private saveCurrentState(): void {
    console.log('Saving current state');
    this.navigationState.saveMovieHubState({
      selectedMood: this.selectedMood,
      movies: this.movies,
      searchResults: this.searchResults,
      searchedMovies: this.searchedMovies,
      searchedActors: this.searchedActors
    });
  }

  selectMood(mood: string): void {
    const now = Date.now();
    
    // Check if we're within the throttle window and it's the same mood
    if (now - this.lastMoodSelectionTime < this.THROTTLE_TIME && mood === this.selectedMood) {
      return;
    }
    
    // Don't trigger a new selection if already loading
    if (this.loading) {
      return;
    }
    
    console.log('Selecting mood:', mood);
    this.lastMoodSelectionTime = now;
    this.selectedMood = mood;
    this.loading = true;
    this.error = false;
    this.searchResults = false;
    
    const genreId = this.moodGenres[mood as keyof typeof this.moodGenres];
    
    // Check if we have this mood cached
    if (this.moodCache.has(genreId)) {
      // Use cached data
      const cachedData = this.moodCache.get(genreId);
      this.movies = cachedData!.results;
      this.loading = false;
      this.cacheStatus = 'Loaded from cache';
      console.log('Loaded movies from cache for mood:', mood);
    } else {
      // Fetch from API
      this.cacheStatus = 'Loaded from API';
      console.log('Fetching movies from API for mood:', mood);
      this.tmdbService.getMoviesByGenre(genreId)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (response) => {
            this.movies = response.results;
            // Store in cache
            this.moodCache.set(genreId, response);
            // Save state
            this.saveCurrentState();
            console.log('Received API response for mood:', mood);
          },
          error: (err) => {
            this.error = true;
            this.movies = [];
            console.error('Error loading movies for mood:', mood, err);
          }
        });
    }
  }

  // Handle search results from SearchComponent
  onSearchResultsReceived(results: {movies: Movie[], actors: Actor[], searchCleared?: boolean}): void {
    if (results) {
      this.searchedMovies = results.movies;
      this.searchedActors = results.actors;
      
      // If search was cleared, go back to mood selection
      if (results.searchCleared) {
        this.searchResults = false;
      } else {
        // Normal search results (even if empty)
        this.searchResults = true;
        this.selectedMood = '';
      }
      
      // Save state when search results change
      this.saveCurrentState();
    }
  }
  
  // Reset search results display
  resetSearchResults(): void {
    this.searchResults = false;
  }
}