import { Injectable } from '@angular/core';
import { Movie, Actor } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  // Movie hub state
  private selectedMood: string = '';
  private moodMovies: Movie[] = [];
  private searchResults: boolean = false;
  private searchedMovies: Movie[] = [];
  private searchedActors: Actor[] = [];
  private searchQuery: string = '';
  
  constructor() { }

  // Save movie hub state
  saveMovieHubState(state: {
    selectedMood?: string,
    movies?: Movie[],
    searchResults?: boolean,
    searchedMovies?: Movie[],
    searchedActors?: Actor[],
    searchQuery?: string
  }): void {
    if (state.selectedMood !== undefined) this.selectedMood = state.selectedMood;
    if (state.movies !== undefined) this.moodMovies = state.movies;
    if (state.searchResults !== undefined) this.searchResults = state.searchResults;
    if (state.searchedMovies !== undefined) this.searchedMovies = state.searchedMovies;
    if (state.searchedActors !== undefined) this.searchedActors = state.searchedActors;
    if (state.searchQuery !== undefined) this.searchQuery = state.searchQuery;
  }

  // Get movie hub state
  getMovieHubState(): {
    selectedMood: string,
    movies: Movie[],
    searchResults: boolean,
    searchedMovies: Movie[],
    searchedActors: Actor[],
    searchQuery: string
  } {
    return {
      selectedMood: this.selectedMood,
      movies: this.moodMovies,
      searchResults: this.searchResults,
      searchedMovies: this.searchedMovies,
      searchedActors: this.searchedActors,
      searchQuery: this.searchQuery
    };
  }

  // Check if we have saved state
  hasMovieHubState(): boolean {
    return (this.moodMovies.length > 0 || this.searchedMovies.length > 0);
  }

  // Clear state
  clearState(): void {
    this.selectedMood = '';
    this.moodMovies = [];
    this.searchResults = false;
    this.searchedMovies = [];
    this.searchedActors = [];
    this.searchQuery = '';
  }
}