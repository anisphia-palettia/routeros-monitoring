import { HTTPException } from "hono/http-exception";
import { routerInterfaceService } from "../../service/router_interface.service";
import { IRouterInterface } from "../../types/RouterConfig";
import { connectRouteros, disconnectRouteros } from "./manage";
import { routerosService } from "../../service/router.service";
import { logger } from "../logger";
import { RouterOSAPI } from "node-routeros-v2";
import {
  genKey,
  getRouterChan,
  removeRouterChan,
  setRouterChan,
} from "./store";
import { interfaceTrafficService } from "../../service/interface_traffic.service";
import { InterfaceTraffic } from "../../model/interface-traffic";
import { runningInterfaceService } from "../../service/running_interface.service";

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

export async function startInterfaceTraffic(
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
    setRouterChan(key, chan);

    let resolved = false;

    chan.on("data", async (monit) => {
      const data: InterfaceTraffic = {
        router_interface_id: iface._id,
        tx: bitsToMegabits(monit["tx-bits-per-second"]),
        rx: bitsToMegabits(monit["rx-bits-per-second"]),
      };
      await interfaceTrafficService.create(data);
      if (!resolved) {
        resolved = true;
        resolve(data);
      }
    });

    chan.on("error", (err) => {
      if (!resolve) {
        resolved = true;
        logger.error("Stream error:", err.message);
        removeRouterChan(key);
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

    chan.on("close", async () => {
      await conn.close();
      logger.info(`${key} closed`);
    });
  });
}

export async function stopInterfaceTraffic(
  routerId: string,
  interfaceId: string
): Promise<boolean> {
  const key = `${routerId}:${interfaceId}`;
  const chan = getRouterChan(key);

  if (chan) {
    await chan.close(); // Tutup stream
    removeRouterChan(key); // Hapus dari map
    return true;
  }

  return false; // Tidak ada channel aktif
}

function bitsToMegabits(bits: string): number {
  return Number((Number(bits) / 1_000_000).toFixed(2));
}

export async function startMonitoringInterface() {
  const runningMonitoring = await runningInterfaceService.find();

  for (const running of runningMonitoring) {
    await startInterfaceTraffic(
      running.router_id.toString(),
      running.router_interface_id
    );
  }
  logger.info("[SUCCESS] interfaces monitoring started");
}
