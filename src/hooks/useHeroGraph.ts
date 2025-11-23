import { useEffect, useState } from "react";
import type { Node, Edge } from "reactflow";
import type { DetailedHero } from "../types/hero";
import type { Film } from "../types/film";
import type { Starship } from "../types/starship";
import { getHeroById, getFilms, getStarships } from "../services/starWarsApi";

const HERO_POS = { x: 500, y: 0 };
const FILM_Y = 150;
const SHIP_Y = 300;
const GAP_X = 220;

export const useHeroGraph = (heroId?: string) => {
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<DetailedHero | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [starships, setStarships] = useState<Starship[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!heroId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const heroData = await getHeroById(heroId);
        setHero(heroData);
        const [filmData, starshipData] = await Promise.all([
          getFilms(heroData.films),
          getStarships(heroData.starships),
        ]);

        setFilms(filmData);
        setStarships(starshipData);

        const heroNode: Node = {
          id: "hero",
          data: { label: heroData.name },
          position: HERO_POS,
          style: {
            border: "2px solid #ffe81f",
            padding: 12,
            borderRadius: 10,
            background: "#000",
            color: "#ffe81f",
            fontWeight: "bold",
          },
        };

        const filmNodes: Node[] = filmData.map((film, i) => ({
          id: `film-${i}`,
          data: { label: `🎬 ${film.title}` },
          position: { x: i * GAP_X, y: FILM_Y },
          style: {
            border: "1px solid #ffe81f",
            padding: 10,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
          },
        }));

        const shipNodes: Node[] = starshipData.map((ship, i) => ({
          id: `ship-${i}`,
          data: { label: `🚀 ${ship.name}` },
          position: { x: i * GAP_X, y: SHIP_Y },
          style: {
            border: "1px solid #ffe81f",
            padding: 10,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
          },
        }));

        const filmEdges: Edge[] = filmNodes.map((fn) => ({
          id: `edge-${fn.id}`,
          source: "hero",
          target: fn.id,
          animated: true,
          style: { stroke: "#ffe81f" },
        }));

        const shipEdges: Edge[] = shipNodes.map((sn) => ({
          id: `edge-${sn.id}`,
          source: "hero",
          target: sn.id,
          animated: true,
          style: { stroke: "#00bfff" },
        }));

        setNodes([heroNode, ...filmNodes, ...shipNodes]);
        setEdges([...filmEdges, ...shipEdges]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else setError("Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [heroId]);

  return { loading, error, hero, films, starships, nodes, edges };
};
