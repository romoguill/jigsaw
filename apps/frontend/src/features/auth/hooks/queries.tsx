import { authClient } from "@/frontend/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@jigsaw/shared";

export const currentUserKey = ["current-user"];

export const useCurrentUser = () => {
  return useQuery({
    queryKey: currentUserKey,
    queryFn: async (): Promise<User | undefined> => {
      const { data, error } = await authClient.getSession();

      if (error) {
        return undefined;
      }

      // THERE IS AN ERROR IN THE LIBRARY TYPES. DATA CAN BE NULL, DONT DELETE THIS.
      if (!data) {
        return undefined;
      }

      return data.user as unknown as User | undefined;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
  });
};
