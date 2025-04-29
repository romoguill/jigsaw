import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameSessionKeys } from "./keys";
import { apiClient } from "@/frontend/lib/api-client";
import { GameState } from "@jigsaw/shared";

export const useCreateGameSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gameId,
      gameState,
    }: {
      gameId: number;
      gameState?: GameState;
    }) => {
      const response = await apiClient.game.sessions.$post({
        json: { gameId, gameState },
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameSessionKeys.all });
    },
  });
};
