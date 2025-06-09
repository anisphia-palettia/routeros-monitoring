import mongoose from "mongoose";
import { MONGO_URI } from "../config/app_config";
import { logger } from "./logger";

export default async function connectDb() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("[CONNECTED] Mongodb");
  } catch (error) {
    logger.error("[FAILED CONNECT] Mongodb", error);
    process.exit(0);
  }
}
