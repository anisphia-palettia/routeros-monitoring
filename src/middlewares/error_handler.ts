import { Context } from "hono";
import { ZodError } from "zod";
import { sendError } from "../utils/send_response";
import { HTTPException } from "hono/http-exception";

export default function errorHandler(error: any, c: Context) {
  if (error instanceof ZodError) {
    return sendError(c, {
      status: 400,
      message: `Validation error : ${error.name}`,
      detail: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  } else if (error instanceof HTTPException) {
    return sendError(c, {
      status: error.status,
      message: error.message,
      stack: error.stack,
    });
  }
  return sendError(c, {
    status: 500,
    message: error.message || "Internal server error",
    stack: error,
  });
}
