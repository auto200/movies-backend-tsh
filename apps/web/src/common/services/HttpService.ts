import { z } from "zod";

export type RequestParams<Schema extends z.ZodTypeAny> = RequestInit & {
  responseType?: "json" | "text";
  responseSchema: Schema;
};

export function HttpService(fetcher: typeof fetch = fetch) {
  async function request<ResponseSchema extends z.ZodTypeAny>(
    url: string,
    params: RequestParams<ResponseSchema>
  ): Promise<z.infer<ResponseSchema>> {
    const { responseSchema, responseType = "json" } = params;
    const response = await fetcher(url, params);

    if (!response.ok) {
      throw new Error("fetch response status status not ok", {
        cause: response,
      });
    }
    const data = await response[responseType]();
    return responseSchema.parse(data);
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
