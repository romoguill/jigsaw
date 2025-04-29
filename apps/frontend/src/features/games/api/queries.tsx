import { queryOptions } from "@tanstack/react-query";
import { gameSessionKeys } from "./keys";
import { apiClient } from "@/frontend/lib/api-client";

export const gameSessionQueryOptions = (gameId: number) =>
  queryOptions({
    queryKey: gameSessionKeys.single(gameId.toString()),
    queryFn: async () => {
      const response = await apiClient.game.sessions[":id"].$get({
        param: { id: gameId.toString() },
      });

      return response.json();
    },
  });
