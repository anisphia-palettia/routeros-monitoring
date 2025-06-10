import { getRouterInterface } from "../../lib/routeros/router_interface";
import { LocalHono } from "../../types/LocalHono";
import { sendSuccess } from "../../utils/send_response";

const rInterfaces = new LocalHono();
rInterfaces.get("", async (c) => {
  await getRouterInterface("68479a299b94283e05524172");
  return sendSuccess(c, {
    message: "Success",
  });
});
export default rInterfaces;
