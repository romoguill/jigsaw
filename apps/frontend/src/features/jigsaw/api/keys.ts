export const gameKeys = {
  all: ["games"] as const,
  allWithQuery: (queryParams?: {
    orderBy?: "difficulty" | "pieceSize";
    orderDirection?: "asc" | "desc";
  }) => [...gameKeys.all, queryParams] as const,
  single: (id: string) => [...gameKeys.all, id] as const,
};
