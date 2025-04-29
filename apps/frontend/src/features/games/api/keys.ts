export const gameSessionKeys = {
  all: ["gameSession"] as const,
  single: (id: string) => [...gameSessionKeys.all, id] as const,
};
