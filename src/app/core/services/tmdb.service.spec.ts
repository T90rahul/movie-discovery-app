import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TmdbService } from './tmdb.service';
import { environment } from '../../../environments/environment';


describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TmdbService],
    });
    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get movie poster URL', () => {
    const posterPath = '/test-path.jpg';
    const url = service.getMoviePosterUrl(posterPath);
    expect(url).toBe(`${environment.tmdbImageBaseUrl}/w500${posterPath}`);
  });

  it('should return fallback image when poster path is null', () => {
    const url = service.getMoviePosterUrl(null);
    expect(url).toBe('assets/no-poster.png');
  });

  it('should get movies by genre', () => {
    const genreId = 28; // Action
    const mockResponse = {
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    };

    service.getMoviesByGenre(genreId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${environment.tmdbBaseUrl}/discover/movie` &&
        request.params.has('with_genres') &&
        request.params.get('with_genres') === genreId.toString()
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search movies', () => {
    const query = 'test';
    const mockResponse = {
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    };

    service.searchMovies(query).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${environment.tmdbBaseUrl}/search/movie` &&
        request.params.has('query') &&
        request.params.get('query') === query
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search actors', () => {
    const query = 'test';
    const mockResponse = {
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    };

    service.searchActors(query).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${environment.tmdbBaseUrl}/search/person` &&
        request.params.has('query') &&
        request.params.get('query') === query
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get movie details', () => {
    const movieId = 123;
    const mockResponse = {
      id: movieId,
      title: 'Test Movie',
      genres: [],
      runtime: 120,
      tagline: 'Test tagline',
      status: 'Released',
      poster_path: '/test.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5,
      overview: 'Test overview',
    };

    service.getMovieDetails(movieId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) => {
      return request.url === `${environment.tmdbBaseUrl}/movie/${movieId}`;
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get movie videos', () => {
    const movieId = 123;
    const mockResponse = { results: [] };

    service.getMovieVideos(movieId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${environment.tmdbBaseUrl}/movie/${movieId}/videos`
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get movie credits', () => {
    const movieId = 123;
    const mockResponse = { cast: [], crew: [] };

    service.getMovieCredits(movieId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${environment.tmdbBaseUrl}/movie/${movieId}/credits`
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get similar movies', () => {
    const movieId = 123;
    const mockResponse = {
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    };

    service.getSimilarMovies(movieId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${environment.tmdbBaseUrl}/movie/${movieId}/similar`
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
