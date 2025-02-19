import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { currentUserKey } from "./queries";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currentUserKey });
    },
  });
}
