import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TmdbService } from '../core/services/tmdb.service';
import { NavigationStateService } from '../core/services/navigation-state.service';
import { Movie, Actor } from '../core/models/movie.model';
import { debounceTime, distinctUntilChanged, finalize, switchMap, catchError, takeUntil, filter } from 'rxjs/operators';
import { Observable, of, Subject, forkJoin, EMPTY } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() searchResults = new EventEmitter<{movies: Movie[], actors: Actor[], searchCleared?: boolean}>();
  searchControl = new FormControl('');
  movies: Movie[] = [];
  actors: Actor[] = [];
  loading = false;
  hasSearched = false;
  error = false;
  
  // Subject for unsubscribing from observables when component is destroyed
  private destroy$ = new Subject<void>();
  
  // Throttling properties
  private lastSearchTime = 0;
  private readonly THROTTLE_TIME = 1000; // 1 second

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private navigationState: NavigationStateService
  ) { }

  ngOnInit(): void {
    this.setupSearch();
    
    // Restore search query if available
    const state = this.navigationState.getMovieHubState();
    if (state.searchQuery) {
      this.searchControl.setValue(state.searchQuery, { emitEvent: false });
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    // Add debounce to search input
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500), // Wait 500ms after the user stops typing
      distinctUntilChanged(),
      filter(query => !!query && query.trim().length >= 2)// Only search if at least 2 characters
    ).subscribe(query => {
      console.log('Search input debounced:', query);
    });
  }

  onSearch(): void {
    const now = Date.now();
    const query = this.searchControl.value;
    
    // Check if we're within the throttle window
    if (now - this.lastSearchTime < this.THROTTLE_TIME) {
      console.log('Search throttled');
      return;
    }
    
    // Don't trigger a new search if already loading or if query is empty
    if (this.loading) {
      console.log('Search skipped - already loading');
      return;
    }
    
    if (query && query.trim() !== '') {
      console.log('Executing search for:', query);
      this.lastSearchTime = now;
      this.loading = true;
      this.hasSearched = true;
      this.error = false;
      
      forkJoin({
        movies: this.tmdbService.searchMovies(query),
        actors: this.tmdbService.searchActors(query)
      }).pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = true;
          this.movies = [];
          this.actors = [];
          console.error('Search error:', error);
          return EMPTY;
        }),
        finalize(() => this.loading = false)
      ).subscribe(results => {
        console.log('Search results received:', 
          results.movies.results.length, 'movies,', 
          results.actors.results.length, 'actors');
        this.movies = results.movies.results;
        this.actors = results.actors.results;
        // Save search query to state
        this.navigationState.saveMovieHubState({
          searchQuery: query
        });
        
        this.searchResults.emit({
          movies: this.movies,
          actors: this.actors,
          searchCleared: false
        });
      });
    } else {
      console.log('Search skipped - empty query');
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.resetSearch();
    
    // Clear search query from state
    this.navigationState.saveMovieHubState({
      searchQuery: ''
    });
    
    // Emit a special signal to indicate search was cleared (not just empty results)
    this.searchResults.emit({
      movies: [],
      actors: [],
      searchCleared: true
    });
  }

  private resetSearch(): void {
    this.movies = [];
    this.actors = [];
    this.hasSearched = false;
    this.error = false;
  }
  
  navigateToDiscovery(): void {
    this.router.navigate(['/movie-hub']);
  }
}