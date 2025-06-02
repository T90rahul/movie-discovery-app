import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { WatchlistService } from './core/services/watchlist.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;

  beforeEach(() => {
    watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', ['getWatchlist', 'getWatchlistCount$']);
    watchlistServiceSpy.getWatchlist.and.returnValue(of([]));
    watchlistServiceSpy.getWatchlistCount$.and.returnValue(of(0));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: WatchlistService, useValue: watchlistServiceSpy }
      ]
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'movie-discovery-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('movie-discovery-app');
  });

  it('should initialize watchlistCount$ with the number of movies in watchlist', () => {
    watchlistServiceSpy.getWatchlistCount$.and.returnValue(of(2));
    
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    
    fixture.componentInstance.watchlistCount$.subscribe(count => {
      expect(count).toBe(2);
    });
  });
});