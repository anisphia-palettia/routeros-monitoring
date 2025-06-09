import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { NODE_ENV } from "../config/app_config";

type ApiResponseSuccess<T = any> = {
  success: boolean;
  data?: T;
  message: string;
  token?: string;
};

type ApiResponseError = {
  success: boolean;
  error: {
    message: string;
    details?: any;
    stack?: string;
  };
};

export function sendSuccess<T = any>(
  c: Context,
  {
    message,
    status = 200,
    data,
    token,
  }: {
    message: string;
    status?: ContentfulStatusCode;
    data?: T;
    token?: string;
  }
) {
  return c.json<ApiResponseSuccess>(
    {
      success: true,
      message: message,
      data: data,
      token: token,
    },
    status
  );
}

export function sendError(
  c: Context,
  {
    message,
    detail,
    stack,
    status,
  }: {
    message: string;
    detail?: any;
    stack?: string;
    status: ContentfulStatusCode;
  }
) {
  return c.json<ApiResponseError>(
    {
      success: false,
      error: {
        message: message,
        details: detail,
        ...(NODE_ENV !== "PROD" ? { stack } : {}),
      },
    },
    status
  );
}
