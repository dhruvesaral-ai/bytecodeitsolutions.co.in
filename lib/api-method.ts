import { BACKEND_URL } from "@/config";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  customHeaders?: Record<string, string>
): Promise<T | null> {
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  const url = `${BACKEND_URL.replace(/\/+$/, "")}/${cleanEndpoint}`;

  const headers: Record<string, string> = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...customHeaders,
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      cache: "no-store",
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    // If local dev server (port 3001) is not running, fallback to production API
    if (url.includes("localhost:3001")) {
      const fallbackUrl = `https://admin.bytecode.co.in/api/${cleanEndpoint}`;
      try {
        response = await fetch(fallbackUrl, {
          method,
          cache: "no-store",
          headers: Object.keys(headers).length > 0 ? headers : undefined,
          body: body === undefined ? undefined : JSON.stringify(body),
        });
      } catch {
        throw error;
      }
    } else {
      throw error;
    }
  }

  if (!response.ok) {
    const responseBody = await response.text();
    const detail = responseBody ? `: ${responseBody}` : "";
    throw new ApiRequestError(
      `${method} ${url} failed (${response.status} ${response.statusText})${detail}`,
      response.status
    );
  }

  const responseBody = await response.text();
  return responseBody ? (JSON.parse(responseBody) as T) : null;
}

export function get<T>(endpoint: string, headers?: Record<string, string>): Promise<T | null> {
  return request<T>("GET", endpoint, undefined, headers);
}

export function post<T>(
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T | null> {
  return request<T>("POST", endpoint, body, headers);
}

export function put<T>(
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T | null> {
  return request<T>("PUT", endpoint, body, headers);
}

export function patch<T>(
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T | null> {
  return request<T>("PATCH", endpoint, body, headers);
}

export function deleteRequest<T>(
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T | null> {
  return request<T>("DELETE", endpoint, body, headers);
}

export { deleteRequest as delete };
