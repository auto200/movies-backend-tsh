import { z, ZodFirstPartyTypeKind } from 'zod';

import { isPlainObject } from '@/utils';

type QueryParams = Record<string, string | number | Array<string | number>>;
type PayloadBody = RequestInit['body'] | object;
type ResponseType = 'json' | 'text';

export type RequestParams<Schema extends z.ZodTypeAny> = Omit<RequestInit, 'body'> & {
  body?: PayloadBody;
  query?: QueryParams;
  responseSchema: Schema;
  responseType?: ResponseType;
};

export function HttpService(fetcher: typeof fetch = fetch) {
  async function request<ResponseSchema extends z.ZodTypeAny>(
    url: string,
    params: RequestParams<ResponseSchema>
  ): Promise<z.infer<ResponseSchema>> {
    const {
      body,
      headers,
      query,
      responseSchema,
      responseType = inferResponseTypeFromResponseSchema(responseSchema),
    } = params;

    const response = await fetcher(attachQueryToUrl(url, query), {
      ...params,
      body: formatBody(body),
      headers: extendHeaders(headers, body),
    });

    // TODO: better error formatting
    if (!response.ok) {
      const error = new Error('fetch response status status not ok', {
        cause: response,
      });
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
    const data: unknown = await response[responseType]();

    // TODO: better error formatting
    // we infer the type from schema,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return responseSchema.parse(data);
  }

  return {
    get: <ResponseSchema extends z.ZodTypeAny>(
      url: string,
      params: RequestParams<ResponseSchema>
    ): Promise<z.infer<ResponseSchema>> =>
      request<ResponseSchema>(url, { ...params, method: 'GET' }),

    post: <ResponseSchema extends z.ZodTypeAny>(
      url: string,
      params: RequestParams<ResponseSchema>
    ): Promise<z.infer<ResponseSchema>> =>
      request<ResponseSchema>(url, { ...params, method: 'POST' }),
  };
}
export type HttpService = ReturnType<typeof HttpService>;

function attachQueryToUrl(url: string, query?: QueryParams): string {
  if (!query || !Object.keys(query).length) return url;

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

  const paramsString = searchParams.toString();
  if (paramsString.length === 0) return url;

  return `${url}?${paramsString}`;
}

function formatBody(body: PayloadBody): RequestInit['body'] {
  if (isPlainObject(body)) {
    return JSON.stringify(body);
  }

  return body;
}

function extendHeaders(headers: RequestInit['headers'], body: PayloadBody): RequestInit['headers'] {
  return {
    ...headers,
    ...(isPlainObject(body) ? { 'Content-Type': 'application/json' } : {}),
  };
}
// NOTE: add other object like schemas, like enums if needed
const JSON_SERIALIZABLE_SCHEMAS = [ZodFirstPartyTypeKind.ZodObject, ZodFirstPartyTypeKind.ZodArray];

function inferResponseTypeFromResponseSchema<T extends z.ZodTypeAny>(
  responseSchema: T
): ResponseType {
  // every zod validator has defined 'typeName'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  if (JSON_SERIALIZABLE_SCHEMAS.includes(responseSchema._def.typeName)) {
    return 'json';
  }

  return 'text';
}
