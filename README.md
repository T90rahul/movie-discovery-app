# Movie Discovery App

A responsive web application that helps users discover movies based on their mood, search for titles or actors, and manage a personal watchlist.

## Features

### Core Features
- **Mood-based Movie Discovery**: Browse movies based on different moods (Feel Good, Action Fix, Mind Benders)
- **Comprehensive Search**: Search for both movies and actors simultaneously
- **Detailed Movie Information**: View trailers, cast information, and similar movie recommendations
- **Personal Watchlist**: Add/remove movies to a persistent watchlist stored in localStorage
- **Responsive Design**: Optimized for all device sizes from mobile to desktop

### Technical Features
- **Performance Optimizations**:
  - Caching system for mood-based results (10-minute cache duration)
  - Throttling for API requests to prevent rate limiting
  - Lazy loading for watchlist module
  - OnPush change detection for movie cards
- **State Management**: Preserves user's selected mood, search results, and watchlist between navigation
- **Error Handling**: Graceful error handling with fallback UI for missing images

## Project Structure

```
src/
├── app/
│   ├── core/               # Core services, models, and interceptors
│   ├── movie-hub/          # Main movie discovery page
│   ├── movie-detail/       # Movie details page
│   ├── search/             # Search functionality
│   ├── watchlist/          # Watchlist feature (lazy loaded)
│   └── shared/             # Shared components, pipes, and utilities
├── assets/                 # Static assets
└── environments/           # Environment configuration
```

## Tech Stack

- **Frontend**: Angular 16+
- **Styling**: Tailwind CSS
- **API**: The Movie Database (TMDB) API
- **Testing**: Jasmine/Karma
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Hosting**: GitHub Pages

## Running Locally

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- TMDB API Key (free from [themoviedb.org](https://www.themoviedb.org/))

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd movie-discovery-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your TMDB API Key:
   - Create/edit `src/environments/environment.ts` and `src/environments/environment.prod.ts`
   - Add your API key:
     ```typescript
     export const environment = {
       production: false, // or true for prod
       tmdbApiKey: 'YOUR_API_KEY_HERE',
       tmdbBaseUrl: 'https://api.themoviedb.org/3',
       tmdbImageBaseUrl: 'https://image.tmdb.org/t/p'
     };
     ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser to `http://localhost:4200/`

## API Usage

The application uses the following TMDB API endpoints:
- `/discover/movie` - For mood-based recommendations
- `/search/movie` - For movie search
- `/search/person` - For actor search
- `/movie/{id}` - For movie details
- `/movie/{id}/videos` - For movie trailers
- `/movie/{id}/credits` - For movie cast
- `/movie/{id}/similar` - For similar movies

All API requests are handled through the `TmdbService` in `src/app/core/services/tmdb.service.ts`.

## Running Tests

Run the tests with:
```bash
ng test
```

Generate a coverage report:
```bash
ng test --code-coverage
```

The coverage report will be available in the `coverage/` directory.

## Building for Production

```bash
ng build --configuration production
```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch using GitHub Actions CI/CD pipeline.

### Important Note for GitHub Pages Deployment

The application uses hash-based routing (`useHash: true` in AppRoutingModule) to ensure proper functioning on GitHub Pages. This prevents 404 errors when users refresh the page or access deep links directly.

## Code Quality Guidelines

- Use proper TypeScript types instead of `any`
- Follow Angular best practices for component design
- Implement proper error handling
- Write comprehensive unit tests
- Use lazy loading for feature modules
- Implement performance optimizations

## Future Improvements

- Add user authentication
- Implement server-side rendering
- Add more mood categories
- Enhance accessibility features
- Add multi-language support