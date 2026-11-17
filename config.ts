const isDev = false;

export const SITE_URL = "https://bytecode.co.in";

export const BACKEND_URL = isDev
  ? "http://localhost:3001/api/"
  : "https://admin.bytecode.co.in/api/";

export const MEDIA_BASE_URL = isDev
  ? "http://localhost:3001"
  : "https://admin.bytecode.co.in";
