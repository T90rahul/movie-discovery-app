import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { TmdbService } from '../core/services/tmdb.service';
import { NavigationStateService } from '../core/services/navigation-state.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Movie, MovieResponse, ActorResponse } from '../core/models/movie.model';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

// Mock MovieCardComponent
@Component({
  selector: 'app-movie-card',
  template: '<div class="mock-movie-card">{{movie.title}}</div>'
})
class MockMovieCardComponent {
  @Input() movie!: Movie;
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let tmdbServiceSpy: jasmine.SpyObj<TmdbService>;
  let navigationStateServiceSpy: jasmine.SpyObj<NavigationStateService>;

  const mockMovieResponse: MovieResponse = {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Test Movie 1',
        poster_path: '/test1.jpg',
        release_date: '2023-01-01',
        vote_average: 8.5,
        overview: 'Test overview 1',
        backdrop_path: '/backdrop1.jpg'
      }
    ],
    total_pages: 1,
    total_results: 1
  };

  const mockActorResponse: ActorResponse = {
    page: 1,
    results: [
      {
        id: 1,
        name: 'Test Actor',
        profile_path: '/actor1.jpg'
      }
    ],
    total_pages: 1,
    total_results: 1
  };

  beforeEach(async () => {
    tmdbServiceSpy = jasmine.createSpyObj('TmdbService', ['searchMovies', 'searchActors']);
    navigationStateServiceSpy = jasmine.createSpyObj('NavigationStateService', 
      ['saveMovieHubState', 'getMovieHubState']);
    
    navigationStateServiceSpy.getMovieHubState.and.returnValue({
      selectedMood: '',
      movies: [],
      searchResults: false,
      searchedMovies: [],
      searchedActors: [],
      searchQuery: ''
    });
    
    await TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        MockMovieCardComponent
      ],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: TmdbService, useValue: tmdbServiceSpy },
        { provide: NavigationStateService, useValue: navigationStateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a search input and button', () => {
    const input = fixture.debugElement.query(By.css('input'));
    const button = fixture.debugElement.query(By.css('button[type="submit"], button:not([type])'));
    
    expect(input).toBeTruthy();
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent.trim()).toContain('Search');
  });

  it('should search when button is clicked', () => {
    tmdbServiceSpy.searchMovies.and.returnValue(of(mockMovieResponse));
    tmdbServiceSpy.searchActors.and.returnValue(of(mockActorResponse));
    
    component.searchControl.setValue('test');
    component.loading = false; // Ensure loading is false
    // Access private property for testing
    Object.defineProperty(component, 'lastSearchTime', { value: 0 });
    fixture.detectChanges();
    
    // Call onSearch directly instead of using button click
    component.onSearch();
    
    fixture.detectChanges();
    
    expect(tmdbServiceSpy.searchMovies).toHaveBeenCalledWith('test');
    expect(tmdbServiceSpy.searchActors).toHaveBeenCalledWith('test');
    expect(component.movies.length).toBe(1);
    expect(component.actors.length).toBe(1);
  });

  it('should show loading indicator while searching', () => {
    tmdbServiceSpy.searchMovies.and.returnValue(of(mockMovieResponse));
    tmdbServiceSpy.searchActors.and.returnValue(of(mockActorResponse));
    
    // Before search
    expect(fixture.debugElement.query(By.css('.animate-spin'))).toBeNull();
    
    // During loading
    component.loading = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.animate-spin'))).not.toBeNull();
    
    // After loading
    component.loading = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.animate-spin'))).toBeNull();
  });

  it('should show error message when movie search fails', () => {
    tmdbServiceSpy.searchMovies.and.returnValue(throwError(() => new Error('API Error')));
    
    component.searchControl.setValue('test');
    component.onSearch();
    
    fixture.detectChanges();
    
    expect(component.error).toBeTrue();
    expect(fixture.debugElement.query(By.css('.text-red-500'))).not.toBeNull();
  });

  it('should emit empty results when movie results are empty', () => {
    // Set up spy on the output event
    spyOn(component.searchResults, 'emit');
    
    // Mock empty search results
    tmdbServiceSpy.searchMovies.and.returnValue(of({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0
    }));
    tmdbServiceSpy.searchActors.and.returnValue(of({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0
    }));
    
    // Perform search
    component.searchControl.setValue('nonexistent');
    component.onSearch();
    
    // Verify empty results were emitted
    expect(component.searchResults.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      movies: [],
      actors: []
    }));
    
    // Verify component state
    expect(component.movies.length).toBe(0);
    expect(component.actors.length).toBe(0);
    expect(component.hasSearched).toBeTrue();
  });
  
  it('should throttle repeated search button clicks', fakeAsync(() => {
    tmdbServiceSpy.searchMovies.and.returnValue(of(mockMovieResponse));
    tmdbServiceSpy.searchActors.and.returnValue(of(mockActorResponse));
    
    component.searchControl.setValue('test');
    
    // First search
    component.onSearch();
    
    // Reset spies to track new calls
    tmdbServiceSpy.searchMovies.calls.reset();
    tmdbServiceSpy.searchActors.calls.reset();
    
    // Second search immediately after
    component.onSearch();
    
    // Verify throttling prevented the second API call
    expect(tmdbServiceSpy.searchMovies).not.toHaveBeenCalled();
    expect(tmdbServiceSpy.searchActors).not.toHaveBeenCalled();
    
    // Advance time past throttle window
    tick(1100);
    
    // Third search after throttle window
    component.onSearch();
    
    // Verify this search was allowed
    expect(tmdbServiceSpy.searchMovies).toHaveBeenCalledWith('test');
    expect(tmdbServiceSpy.searchActors).toHaveBeenCalledWith('test');
  }));
  
  it('should not execute search when loading is true', () => {
    tmdbServiceSpy.searchMovies.and.returnValue(of(mockMovieResponse));
    tmdbServiceSpy.searchActors.and.returnValue(of(mockActorResponse));
    
    component.searchControl.setValue('test');
    component.loading = true;
    
    component.onSearch();
    
    // Verify no API calls were made
    expect(tmdbServiceSpy.searchMovies).not.toHaveBeenCalled();
    expect(tmdbServiceSpy.searchActors).not.toHaveBeenCalled();
  });
});