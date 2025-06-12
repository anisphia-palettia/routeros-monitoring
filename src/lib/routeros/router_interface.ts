import { HTTPException } from "hono/http-exception";
import { routerInterfaceService } from "../../service/router_interface.service";
import { IRouterInterface } from "../../types/RouterConfig";
import { connectRouteros, disconnectRouteros } from "./manage";
import { routerosService } from "../../service/router.service";
import { logger } from "../logger";
import { RouterOSAPI } from "node-routeros-v2";
import { genKey, routerChan } from "./store";

export async function syncRouterInterfaces(routerId: string): Promise<void> {
  const config = await routerosService.findById(routerId);

  if (!config) {
    throw new HTTPException(404, {
      message: "RouterOS not found",
    });
  }

  let conn: RouterOSAPI | null = null;

  try {
    conn = await connectRouteros(config);

    const response = await conn.write("/interface/print");

    if (!Array.isArray(response)) {
      throw new Error("Invalid response from RouterOS");
    }

    for (const item of response) {
      const data: IRouterInterface = {
        interface_id: item[".id"],
        name: item["name"],
        default_name: item["default-name"] ?? null,
        type: item["type"],
      };

      await routerInterfaceService.createOrUpdate(routerId, data);
    }
  } catch (err) {
    logger.error(`[SYNC FAILED] RouterID: ${routerId}`, err);
    throw new HTTPException(500, { message: "Failed to sync interfaces" });
  } finally {
    if (conn) {
      await disconnectRouteros(conn);
    }
  }
}

export async function getInterfaceTraffic(
  routerId: string,
  interfaceId: string
): Promise<any> {
  const iface = await routerInterfaceService.findByInterfaceId(interfaceId);

  if (!iface) {
    throw new HTTPException(404, {
      message: "RouterInterface not found",
    });
  }

  if (iface.router_id.toString() !== routerId) {
    throw new HTTPException(400, {
      message: "routerId does not match with interface",
    });
  }

  const config = await routerosService.findById(routerId);
  if (!config) {
    throw new HTTPException(404, { message: "Router not found" });
  }

  const conn = await connectRouteros(config);

  return new Promise((resolve, reject) => {
    const chan = conn.writeStream("/interface/monitor-traffic", [
      `=interface=${iface.name}`,
    ]);

    const key = genKey(routerId, interfaceId);
    routerChan.set(key, chan);

    let resolved = false;

    chan.on("data", (data) => {
      console.log("Traffic data:", data);
      if (!resolved) {
        resolved = true;
        resolve(data);
      }
    });

    chan.on("done", () => {
      console.log("Monitoring started successfully");
    });

    chan.on("error", (err) => {
      if (!resolve) {
        resolved = true;
        console.error("Stream error:", err.message);
        routerChan.delete(key);
        chan.close();
        reject(
          new HTTPException(400, {
            message:
              err.message +
              ". Interface name may be invalid. Please sync interface data.",
          })
        );
      }
    });
  });
}

function bitsToMegabits(bits: string): string {
  return (Number(bits) / 1_000_000).toFixed(2);
}
