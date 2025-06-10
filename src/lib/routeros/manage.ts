import { RouterOSAPI } from "node-routeros-v2";
import { routerosService } from "../../service/router.service";
import { RouterosConfig } from "../../types/RouterConfig";
import { logger } from "../logger";

export const routerosConn = new Map<string, RouterOSAPI>();

export async function initRouterosConnection() {
  const configs = await routerosService.get();

  for (const config of configs) {
    await connectRouteros(config);
  }
}

export async function connectRouteros(config: RouterosConfig) {
  if (routerosConn.has(config._id.toString())) {
    logger.warn(`[ALREADY CONNECTED] MikroTik ID: ${config._id}`);
    return;
  }

  const conn = new RouterOSAPI({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    keepalive: true,
  });

  try {
    await conn.connect();
    routerosConn.set(config._id.toString(), conn);
    logger.info(`[CONNECTED] MikroTik: ${config.host}`);

    startRouterosPing(config._id.toString(), conn);

    conn.on("error", (err) => {
      logger.error(`[MikroTik Error] ${config.host}`, err);
    });
  } catch (err) {
    logger.error(`[FAILED CONNECT] MikroTik: ${config.host}`, err);
  }
}

const routerosPingers = new Map<string, NodeJS.Timeout>();

function startRouterosPing(_id: string, conn: RouterOSAPI) {
  const interval = setInterval(async () => {
    try {
      const response = await conn.write(
        "/ping",
        "=address=8.8.8.8",
        "=count=1"
      );
      const success = response.some((r) => r["time"]);
      logger.info(
        `[PING] ${_id} ${success ? "✅" : "❌"} time: ${response[0].time}`
      );
    } catch (error: any) {
      logger.warn(`[PING FAILED] ${_id} - ${error.message}`);
    }
  }, 5000);

  routerosPingers.set(_id, interval);
}

export async function disconnectAllRouterosConnection() {
  for (const [id, conn] of routerosConn.entries()) {
    try {
      await conn.close();
      logger.info(`[DISCONNECTED] MikroTik ID: ${id}`);
    } catch (err) {
      logger.error(`[FAILED TO DISCONNECT] MikroTik ID: ${id}`, err);
    }
  }
  routerosConn.clear();
}
