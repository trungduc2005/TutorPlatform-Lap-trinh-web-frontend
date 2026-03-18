const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";
const wsUrl = import.meta.env.VITE_WS_URL?.trim() || (apiBaseUrl ? `${apiBaseUrl}/ws-chat` : "");

export const env = {
  apiBaseUrl,
  wsUrl,
};
