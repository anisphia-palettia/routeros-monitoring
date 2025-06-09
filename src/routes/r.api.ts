import { LocalHono } from "../types/LocalHono";
import rRouter from "./router/r.router";

const rApi = new LocalHono();

rApi.route("/router", rRouter);

export default rApi;
