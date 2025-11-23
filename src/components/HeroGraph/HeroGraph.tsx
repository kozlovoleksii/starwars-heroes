import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import Loader from "../Loader/Loader";

import {
  getHeroById,
  getFilms,
  getStarships,
} from "../../services/starWarsApi";
import type { DetailedHero } from "../../types/hero";
import type { Film } from "../../types/film";
import type { Starship } from "../../types/starship";

type HeroGraphProps = {
  heroId?: string;
};

const HeroGraph = ({ heroId }: HeroGraphProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!heroId) return;

    const loadGraph = async () => {
      try {
        setLoading(true);
        setError(null);

        const hero: DetailedHero = await getHeroById(heroId);

        const films = await getFilms(hero.films);
        const starships = await getStarships(hero.starships);

        const heroNode: Node = {
          id: "hero",
          data: { label: hero.name },
          position: { x: 500, y: 0 },
          style: {
            border: "2px solid #ffe81f",
            padding: 12,
            borderRadius: 10,
            background: "#000",
            color: "#ffe81f",
            fontWeight: "bold",
          },
        };

        const filmNodes: Node[] = films.map((film, i) => ({
          id: `film-${i}`,
          data: { label: `🎬 ${film.title}` },
          position: { x: i * 200, y: 150 },
          style: {
            border: "1px solid #ffe81f",
            padding: 10,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
          },
        }));

        const starshipNodes: Node[] = starships.map((ship, i) => ({
          id: `ship-${i}`,
          data: { label: `🚀 ${ship.name}` },
          position: { x: i * 200, y: 300 },
          style: {
            border: "1px solid #ffe81f",
            padding: 10,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
          },
        }));

        // 4. Створюємо ребра
        const filmEdges: Edge[] = filmNodes.map((f) => ({
          id: `edge-${f.id}`,
          source: "hero",
          target: f.id,
          animated: true,
          style: { stroke: "#ffe81f" },
        }));

        const starshipEdges: Edge[] = starshipNodes.map((s) => ({
          id: `edge-${s.id}`,
          source: "hero",
          target: s.id,
          animated: true,
          style: { stroke: "#00bfff" },
        }));

        setNodes([heroNode, ...filmNodes, ...starshipNodes]);
        setEdges([...filmEdges, ...starshipEdges]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadGraph();
  }, [heroId]);

  if (loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "40px" }}>
        ⚠ Error loading graph: {error}
      </p>
    );
  }

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background color="#333" gap={16} />
        <Controls />
        <AutoFitView />
      </ReactFlow>
    </div>
  );
};

const AutoFitView = () => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    fitView({ padding: 0.3 });
  }, []);

  return null;
};

export default HeroGraph;
