import { HTTPException } from "hono/http-exception";
import { routerInterfaceService } from "../../service/router_interface.service";
import { IRouterInterface } from "../../types/RouterConfig";
import { getRouterosConn } from "./manage";

export async function syncRouterInterfaces(routerId: string): Promise<void> {
  const conn = getRouterosConn(routerId);
  if (!conn) {
    throw new HTTPException(404, { message: "Router not found" });
  }

  const response = await conn.write("/interface/print");

  for (const item of response) {
    const data: IRouterInterface = {
      interface_id: item[".id"],
      name: item["name"],
      default_name: item["default-name"] ?? null,
      type: item["type"],
      isMonitoring: false,
    };

    await routerInterfaceService.createOrUpdate(routerId, data);
  }
}
