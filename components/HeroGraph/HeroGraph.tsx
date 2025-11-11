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

type HeroGraphProps = {
  heroId?: string;
};

const HeroGraph = ({ heroId }: HeroGraphProps) => {
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!heroId) return;
    setLoading(true);

    // Fetch hero data along with related films and starships
    fetch(`https://swapi.dev/api/people/${heroId}/`)
      .then((res) => res.json())
      .then(async (data) => {
        const filmResponses = await Promise.all(
          data.films.map((url: string) => fetch(url).then((res) => res.json()))
        );

        const starshipResponses = await Promise.all(
          data.starships.map((url: string) =>
            fetch(url).then((res) => res.json())
          )
        );

        // Create main hero node
        const heroNode: Node = {
          id: "hero",
          data: { label: data.name },
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

        // Map all films into React Flow nodes
        const filmNodes: Node[] = filmResponses.map((film, index) => ({
          id: `film-${index}`,
          data: { label: `🎬 ${film.title}` },
          position: { x: index * 200, y: 150 },
          style: {
            border: "1px solid #ffe81f",
            padding: 10,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
          },
        }));

        // Map all starships into React Flow nodes
        const starshipNodes: Node[] = starshipResponses.map((ship, index) => ({
          id: `ship-${index}`,
          data: { label: `🚀 ${ship.name}` },
          position: { x: index * 200, y: 300 },
          style: {
            border: "1px solid #ffe81f",
            padding: 10,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
          },
        }));

        // Build visual connections between hero → films → starships
        const filmEdges: Edge[] = filmNodes.map((film) => ({
          id: `edge-${film.id}`,
          source: "hero",
          target: film.id,
          animated: true,
          style: { stroke: "#ffe81f" },
        }));
        const shipEdges: Edge[] = starshipNodes.map((ship) => ({
          id: `edge-${ship.id}`,
          source: "hero",
          target: ship.id,
          animated: true,
          style: { stroke: "#00bfff" },
        }));

        setNodes([heroNode, ...filmNodes, ...starshipNodes]);
        setEdges([...filmEdges, ...shipEdges]);
      })
      .catch((err) => console.error("Error fetching hero:", err))
      .finally(() => setLoading(false));
  }, [heroId]);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "90%", height: "80vh" }}>
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
    </div>
  );
};

// AutoFitView: ensures the graph always fits inside the viewport after render
const AutoFitView = () => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);

  return null;
};

export default HeroGraph;
