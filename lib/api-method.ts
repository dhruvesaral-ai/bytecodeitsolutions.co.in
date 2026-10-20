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
  body?: unknown
): Promise<T | null> {
  const url = `${BACKEND_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  const response = await fetch(url, {
    method,
    cache: "no-store",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

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

export function get<T>(endpoint: string): Promise<T | null> {
  return request<T>("GET", endpoint);
}

export function post<T>(endpoint: string, body: unknown): Promise<T | null> {
  return request<T>("POST", endpoint, body);
}

export function put<T>(endpoint: string, body: unknown): Promise<T | null> {
  return request<T>("PUT", endpoint, body);
}

export function patch<T>(endpoint: string, body: unknown): Promise<T | null> {
  return request<T>("PATCH", endpoint, body);
}

export function deleteRequest<T>(
  endpoint: string,
  body?: unknown
): Promise<T | null> {
  return request<T>("DELETE", endpoint, body);
}

export { deleteRequest as delete };
