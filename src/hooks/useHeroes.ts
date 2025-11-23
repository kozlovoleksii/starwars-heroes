import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPeople, searchPeople } from "../services/starWarsApi";
import type { ListHero } from "../types/hero";

// Custom hook for loading + searching + paginating heroes
export function useHeroes() {
  const [heroes, setHeroes] = useState<ListHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // Current pagination and search parameters from the URL
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("search") || "";
  // Total number of pages returned by API (fixed for this API)
  const totalPages = 9;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        // If search query exists → use server-side search
        if (query) {
          data = await searchPeople(query);
        } else {
          data = await getPeople(page);
        }

        setHeroes(data.results);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, query]);

  return {
    heroes,
    loading,
    error,
    page,
    query,
    totalPages,
    setSearchParams,
  };
}
