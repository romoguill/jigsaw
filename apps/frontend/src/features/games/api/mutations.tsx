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
      const response = await apiClient["game-sessions"].$post({
        json: { gameId, gameState },
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameSessionKeys.all });
    },
  });
};

export const useUpdateGameSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      gameState,
      timer,
      isFinished,
    }: {
      sessionId: string;
      gameState: GameState;
      timer: number;
      isFinished: boolean;
    }) => {
      await apiClient["game-sessions"][":id"].$put({
        param: { id: sessionId },
        json: { gameState, timer, isFinished },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameSessionKeys.all });
    },
  });
};
