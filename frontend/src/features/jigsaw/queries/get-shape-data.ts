import { useQuery } from "@tanstack/react-query";
import { getPuzzleData } from "../../../lib/utils";
import { apiClient } from "@/lib/api-client";

const getGame = async () => {};

export const usePuzzleData = () =>
  useQuery({
    queryKey: ["jigsaw-data"],
    queryFn: async () => await getPuzzleData(),
  });
