import { useQuery } from "@tanstack/react-query";
import { getPuzzleData } from "../../../lib/utils";

export const usePuzzleData = () =>
  useQuery({
    queryKey: ["jigsaw-data"],
    queryFn: async () => await getPuzzleData(),
  });
