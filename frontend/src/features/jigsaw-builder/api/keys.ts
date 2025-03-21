import { Coordinate } from "@/types";

export const jigsawBuilderKeys = {
  all: ["available-puzzles"] as const,
};

export const pathKeys = {
  all: ["paths"] as const,
  single: (details: { imgSrc: string; cols: number; rows: number }) => [
    ...pathKeys.all,
    { ...details },
  ],
};
