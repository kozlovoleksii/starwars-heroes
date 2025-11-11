import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroCard from "../../components/HeroCard/HeroCard";
import Loader from "../../components/Loader/Loader";
import styles from "./Heroes.module.css";
import type { Hero } from "../../types/hero";
import { MdClose } from "react-icons/md";

function Heroes() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("search") || "";
  const lowerQuery = query.toLowerCase();
  const page = Number(searchParams.get("page")) || 1;
  const heroesPerPage = 10;

  // Handle search input change and reset pagination
  const handleSearchChange = (value: string) => {
    const newParams: Record<string, string> = {};
    if (value) newParams.search = value;
    newParams.page = "1";
    setSearchParams(newParams);
  };

  // Handle pagination button click
  const handlePageChange = (newPage: number) => {
    const newParams: Record<string, string> = {};
    if (query) newParams.search = query;
    newParams.page = String(newPage);
    setSearchParams(newParams);
  };

  // Fetch all heroes from API or get from session cache
  useEffect(() => {
    const cached = sessionStorage.getItem("heroesData");
    if (cached) {
      const parsed = JSON.parse(cached);
      setHeroes(parsed);
      setTimeout(() => setLoading(false), 700);
      return;
    }

    const fetchAllHeroes = async () => {
      try {
        setLoading(true);
        const allHeroes: Hero[] = [];
        const totalPagesFromAPI = 9;

        for (let i = 1; i <= totalPagesFromAPI; i++) {
          const response = await fetch(
            `https://sw-api.starnavi.io/people/?page=${i}`
          );
          if (!response.ok) throw new Error(`Error ${response.status}`);
          const data = await response.json();
          allHeroes.push(...data.results);
        }

        setHeroes(allHeroes);
        sessionStorage.setItem("heroesData", JSON.stringify(allHeroes));
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Unexpected error");
      } finally {
        setTimeout(() => setLoading(false), 700);
      }
    };

    fetchAllHeroes();
  }, []);

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        ⚠️ Failed to load heroes: {error}
      </p>
    );
  }

  // Filter heroes by search query
  const filteredHeroes = heroes.filter((hero) =>
    hero.name.toLowerCase().includes(lowerQuery)
  );

  const totalPages = Math.ceil(filteredHeroes.length / heroesPerPage);
  const startIndex = (page - 1) * heroesPerPage;
  const endIndex = startIndex + heroesPerPage;
  const currentHeroes = filteredHeroes.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBlock}>
        <input
          type="text"
          placeholder="Find your hero..."
          className={styles.searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          value={query}
        />
        {query && (
          <button
            className={styles.clearBtn}
            onClick={() => handleSearchChange("")}
            aria-label="Clear search"
          >
            <MdClose size={20} />
          </button>
        )}
      </div>

      <div className={styles.heroesBlock}>
        {currentHeroes.length > 0 ? (
          currentHeroes.map((hero) => <HeroCard key={hero.id} hero={hero} />)
        ) : (
          <p className={styles.noHeroes}>No such heroes</p>
        )}
      </div>

      {currentHeroes.length > 0 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className={styles.btn}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const num = index + 1;
            return (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`${styles.pageBtn} ${
                  page === num ? styles.activePage : ""
                }`}
              >
                {num}
              </button>
            );
          })}

          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className={styles.btn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Heroes;
