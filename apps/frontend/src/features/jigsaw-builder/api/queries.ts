import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { pathKeys } from "./keys";

const routePaths = apiClient.game.builder.path.$post;

type RequestType = InferRequestType<typeof routePaths>;
type Options = {
  enabled?: boolean;
};

export const usePaths = (
  json: RequestType["json"],
  opts: Partial<Options> = {}
) =>
  useQuery({
    queryKey: pathKeys.all,
    queryFn: async () => {
      const res = await routePaths({ json });
      const { data } = await res.json();

      return data;
    },
    enabled: opts.enabled ?? true,
    staleTime: 5,
  });

export const usePath = (
  json: RequestType["json"] & { imgSrc: string },
  opts: Partial<Options> = {}
) =>
  useQuery({
    queryKey: pathKeys.single({
      imgSrc: json.imgSrc,
      cols: json.cols,
      rows: json.rows,
    }),
    queryFn: async () => {
      const res = await routePaths({ json });
      const { data } = await res.json();

      return data;
    },
    enabled: opts.enabled ?? true,
    staleTime: 5,
  });
