import type { ApiResponse, DetailedHero, ListHero } from "../types/hero";
import type { Starship } from "../types/starship";
import type { Film } from "../types/film";

const BASE_URL = "https://sw-api.starnavi.io";

// Fetch a paginated list of people
export async function getPeople(page: number): Promise<ApiResponse<ListHero>> {
  const res = await fetch(`${BASE_URL}/people/?page=${page}`);
  if (!res.ok) throw new Error("Failed to load people");
  return res.json();
}

// Search heroes by name
export async function searchPeople(
  query: string
): Promise<ApiResponse<ListHero>> {
  const res = await fetch(`${BASE_URL}/people/?search=${query}`);
  if (!res.ok) throw new Error("Failed to search people");
  return res.json();
}

// Fetch a single hero by ID (short version)
export async function getHero(id: string): Promise<ListHero> {
  const res = await fetch(`${BASE_URL}/people/${id}`);
  if (!res.ok) throw new Error("Failed to load hero");
  return res.json();
}

// Fetch detailed hero (used in HeroGraph)
export const getHeroById = async (id: string): Promise<DetailedHero> => {
  const response = await fetch(`${BASE_URL}/people/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch hero: ${response.status}`);
  }
  return response.json();
};

// Films and starships return numeric IDs → build URLs manually
export const getFilms = async (filmIds: number[]): Promise<Film[]> => {
  const requests = filmIds.map((id) =>
    fetch(`${BASE_URL}/films/${id}`).then((res) => res.json())
  );

  return Promise.all(requests);
};

export const getStarships = async (shipIds: number[]): Promise<Starship[]> => {
  const requests = shipIds.map((id) =>
    fetch(`${BASE_URL}/starships/${id}`).then((res) => res.json())
  );

  return Promise.all(requests);
};
