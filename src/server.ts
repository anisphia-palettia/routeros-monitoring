import "dotenv/config";
import "reflect-metadata";
import { APP_PORT } from "./config/app_config";
import connectDb from "./lib/mongodb";
import { logger } from "./lib/logger";
import app from "./app";
import { serve } from "@hono/node-server";
import { connectRedis } from "./lib/redis";

function server() {
  logger.info(`[RUNNING] Server port : ${APP_PORT}`);
  return serve({
    fetch: app.fetch,
    port: Number(APP_PORT),
  });
}

async function main() {
  await connectRedis();
  await connectDb();
  server();

  process.on("SIGINT", async () => {
    logger.info("[SIGINT] Closing connection...");
    logger.info("[CLOSED] Connection. Bye!");
    process.exit(0);
  });
}
main();
