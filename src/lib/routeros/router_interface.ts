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

export async function getInterfaceTraffic(
  routerId: string,
  interfaceId: string
) {
  const iface = await routerInterfaceService.findByInterfaceId(interfaceId);

  if (!iface) {
    throw new HTTPException(404, {
      message: "RouterInterface not found",
    });
  }

  if (iface.routerId?.toString() !== routerId) {
    throw new HTTPException(400, {
      message: "routerId does not match with interface",
    });
  }
  const conn = getRouterosConn(routerId);

  if (!conn) {
    throw new HTTPException(404, { message: "Router not found" });
  }

  const response = await conn.write("/interface/monitor-traffic", [
    "=interface=main",
    "=once=",
  ]);
  type Traffic = {
    id: string;
    rx_mb: string;
    tx_mb: string;
  };

  const traffics = response.map((data) => ({
    id: data[".id"],
    rx_mb: data["rx-bits-per-second"],
    tx_mb: data["tx-bits-per-second"],
  }));

  const traffic: Traffic = traffics[0];
  traffic.rx_mb = bitsToMegabits(traffic.rx_mb);
  traffic.tx_mb = bitsToMegabits(traffic.tx_mb);

  console.log(response);
  return traffic;
}

function bitsToMegabits(bits: string): string {
  return (Number(bits) / 1_000_000).toFixed(2); // dari bit → Megabit
}
