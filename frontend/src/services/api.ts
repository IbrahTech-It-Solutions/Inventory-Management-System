const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not configured.");
}

export class NetworkError extends Error {
  constructor(message = "Unable to connect to the server.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class ApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  signal?: AbortSignal;
};

export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestOptions,
): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      options,
    );
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export { API_URL };