import { HTTPException } from "hono/http-exception";
import { LocalHono } from "../../../../types/LocalHono";
import {
  EnableMonitoringInput,
  routerInterfaceSchema,
} from "../../../../schema/router-interface.schema";
import validate from "../../../../middlewares/validate";
import { routerInterfaceService } from "../../../../service/router_interface.service";
import { sendSuccess } from "../../../../utils/send_response";
import {
  genKey,
  getRouterChan,
  removeRouterChan,
  routerChan,
} from "../../../../lib/routeros/store";
import { stopInterfaceTraffic } from "../../../../lib/routeros/router_interface";
import { runningInterfaceService } from "../../../../service/running_interface.service";

const rDisable = new LocalHono();

rDisable.post(
  "",
  validate("json", routerInterfaceSchema.enableOrDisableMonitoringSchema),
  async (c) => {
    const { interfaceId } = c.req.valid("json") as EnableMonitoringInput;

    const { routerId } = c.req.query();
    if (!routerId) {
      throw new HTTPException(404, {
        message: "routerId are required",
      });
    }

    const iface = await routerInterfaceService.findByInterfaceId(interfaceId);

    if (!iface) {
      throw new HTTPException(404, {
        message: "RouterInterface not found",
      });
    }

    if (iface.router_id?.toString() !== routerId) {
      throw new HTTPException(400, {
        message: "routerId does not match with interface",
      });
    }

    await stopInterfaceTraffic(routerId, iface.interface_id);
    await runningInterfaceService.remove(iface.interface_id, routerId);

    return sendSuccess(c, {
      message: "Monitoring disabled",
      data: {
        interfaceId,
        routerId,
      },
    });
  }
);

export default rDisable;
