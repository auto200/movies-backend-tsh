import { z } from 'zod';

type QueryParams = Record<string, string | number | Array<string | number>>;

export type RequestParams<Schema extends z.ZodTypeAny> = RequestInit & {
  query?: QueryParams;
  responseSchema: Schema;
  responseType?: 'json' | 'text';
};

export function HttpService(fetcher: typeof fetch = fetch) {
  async function request<ResponseSchema extends z.ZodTypeAny>(
    url: string,
    params: RequestParams<ResponseSchema>
  ): Promise<z.infer<ResponseSchema>> {
    const { query, responseSchema, responseType = 'json' } = params;
    const response = await fetcher(attachQueryToUrl(url, query), params);

    // TODO: better error formatting
    if (!response.ok) {
      throw new Error('fetch response status status not ok', {
        cause: response,
      });
    }
    const data: unknown = await response[responseType]();
    // TODO: better error formatting
    // we infer the type from schema,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
      request<ResponseSchema>(url, { ...params, method: 'GET' }),
  };
}
export type HttpService = ReturnType<typeof HttpService>;
