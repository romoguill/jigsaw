import { queryOptions } from "@tanstack/react-query";
import { gameSessionKeys } from "./keys";
import { apiClient } from "@/frontend/lib/api-client";

export const gameSessionQueryOptions = (sessionId: string) =>
  queryOptions({
    queryKey: gameSessionKeys.single(sessionId),
    queryFn: async () => {
      const response = await apiClient.game.sessions[":id"].$get({
        param: { id: sessionId },
      });

      return response.json();
    },
  });
