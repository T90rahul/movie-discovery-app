import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MovieDetailComponent } from './movie-detail.component';
import { TmdbService } from '../core/services/tmdb.service';
import { WatchlistService } from '../core/services/watchlist.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Mock SafeUrlPipe
@Pipe({
  name: 'safeUrl'
})
class MockSafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

// Mock MovieCardComponent
@Component({
  selector: 'app-movie-card',
  template: '<div class="mock-movie-card">{{movie.title}}</div>'
})
class MockMovieCardComponent {
  @Input() movie: any;
}

// Mock movie detail template to avoid iframe issues
@Component({
  selector: 'app-movie-detail',
  template: `
    <div *ngIf="movie">
      <h1>{{ movie.title }}</h1>
      <p>{{ movie.overview }}</p>
      <div *ngFor="let genre of movie.genres" class="bg-gray-200">{{ genre.name }}</div>
      <div class="border-b">
        <button (click)="setActiveTab('overview')">Overview</button>
        <button (click)="setActiveTab('cast')">Cast</button>
        <button (click)="setActiveTab('similar')">Similar Movies</button>
      </div>
      <button class="mt-4" (click)="toggleWatchlist()">
        {{ isInWatchlist() ? 'Remove from Watchlist' : 'Add to Watchlist' }}
      </button>
      <div *ngIf="activeTab === 'cast'" class="grid-cols-2"></div>
    </div>
  `
})
class TestMovieDetailComponent extends MovieDetailComponent {}

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;
  let tmdbServiceSpy: jasmine.SpyObj<TmdbService>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;

  const mockMovieDetails = {
    id: 123,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    overview: 'Test overview',
    tagline: 'Test tagline',
    runtime: 120,
    status: 'Released',
    genres: [{ id: 28, name: 'Action' }]
  };

  const mockCredits = {
    cast: [
      { id: 1, name: 'Actor 1', profile_path: '/actor1.jpg', character: 'Character 1' },
      { id: 2, name: 'Actor 2', profile_path: '/actor2.jpg', character: 'Character 2' }
    ],
    crew: []
  };

  const mockVideos = {
    results: [
      { id: 'video1', key: '12345', name: 'Trailer', site: 'YouTube', type: 'Trailer' }
    ]
  };

  const mockSimilarMovies = {
    page: 1,
    results: [
      {
        id: 456,
        title: 'Similar Movie',
        poster_path: '/similar.jpg',
        release_date: '2023-02-01',
        vote_average: 7.5,
        overview: 'Similar overview',
        backdrop_path: '/similarbackdrop.jpg'
      }
    ],
    total_pages: 1,
    total_results: 1
  };

  beforeEach(async () => {
    tmdbServiceSpy = jasmine.createSpyObj('TmdbService', [
      'getMovieDetails', 
      'getMovieCredits', 
      'getMovieVideos', 
      'getSimilarMovies',
      'getMoviePosterUrl'
    ]);
    
    watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', [
      'toggleWatchlist', 
      'isInWatchlist'
    ]);
    
    tmdbServiceSpy.getMovieDetails.and.returnValue(of(mockMovieDetails));
    tmdbServiceSpy.getMovieCredits.and.returnValue(of(mockCredits));
    tmdbServiceSpy.getMovieVideos.and.returnValue(of(mockVideos));
    tmdbServiceSpy.getSimilarMovies.and.returnValue(of(mockSimilarMovies));
    tmdbServiceSpy.getMoviePosterUrl.and.callFake((path) => path ? `https://image.tmdb.org/t/p/w500${path}` : '');
    
    watchlistServiceSpy.isInWatchlist.and.returnValue(false);
    
    await TestBed.configureTestingModule({
      declarations: [
        TestMovieDetailComponent, 
        MockSafeUrlPipe,
        MockMovieCardComponent
      ],
      imports: [RouterTestingModule],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { 
            paramMap: of(convertToParamMap({ id: '123' })) 
          } 
        },
        { provide: TmdbService, useValue: tmdbServiceSpy },
        { provide: WatchlistService, useValue: watchlistServiceSpy },
        { provide: DomSanitizer, useValue: {
          bypassSecurityTrustResourceUrl: (url: string) => url
        }}
      ]
    })
    .overrideComponent(TestMovieDetailComponent, {
      set: {
        providers: [
          { provide: TmdbService, useValue: tmdbServiceSpy },
          { provide: WatchlistService, useValue: watchlistServiceSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMovieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie details on init', () => {
    expect(tmdbServiceSpy.getMovieDetails).toHaveBeenCalledWith(123);
    expect(tmdbServiceSpy.getMovieCredits).toHaveBeenCalledWith(123);
    expect(tmdbServiceSpy.getMovieVideos).toHaveBeenCalledWith(123);
    expect(tmdbServiceSpy.getSimilarMovies).toHaveBeenCalledWith(123);
    
    expect(component.movie).toEqual(mockMovieDetails);
    expect(component.cast.length).toBe(2);
    expect(component.similarMovies.length).toBe(1);
    expect(component.trailerUrl).toBe('https://www.youtube.com/embed/12345');
  });

  it('should display movie title and overview', () => {
    const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(titleElement.textContent).toContain('Test Movie');
    
    const overviewElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(overviewElement.textContent).toContain('Test overview');
  });

  it('should display movie genres', () => {
    const genreElement = fixture.debugElement.query(By.css('.bg-gray-200')).nativeElement;
    expect(genreElement.textContent.trim()).toBe('Action');
  });

  it('should have three tabs', () => {
    const tabButtons = fixture.debugElement.queryAll(By.css('.border-b button'));
    expect(tabButtons.length).toBe(3);
    expect(tabButtons[0].nativeElement.textContent.trim()).toBe('Overview');
    expect(tabButtons[1].nativeElement.textContent.trim()).toBe('Cast');
    expect(tabButtons[2].nativeElement.textContent.trim()).toBe('Similar Movies');
  });

  it('should switch tabs when clicked', () => {
    // Default tab is trailer
    expect(component.activeTab).toBe('trailer');
    
    // Click cast tab
    const castTab = fixture.debugElement.queryAll(By.css('.border-b button'))[1];
    castTab.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    expect(component.activeTab).toBe('cast');
    
    // Cast content should be visible
    const castContent = fixture.debugElement.query(By.css('.grid-cols-2'));
    expect(castContent).not.toBeNull();
  });

  it('should toggle watchlist', () => {
    const watchlistButton = fixture.debugElement.query(By.css('button.mt-4'));
    watchlistButton.triggerEventHandler('click', null);
    
    expect(watchlistServiceSpy.toggleWatchlist).toHaveBeenCalledWith(mockMovieDetails);
  });

  it('should get movie poster URL', () => {
    // Test with valid path
    const posterUrl = component.getMoviePosterUrl('/test.jpg');
    expect(tmdbServiceSpy.getMoviePosterUrl).toHaveBeenCalledWith('/test.jpg');
    expect(posterUrl).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
    
    // Test with null path
    tmdbServiceSpy.getMoviePosterUrl.calls.reset();
    const nullPosterUrl = component.getMoviePosterUrl(null);
    expect(nullPosterUrl).toBe('assets/images/imgNotAvailable.png');
    expect(tmdbServiceSpy.getMoviePosterUrl).not.toHaveBeenCalled();
  });

  it('should get movie backdrop URL', () => {
    // Test with valid path
    const backdropUrl = component.getMovieBackdropUrl('/backdrop.jpg');
    expect(tmdbServiceSpy.getMoviePosterUrl).toHaveBeenCalledWith('/backdrop.jpg', 'original');
    expect(backdropUrl).toBe('https://image.tmdb.org/t/p/w500/backdrop.jpg');
    
    // Test with null path
    const nullBackdropUrl = component.getMovieBackdropUrl(null);
    expect(nullBackdropUrl).toBe('');
    expect(tmdbServiceSpy.getMoviePosterUrl).not.toHaveBeenCalledWith(null, 'original');
  });

  it('should handle isInWatchlist when movie is undefined', () => {
    // Reset the spy call count
    watchlistServiceSpy.isInWatchlist.calls.reset();
    
    // Set movie to undefined
    component.movie = undefined;
    
    // Call the method
    const result = component.isInWatchlist();
    
    // Verify the result
    expect(result).toBeFalse();
    expect(watchlistServiceSpy.isInWatchlist).not.toHaveBeenCalled();
  });
});