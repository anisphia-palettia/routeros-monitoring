import { HTTPException } from "hono/http-exception";
import validate from "../../middlewares/validate";
import { router, RouterCreateInput } from "../../schema/router.schema";
import { routerosService } from "../../service/router.service";
import { LocalHono } from "../../types/LocalHono";
import { sendSuccess } from "../../utils/send_response";

const rRouter = new LocalHono();

rRouter.post("", validate("json", router.create), async (c) => {
  const data = c.req.valid("json") as RouterCreateInput;
  const existingRouter = await routerosService.findByHost(data.host);
  if (existingRouter) {
    throw new HTTPException(400, { message: "Host already exists" });
  }
  await routerosService.create(data);
  return sendSuccess(c, {
    status: 201,
    message: "Successfully create new router connection",
    data: {
      host: data.host,
      port: data.port,
    },
  });
});

export default rRouter;
