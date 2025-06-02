# What Should I Watch Tonight

A responsive web application that helps users decide what movie to watch by browsing curated movie suggestions and searching for titles or actors.

## Features

- `Landing Page` with mood-based movie recommendations
- `Search Functionality` for movies and actors
- `Movie Details` with trailers, cast, and similar movie suggestions
- `Watchlist` to save movies for later viewing (using localStorage)
- `Responsive Design` for all device sizes

## Tech Stack

- Angular
- TMDB API
- Tailwind CSS
- Jasmine/Karma for testing

## Running Locally

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup Instructions

1. Clone the repository:
   `git clone <repository-url>`
   `cd movie-discovery-app`

2. Install dependencies:
   `npm install`


3. Configure TMDB API Key:
   - Sign up for a free account at [TMDB](https://www.themoviedb.org/)
   - Go to your account settings → API and request an API key
   - Open `src/environments/environment.ts` and `src/environments/environment.prod.ts`
   - Replace `'YOUR_TMDB_API_KEY'` with your actual API key:


4. Run the development server:
   `npm start`

5. Navigate to `http://localhost:4200/` in your browser

### Accessing the TMDB API

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
`ng test`

Generate a coverage report:
`ng test --code-coverage`


The coverage report will be available in the `coverage/` directory.

## Building for Production
`ng build --prod`

## Deployment

The application is deployed at: [Live Demo URL]

## Bonus Features

- `YouTube Trailer Embedding` on the Movie Detail page
- `Watchlist Functionality` using localStorage
  - Add/remove movies from your watchlist
  - Dedicated "My Watchlist" page
  - Persistent across browser sessions