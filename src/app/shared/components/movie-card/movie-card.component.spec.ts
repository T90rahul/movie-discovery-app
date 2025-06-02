import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MovieCardComponent } from './movie-card.component';
import { TmdbService } from '../../../core/services/tmdb.service';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { Movie } from '../../../core/models/movie.model';
import { By } from '@angular/platform-browser';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let tmdbServiceSpy: jasmine.SpyObj<TmdbService>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;

  const mockMovie: Movie = {
    id: 123,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    overview: 'Test overview',
    backdrop_path: '/backdrop.jpg'
  };

  beforeEach(async () => {
    tmdbServiceSpy = jasmine.createSpyObj('TmdbService', ['getMoviePosterUrl']);
    watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', ['toggleWatchlist', 'isInWatchlist']);

    tmdbServiceSpy.getMoviePosterUrl.and.returnValue('https://image.tmdb.org/t/p/w500/test.jpg');
    watchlistServiceSpy.isInWatchlist.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MovieCardComponent],
      providers: [
        { provide: TmdbService, useValue: tmdbServiceSpy },
        { provide: WatchlistService, useValue: watchlistServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    component.movie = mockMovie;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display movie title', () => {
    const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleElement.textContent).toContain(mockMovie.title);
  });

  it('should get movie poster URL from TmdbService', () => {
    expect(component.getMoviePosterUrl()).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
    expect(tmdbServiceSpy.getMoviePosterUrl).toHaveBeenCalledWith(mockMovie.poster_path);
  });

  it('should extract release year from release date', () => {
    expect(component.getReleaseYear()).toBe('2023');
  });

  it('should return "N/A" when release date is missing', () => {
    component.movie = { ...mockMovie, release_date: '' };
    expect(component.getReleaseYear()).toBe('N/A');
  });

  it('should toggle watchlist when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(watchlistServiceSpy.toggleWatchlist).toHaveBeenCalledWith(mockMovie);
  });

  it('should check if movie is in watchlist', () => {
    component.isInWatchlist();
    expect(watchlistServiceSpy.isInWatchlist).toHaveBeenCalledWith(mockMovie.id);
  });
});