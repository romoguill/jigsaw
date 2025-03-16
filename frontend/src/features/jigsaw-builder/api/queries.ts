import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { pathKeys } from "./keys";

const route = apiClient.api.game.builder.path.$post;

type RequestType = InferRequestType<typeof route>;

export const usePaths = (json: RequestType["json"]) =>
  useQuery({
    queryKey: pathKeys.all,
    queryFn: async () => {
      const res = await route({ json });
      const { data } = await res.json();

      return data;
    },
  });
