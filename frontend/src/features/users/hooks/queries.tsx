import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../../../../../shared/types";

export const currentUserKey = ["current-user"];

export const useCurrentUser = () =>
  useQuery({
    queryKey: currentUserKey,
    queryFn: async (): Promise<User> => {
      const { data, error } = await authClient.getSession();

      if (error) {
        throw new Error(error.message);
      }

      return data.user as User;
    },
  });
