import { clientWithType } from "@jigsaw/api-client";

export const apiClient = clientWithType("/", {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, init);

    if (!response.ok) {
      const error = await response.text();
      console.log(error);
      throw new Error(error);
    }

    return response;
  },
}).api;
