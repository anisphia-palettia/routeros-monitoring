import winston from "winston";
import Transport from "winston-transport";
import { NODE_ENV } from "../config/app_config";

const LevelColors: Record<string, string> = {
  error: "\x1b[31m", // Merah
  warn: "\x1b[33m", // Kuning
  info: "\x1b[36m", // Cyan
  http: "\x1b[35m", // Magenta
  verbose: "\x1b[34m", // Biru
  debug: "\x1b[90m", // Abu-abu
};

class SimpleConsoleTransport extends Transport {
  constructor(opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  override log(info: any, callback: () => void): void {
    setImmediate(() => this.emit("logged", info));

    const { level, message, timestamp, stack } = info;
    const color = LevelColors[level] || "\x1b[0m";

    const output = `${color}[${timestamp}] ${level.toUpperCase()}:\x1b[0m ${message}`;
    console.log(output);

    if (stack) {
      console.log(`${color}${stack}\x1b[0m`);
    }

    if (callback) {
      callback();
    }
  }
}

export const logger = winston.createLogger({
  level: NODE_ENV === "PROD" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    ...(NODE_ENV !== "PROD"
      ? [
          new SimpleConsoleTransport({
            format: winston.format.combine(
              winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
              winston.format.errors({ stack: true })
            ),
          }),
        ]
      : []),
  ],
});
