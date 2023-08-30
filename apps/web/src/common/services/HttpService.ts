import { z } from "zod";

type QueryParams = Record<string, string | number | Array<string | number>>;

export type RequestParams<Schema extends z.ZodTypeAny> = RequestInit & {
  responseType?: "json" | "text";
  responseSchema: Schema;
  query?: QueryParams;
};

export function HttpService(fetcher: typeof fetch = fetch) {
  async function request<ResponseSchema extends z.ZodTypeAny>(
    url: string,
    params: RequestParams<ResponseSchema>
  ): Promise<z.infer<ResponseSchema>> {
    const { responseSchema, responseType = "json", query } = params;
    const response = await fetcher(attachQueryToUrl(url, query), params);

    if (!response.ok) {
      throw new Error("fetch response status status not ok", {
        cause: response,
      });
    }
    const data = await response[responseType]();
    return responseSchema.parse(data);
  }

  function attachQueryToUrl(url: string, query?: QueryParams): string {
    if (!query || !Object.keys(query)) return url;

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        for (const entry of value) {
          searchParams.append(key, String(entry));
        }
        continue;
      }

      searchParams.append(key, String(value));
    }

    return `${url}?${searchParams.toString()}`;
  }

  return {
    get: <ResponseSchema extends z.ZodTypeAny>(
      url: string,
      params: RequestParams<ResponseSchema>
    ): Promise<z.infer<ResponseSchema>> =>
      request<ResponseSchema>(url, { ...params, method: "GET" }),
  };
}
export type HttpService = ReturnType<typeof HttpService>;
