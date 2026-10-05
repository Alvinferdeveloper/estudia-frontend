import axios from "axios";
import { env } from "@/config/env";

// Single entry point to the API: base URL and the session cookie on every request.
export const api = axios.create({ baseURL: env.apiUrl, withCredentials: true });

// For clients that take a URL instead of an axios call (AI SDK transports, fetch in middleware).
export const apiUrl = (path: string): string => `${env.apiUrl}${path}`;
