const useLocalBackend = process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND === "true";

export const BACKEND_URL = useLocalBackend
  ? "http://localhost:3001/api/"
  : (process.env.NEXT_PUBLIC_BACKEND_URL || "https://admin.bytecode.co.in/api/");

export const MEDIA_BASE_URL = useLocalBackend
  ? "http://localhost:3001"
  : (process.env.NEXT_PUBLIC_MEDIA_URL || "https://admin.bytecode.co.in");
