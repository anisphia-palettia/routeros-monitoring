import { RouterOSAPI } from "node-routeros-v2";
import { IRouterosConfig } from "../../types/RouterConfig";
import { logger } from "../logger";
import { HTTPException } from "hono/http-exception";

export async function connectRouteros(config: IRouterosConfig): Promise<RouterOSAPI> {
  const conn = new RouterOSAPI({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    keepalive: true,
  });

  conn.on("error", (err) => {
    logger.error(`[MikroTik Error] ${config.host}:`, err);
  });

  try {
    await conn.connect();
    logger.info(`[CONNECTED] MikroTik: ${config.host}`);
    return conn;
  } catch (err) {
    logger.error(`[FAILED CONNECT] MikroTik: ${config.host}`, err);
    throw new HTTPException(500, { message: `Failed to connect to MikroTik ${config.host}` });
  }
}

export async function disconnectRouteros(conn: RouterOSAPI) {
  try {
    await conn.close();
    logger.info(`[DISCONNECTED] MikroTik`);
  } catch (err) {
    logger.error(`[ERROR DISCONNECTING] MikroTik:`, err);
  }
}
