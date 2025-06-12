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
  "=interface=ether1",
  "=once=",
]);
  // type Traffic = {
  //   id: string;
  //   rx_byte: string;
  //   tx_byte: string;
  // };

  // const traffics = response.map((data) => ({
  //   id: data[".id"],
  //   rx_byte: data["rx-byte"],
  //   tx_byte: data["tx-byte"],
  // }));

  // const traffic: Traffic = traffics[0];
  // // traffic.rx_byte = bytesToMegabits(traffic.rx_byte);
  // // traffic.tx_byte = bytesToMegabits(traffic.tx_byte);

  return response;
}

function bytesToMegabits(bytes: string): string {
  return ((Number(bytes) * 8) / 1_000_000).toFixed(2); // megabit (Mb)
}
