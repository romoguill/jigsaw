import { apiClient } from "@/frontend/lib/api-client";
import { queryOptions } from "@tanstack/react-query";
import { gameKeys } from "./keys";

const getGame = async (id: string) => {
  const response = await apiClient.game[":id"].$get({
    param: {
      id,
    },
  });

  const data = await response.json();

  return data;
};

export const gameQueryOptions = (id: string) =>
  queryOptions({
    queryKey: gameKeys.single(id),
    queryFn: () => getGame(id),
  });

export const getGames = async () => {
  const response = await apiClient.game.$get();
  const data = await response.json();

  return data;
};

export const gamesQueryOptions = () =>
  queryOptions({
    queryKey: gameKeys.all,
    queryFn: () => getGames(),
  });
