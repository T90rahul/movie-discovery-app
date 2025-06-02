import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieHubComponent } from './movie-hub.component';
import { TmdbService } from '../core/services/tmdb.service';
import { MoodCacheService } from '../core/services/mood-cache.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MovieResponse } from '../core/models/movie.model';

describe('MovieHubComponent', () => {
  let component: MovieHubComponent;
  let fixture: ComponentFixture<MovieHubComponent>;
  let tmdbServiceSpy: jasmine.SpyObj<TmdbService>;
  let moodCacheSpy: jasmine.SpyObj<MoodCacheService>;

  const mockMovieResponse: MovieResponse = {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Test Movie',
        poster_path: '/test.jpg',
        overview: 'Test overview',
        release_date: '2023-01-01',
        vote_average: 8.5,
        genre_ids: [28, 35],
        backdrop_path: null
      }
    ],
    total_pages: 1,
    total_results: 1
  };

  beforeEach(async () => {
    const tmdbSpy = jasmine.createSpyObj('TmdbService', ['getMoviesByGenre']);
    const cacheSpy = jasmine.createSpyObj('MoodCacheService', ['get', 'set', 'has']);
    
    // Add missing spy for set method
    cacheSpy.set = jasmine.createSpy('set');

    await TestBed.configureTestingModule({
      declarations: [MovieHubComponent],
      providers: [
        { provide: TmdbService, useValue: tmdbSpy },
        { provide: MoodCacheService, useValue: cacheSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore child components for these tests
    }).compileComponents();

    tmdbServiceSpy = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
    moodCacheSpy = TestBed.inject(MoodCacheService) as jasmine.SpyObj<MoodCacheService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies from API when not in cache', () => {
    // Setup
    moodCacheSpy.has.and.returnValue(false);
    tmdbServiceSpy.getMoviesByGenre.and.returnValue(of(mockMovieResponse));
    
    // Execute
    component.selectMood('Action Fix');
    
    // Verify
    expect(moodCacheSpy.has).toHaveBeenCalledWith(28); // Action genre ID
    expect(tmdbServiceSpy.getMoviesByGenre).toHaveBeenCalledWith(28);
    expect(moodCacheSpy.set).toHaveBeenCalledWith(28, mockMovieResponse);
    expect(component.movies).toEqual(mockMovieResponse.results);
    expect(component.cacheStatus).toBe('Loaded from API');
    expect(component.loading).toBeFalse();
  });

  it('should load movies from cache when available', () => {
    // Setup
    moodCacheSpy.has.and.returnValue(true);
    moodCacheSpy.get.and.returnValue(mockMovieResponse);
    
    // Execute
    component.selectMood('Feel Good');
    
    // Verify
    expect(moodCacheSpy.has).toHaveBeenCalledWith(35); // Comedy genre ID
    expect(moodCacheSpy.get).toHaveBeenCalledWith(35);
    expect(tmdbServiceSpy.getMoviesByGenre).not.toHaveBeenCalled();
    expect(component.movies).toEqual(mockMovieResponse.results);
    expect(component.cacheStatus).toBe('Loaded from cache');
    expect(component.loading).toBeFalse();
  });

  it('should handle API errors', () => {
    // Setup
    moodCacheSpy.has.and.returnValue(false);
    tmdbServiceSpy.getMoviesByGenre.and.returnValue(throwError(() => new Error('API Error')));
    
    // Execute
    component.selectMood('Mind Benders');
    
    // Verify
    expect(component.error).toBeTrue();
    expect(component.movies.length).toBe(0);
    expect(component.loading).toBeFalse();
  });
  
  it('should throttle repeated mood selections', () => {
    // Setup
    moodCacheSpy.has.and.returnValue(false);
    tmdbServiceSpy.getMoviesByGenre.and.returnValue(of(mockMovieResponse));
    
    // Execute first call
    component.selectMood('Action Fix');
    
    // Reset the spy to track new calls
    tmdbServiceSpy.getMoviesByGenre.calls.reset();
    
    // Execute second call immediately
    component.selectMood('Action Fix');
    
    // Verify that the second call was throttled (no new API call)
    expect(tmdbServiceSpy.getMoviesByGenre).not.toHaveBeenCalled();
  });
  
  it('should not throttle when selecting different moods', () => {
    // Setup
    moodCacheSpy.has.and.returnValue(false);
    tmdbServiceSpy.getMoviesByGenre.and.returnValue(of(mockMovieResponse));
    
    // Execute first call
    component.selectMood('Action Fix');
    
    // Reset the spy to track new calls
    tmdbServiceSpy.getMoviesByGenre.calls.reset();
    
    // Execute second call with different mood
    component.selectMood('Feel Good');
    
    // Verify that the second call was
    expect(tmdbServiceSpy.getMoviesByGenre).toHaveBeenCalledWith(35);
  });
});