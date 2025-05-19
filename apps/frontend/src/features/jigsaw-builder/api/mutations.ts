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
      // Generate a progress ID on the client side
      // const progressId = crypto.randomUUID();

      // Set up SSE connection before starting the game creation
      // if (onProgress) {
      //   console.log(
      //     `${import.meta.env.VITE_API_URL}/api/game/builder/progress/${progressId}`
      //   );
      //   const eventSource = new EventSource(
      //     `/api/game/builder/progress/${progressId}`
      //   );

      //   eventSource.onmessage = (event) => {
      //     const progress = JSON.parse(event.data) as GameCreationProgress;
      //     onProgress(progress);

      //     if (progress.status === "completed" || progress.status === "error") {
      //       eventSource.close();
      //     }
      //   };

      //   eventSource.onerror = () => {
      //     eventSource.close();
      //     toast.error("Lost connection to progress updates");
      //   };
      // }

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
