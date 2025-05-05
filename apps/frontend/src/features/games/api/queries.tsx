import { queryOptions } from "@tanstack/react-query";
import { gameSessionKeys } from "./keys";
import { apiClient } from "@/frontend/lib/api-client";

const getSession = async (sessionId: string) => {
  const response = await apiClient["game-sessions"][":id"].$get({
    param: { id: sessionId },
  });

  return response.json();
};

export const gameSessionQueryOptions = (sessionId: string) =>
  queryOptions({
    queryKey: gameSessionKeys.single(sessionId),
    queryFn: () => getSession(sessionId),
  });

const getSessions = async () => {
  const response = await apiClient["game-sessions"].$get();

  return response.json();
};

export const gameSessionsQueryOptions = () =>
  queryOptions({
    queryKey: gameSessionKeys.all,
    queryFn: getSessions,
  });
