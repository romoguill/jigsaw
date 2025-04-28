export const gameKeys = {
  all: ["games"] as const,
  single: (id: string) => [...gameKeys.all, id] as const,
};
