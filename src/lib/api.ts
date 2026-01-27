// src/lib/api.ts
export const API_BASE_URL = "https://api.revenueinfra.com";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
