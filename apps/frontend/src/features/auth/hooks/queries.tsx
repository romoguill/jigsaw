import { authClient } from "@/frontend/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@jigsaw/shared";

export const currentUserKey = ["current-user"];

export const currentUserQueryOptions = () => ({
  queryKey: currentUserKey,
  queryFn: async (): Promise<User | null> => {
    const { data, error } = await authClient.getSession();

    if (error) {
      return null;
    }

    // THERE IS AN ERROR IN THE LIBRARY TYPES. DATA CAN BE NULL, DONT DELETE THIS.
    if (!data) {
      return null;
    }

    return data.user as unknown as User | null;
  },
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: 3,
});

export const useCurrentUser = () => {
  return useQuery(currentUserQueryOptions());
};
