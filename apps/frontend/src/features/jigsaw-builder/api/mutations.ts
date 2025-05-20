import { apiClient } from "@/frontend/lib/api-client";
import type { GameCreationProgress } from "@jigsaw/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { jigsawBuilderKeys } from "./keys";

const apiRoute = apiClient.game.builder.$post;
type ReqType = InferRequestType<typeof apiRoute>;

export const useBuilderCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      // onProgress,
    }: {
      data: ReqType["json"];
      onProgress?: (progress: GameCreationProgress) => void;
    }) => {
      const response = await apiRoute({
        json: { ...data },
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jigsawBuilderKeys.all });
    },
  });
};
