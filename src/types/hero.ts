export interface ListHero {
  id: number;
  name: string;
  gender: string;
  birth_year: string;
  height: string;
}

export interface DetailedHero {
  id: number;
  name: string;
  films: number[];
  starships: number[];
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
