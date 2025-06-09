import { createClient } from "@redis/client";
import { logger } from "./logger";

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  logger.error("[FAILED CONNECT] Redis", err);
  process.exit(0);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("[CONNECTED] Redis");
  }
}
