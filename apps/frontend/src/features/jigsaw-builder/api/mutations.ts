import { apiClient } from "@/frontend/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { jigsawBuilderKeys } from "./keys";

const apiRoute = apiClient.game.builder.$post;
type ReqType = InferRequestType<typeof apiRoute>;

export const useBuilderCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: ReqType["json"] }) => {
      await apiRoute({
        json: { ...data },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jigsawBuilderKeys.all });
    },
  });
};
