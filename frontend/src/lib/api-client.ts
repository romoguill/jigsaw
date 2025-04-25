import { type ApiType } from "../../../server/src/index";
import { hc } from "hono/client";

export const apiClient = hc<ApiType>(import.meta.env.BASE_URL).api;
