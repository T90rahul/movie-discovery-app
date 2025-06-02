import { TestBed } from '@angular/core/testing';
import { NavigationStateService } from './navigation-state.service';
import { Movie, Actor } from '../models/movie.model';

describe('NavigationStateService', () => {
  let service: NavigationStateService;
  
  // Mock data
  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    overview: 'Test overview',
    release_date: '2023-01-01',
    vote_average: 8.5,
    genre_ids: [28, 35],
    backdrop_path: null
  };
  
const mockActor: Actor = {
  id: 1,
  name: 'John Doe',
  profile_path: '/john.jpg',
  character: 'Acting'
};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should have empty initial state', () => {
    const state = service.getMovieHubState();
    expect(state.selectedMood).toBe('');
    expect(state.movies.length).toBe(0);
    expect(state.searchResults).toBeFalse();
    expect(state.searchedMovies.length).toBe(0);
    expect(state.searchedActors.length).toBe(0);
    expect(state.searchQuery).toBe('');
    expect(service.hasMovieHubState()).toBeFalse();
  });
  
  it('should save and retrieve mood state', () => {
    service.saveMovieHubState({
      selectedMood: 'Action Fix',
      movies: [mockMovie]
    });
    
    const state = service.getMovieHubState();
    
    // Verify
    expect(state.selectedMood).toBe('Action Fix');
    expect(state.movies.length).toBe(1);
    expect(state.movies[0].id).toBe(1);
    expect(service.hasMovieHubState()).toBeTrue();
  });
  
  it('should save and retrieve search state', () => {
    service.saveMovieHubState({
      searchResults: true,
      searchedMovies: [mockMovie],
      searchedActors: [mockActor],
      searchQuery: 'test'
    });
    
    const state = service.getMovieHubState();
    
    expect(state.searchResults).toBeTrue();
    expect(state.searchedMovies.length).toBe(1);
    expect(state.searchedActors.length).toBe(1);
    expect(state.searchQuery).toBe('test');
    expect(service.hasMovieHubState()).toBeTrue();
  });
  
  it('should partially update state', () => {
    // Set initial state
    service.saveMovieHubState({
      selectedMood: 'Action Fix',
      movies: [mockMovie],
      searchQuery: 'initial'
    });
    
    // Update only search query
    service.saveMovieHubState({
      searchQuery: 'updated'
    });
    
    // Get state
    const state = service.getMovieHubState();
    
    // Verify only search query changed
    expect(state.selectedMood).toBe('Action Fix');
    expect(state.movies.length).toBe(1);
    expect(state.searchQuery).toBe('updated');
  });
  
  it('should clear state', () => {
    // Set state
    service.saveMovieHubState({
      selectedMood: 'Action Fix',
      movies: [mockMovie],
      searchResults: true,
      searchedMovies: [mockMovie],
      searchedActors: [mockActor],
      searchQuery: 'test'
    });
    
    // Clear state
    service.clearState();
    
    // Get state
    const state = service.getMovieHubState();
    
    // Verify all cleared
    expect(state.selectedMood).toBe('');
    expect(state.movies.length).toBe(0);
    expect(state.searchResults).toBeFalse();
    expect(state.searchedMovies.length).toBe(0);
    expect(state.searchedActors.length).toBe(0);
    expect(state.searchQuery).toBe('');
    expect(service.hasMovieHubState()).toBeFalse();
  });
});