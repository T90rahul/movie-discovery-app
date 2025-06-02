export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  backdrop_path: string | null;
  genre_ids?: number[];
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  status: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieCredits {
  cast: Actor[];
  crew: any[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface ActorResponse {
  page: number;
  results: Actor[];
  total_pages: number;
  total_results: number;
}