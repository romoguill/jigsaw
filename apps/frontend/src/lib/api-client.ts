import { clientWithType } from "@jigsaw/api-client";

export const apiClient = clientWithType(import.meta.env.BASE_URL).api;
