import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CAST_AXES } from "../data/castLexicon";
import { CastLexiconReference } from "./CastLexiconReference";

describe("CastLexiconReference", () => {
  it("renders every axis and every row with translations by default", () => {
    render(<CastLexiconReference />);
    for (const axis of CAST_AXES) {
      expect(screen.getByText(`${axis.slot} - ${axis.title}`)).toBeInTheDocument();
      for (const row of axis.rows) {
        expect(screen.getAllByText(row.english).length).toBeGreaterThan(0);
        expect(screen.getByText(row.georgian)).toBeInTheDocument();
      }
    }
    expect(screen.getAllByRole("table")).toHaveLength(CAST_AXES.length);
  });

  it("collapses to one line per axis in compact mode", () => {
    render(<CastLexiconReference compact />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText(/00 Giant/)).toBeInTheDocument();
  });
});
