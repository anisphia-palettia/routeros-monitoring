import { HTTPException } from "hono/http-exception";
import { syncRouterInterfaces } from "../../../lib/routeros/router_interface";
import { LocalHono } from "../../../types/LocalHono";
import { sendSuccess } from "../../../utils/send_response";

const rSync = new LocalHono();

rSync.get("", async (c) => {
  const routerId = c.req.query("routerId");
  if (!routerId) {
    throw new HTTPException(404, { message: "routerId is missing" });
  }
  await syncRouterInterfaces(routerId);
  return sendSuccess(c, {
    message: "Success sync router interfaces",
  });
});
export default rSync;
