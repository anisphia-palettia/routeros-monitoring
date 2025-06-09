import { Hono } from "hono";

export type AppContext = {
  Variables: {};
};

export class LocalHono extends Hono<AppContext> {}
