import { MdClose } from "react-icons/md";
import HeroCard from "../../components/HeroCard/HeroCard";
import Loader from "../../components/Loader/Loader";
import styles from "./Heroes.module.css";
import { useHeroes } from "../../hooks/useHeroes";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";

function Heroes() {
  const { heroes, loading, error, page, query, totalPages, setSearchParams } =
    useHeroes();

  const [q, setQ] = useState(query);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params: Record<string, string> = {};
      if (value.trim()) params.search = value;
      params.page = "1";
      setSearchParams(params);
    }, 300),
    []
  );

  const handleInput = (value: string) => {
    setQ(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQ("");
    setSearchParams({ page: "1" });
  };

  const handlePage = (newPage: number) => {
    const params: Record<string, string> = {};
    if (query) params.search = query;
    params.page = String(newPage);
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className={styles.error}>⚠️ {error}</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBlock}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Find your hero..."
          value={q}
          onChange={(e) => handleInput(e.target.value)}
          autoFocus
        />

        {q && (
          <>
            <button className={styles.clearBtn} onClick={handleClear}>
              <MdClose size={20} />
            </button>
          </>
        )}
      </div>

      <div className={styles.heroesBlock}>
        {heroes.length > 0 ? (
          heroes.map((hero) => <HeroCard key={hero.id} hero={hero} />)
        ) : (
          <p className={styles.noHeroes}>No heroes found</p>
        )}
      </div>

      {heroes.length > 0 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => handlePage(page - 1)}
            className={styles.btn}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePage(num)}
              className={`${styles.pageBtn} ${
                num === page ? styles.activePage : ""
              }`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => handlePage(page + 1)}
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
