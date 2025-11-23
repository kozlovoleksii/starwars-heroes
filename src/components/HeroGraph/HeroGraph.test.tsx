import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeroGraph from "./HeroGraph";

describe("HeroGraph", () => {
  it("renders Loader while loading", () => {
    render(<HeroGraph heroId="1" />);
    const loaderElement = screen.getByTestId("loader");
    expect(loaderElement).toBeInTheDocument();
  });
});


describe("HeroGraph (data loaded)", () => {

  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          name: "Luke Skywalker",
          films: [],
          starships: [],
        }),
    })
  ) as any;

  it("renders ReactFlow after data is loaded", async () => {
    render(<HeroGraph heroId="1" />);

    await waitFor(() => {
      const flowElement = screen.getByTestId("rf__wrapper");
      expect(flowElement).toBeInTheDocument();
    });
  });
});
