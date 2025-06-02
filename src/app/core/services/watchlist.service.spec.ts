import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watchlist.service';
import { Movie } from '../models/movie.model';

describe('WatchlistService', () => {
  let service: WatchlistService;
  
  const mockMovie: Movie = {
    id: 123,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    overview: 'Test overview',
    backdrop_path: '/backdrop.jpg'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    TestBed.configureTestingModule({
      providers: [WatchlistService]
    });
    
    service = TestBed.inject(WatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add movie to watchlist', () => {
    service.addToWatchlist(mockMovie);
    
    service.getWatchlist().subscribe(watchlist => {
      expect(watchlist.length).toBe(1);
      expect(watchlist[0].id).toBe(mockMovie.id);
    });
    
    // Verify localStorage was updated
    const storedWatchlist = JSON.parse(localStorage.getItem('movie-watchlist') || '[]');
    expect(storedWatchlist.length).toBe(1);
  });

  it('should not add duplicate movies to watchlist', () => {
    service.addToWatchlist(mockMovie);
    service.addToWatchlist(mockMovie);
    
    service.getWatchlist().subscribe(watchlist => {
      expect(watchlist.length).toBe(1);
    });
  });

  it('should remove movie from watchlist', () => {
    service.addToWatchlist(mockMovie);
    service.removeFromWatchlist(mockMovie.id);
    
    service.getWatchlist().subscribe(watchlist => {
      expect(watchlist.length).toBe(0);
    });
  });

  it('should toggle movie in watchlist', () => {
    // Add movie
    service.toggleWatchlist(mockMovie);
    
    let watchlist: Movie[] = [];
    service.getWatchlist().subscribe(list => {
      watchlist = list;
    });
    expect(watchlist.length).toBe(1);
    
    // Remove movie
    service.toggleWatchlist(mockMovie);
    expect(watchlist.length).toBe(0);
  });

  it('should check if movie is in watchlist', () => {
    service.addToWatchlist(mockMovie);
    
    expect(service.isInWatchlist(mockMovie.id)).toBe(true);
    expect(service.isInWatchlist(999)).toBe(false);
  });

  it('should clear watchlist', () => {
    service.addToWatchlist(mockMovie);
    service.clearWatchlist();
    
    service.getWatchlist().subscribe(watchlist => {
      expect(watchlist.length).toBe(0);
    });
  });
});