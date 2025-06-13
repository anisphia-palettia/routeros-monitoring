import { HTTPException } from "hono/http-exception";
import { LocalHono } from "../../../../types/LocalHono";
import {
  EnableMonitoringInput,
  routerInterfaceSchema,
} from "../../../../schema/router-interface.schema";
import validate from "../../../../middlewares/validate";
import { routerInterfaceService } from "../../../../service/router_interface.service";
import { sendSuccess } from "../../../../utils/send_response";
import { startInterfaceTraffic } from "../../../../lib/routeros/router_interface";
import { genKey, getRouterChan } from "../../../../lib/routeros/store";
import { runningInterfaceService } from "../../../../service/running_interface.service";

const rEnable = new LocalHono();

rEnable.post(
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

    await routerInterfaceService.updateMonitoringStatus(
      routerId,
      interfaceId,
      true
    );

    const key = genKey(routerId, iface.interface_id);
    const isChan = getRouterChan(key);

    if (isChan) {
      throw new HTTPException(400, {
        message: "Router interface monitoring enabled",
      });
    }

    await startInterfaceTraffic(routerId, interfaceId);

    await runningInterfaceService.createOrUpdate(iface.interface_id, routerId);

    return sendSuccess(c, {
      message: "Monitoring enabled",
      data: {
        interfaceId,
        routerId,
      },
    });
  }
);

export default rEnable;
