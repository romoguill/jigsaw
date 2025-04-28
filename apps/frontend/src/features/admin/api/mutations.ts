import { apiClient } from "@/frontend/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameKeys } from "../../jigsaw/api/keys";

export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.game[":id"].$delete({ param: { id: id.toString() } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameKeys.all });
    },
  });
};
