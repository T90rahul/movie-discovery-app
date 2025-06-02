import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WatchlistComponent } from './watchlist.component';
import { WatchlistService } from '../core/services/watchlist.service';
import { TmdbService } from '../core/services/tmdb.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Movie } from '../core/models/movie.model';
import { Component, Input } from '@angular/core';

// Mock MovieCardComponent to avoid TmdbService dependency
@Component({
  selector: 'app-movie-card',
  template: '<div class="mock-movie-card">{{movie.title}}</div>'
})
class MockMovieCardComponent {
  @Input() movie!: Movie;
}

describe('WatchlistComponent', () => {
  let component: WatchlistComponent;
  let fixture: ComponentFixture<WatchlistComponent>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;

  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      poster_path: '/test1.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5,
      overview: 'Test overview 1',
      backdrop_path: '/backdrop1.jpg'
    },
    {
      id: 2,
      title: 'Test Movie 2',
      poster_path: '/test2.jpg',
      release_date: '2023-02-01',
      vote_average: 7.5,
      overview: 'Test overview 2',
      backdrop_path: '/backdrop2.jpg'
    }
  ];

  beforeEach(async () => {
    watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', ['getWatchlist', 'clearWatchlist']);
    
    await TestBed.configureTestingModule({
      declarations: [
        WatchlistComponent,
        MockMovieCardComponent // Use mock component instead of real one
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: WatchlistService, useValue: watchlistServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    watchlistServiceSpy.getWatchlist.and.returnValue(of([]));
    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display empty watchlist message when watchlist is empty', () => {
    watchlistServiceSpy.getWatchlist.and.returnValue(of([]));
    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const emptyMessage = fixture.debugElement.query(By.css('.text-gray-500'));
    expect(emptyMessage).not.toBeNull();
    expect(emptyMessage.nativeElement.textContent).toContain('Your watchlist is empty');
    
    const clearButton = fixture.debugElement.query(By.css('button'));
    expect(clearButton).toBeNull();
  });

  it('should display movies when watchlist has items', () => {
    watchlistServiceSpy.getWatchlist.and.returnValue(of(mockMovies));
    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const movieCards = fixture.debugElement.queryAll(By.css('app-movie-card'));
    expect(movieCards.length).toBe(2);
    
    const clearButton = fixture.debugElement.query(By.css('button'));
    expect(clearButton).not.toBeNull();
    expect(clearButton.nativeElement.textContent.trim()).toBe('Clear Watchlist');
  });

  it('should clear watchlist when clear button is clicked', () => {
    watchlistServiceSpy.getWatchlist.and.returnValue(of(mockMovies));
    fixture = TestBed.createComponent(WatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const clearButton = fixture.debugElement.query(By.css('button'));
    clearButton.triggerEventHandler('click', null);
    
    expect(watchlistServiceSpy.clearWatchlist).toHaveBeenCalled();
  });
});