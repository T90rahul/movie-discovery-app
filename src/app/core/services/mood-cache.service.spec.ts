import { TestBed } from '@angular/core/testing';
import { MoodCacheService } from './mood-cache.service';
import { MovieResponse } from '../models/movie.model';

describe('MoodCacheService', () => {
  let service: MoodCacheService;
  let mockMovieResponse: MovieResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodCacheService);
    
    mockMovieResponse = {
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null for non-existent cache item', () => {
    expect(service.get(123)).toBeNull();
  });

  it('should store and retrieve cache items', () => {
    const genreId = 28;
    service.set(genreId, mockMovieResponse);
    expect(service.get(genreId)).toEqual(mockMovieResponse);
  });

  it('should correctly report if an item is cached', () => {
    const genreId = 28;
    expect(service.has(genreId)).toBeFalse();
    service.set(genreId, mockMovieResponse);
    expect(service.has(genreId)).toBeTrue();
  });

  it('should clear all cached items', () => {
    service.set(28, mockMovieResponse);
    service.set(35, mockMovieResponse);
    expect(service.size()).toBe(2);
    service.clear();
    expect(service.size()).toBe(0);
  });

  it('should expire cache items after duration', () => {
    const genreId = 28;
    service.set(genreId, mockMovieResponse);
    
    const originalNow = Date.now;
    let currentTime = originalNow();
  
    const dateSpy = spyOn(Date, 'now');
    
    dateSpy.and.returnValue(currentTime);
    expect(service.has(genreId)).toBeTrue();
    
    dateSpy.and.returnValue(currentTime + 11 * 60 * 1000);
    expect(service.has(genreId)).toBeFalse();
    expect(service.get(genreId)).toBeNull();
  });
});