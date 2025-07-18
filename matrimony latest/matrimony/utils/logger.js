const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const { format } = winston;

// Log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Set log level based on NODE_ENV
const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "warn";
};

// Colors for log levels
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.colorize(),
  format.printf((info) => {
    const message =
      typeof info.message === "object"
        ? JSON.stringify(info.message, null, 2)
        : info.message;

    const rest = info[Symbol.for("splat")] || [];
    const restString = rest.length ? ` ${JSON.stringify(rest, null, 2)}` : "";

    return `${info.timestamp} ${info.level}: ${message}${restString}`;
  })
);

// Configure transports
const transports = [
  new DailyRotateFile({
    filename: "logs/%DATE%-error.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxFiles: "14d",
    maxSize: "20m",
  }),
  new DailyRotateFile({
    filename: "logs/%DATE%-combined.log",
    datePattern: "YYYY-MM-DD",
    level: "info",
    maxFiles: "30d",
    maxSize: "50m",
  }),
  new winston.transports.Console({
    format: logFormat,
  }),
];

// Create logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports,
});

// Handle uncaught exceptions and rejections
logger.exceptions.handle(
  new winston.transports.Console(),
  new DailyRotateFile({
    filename: "logs/%DATE%-exceptions.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    maxSize: "20m",
  })
);

logger.rejections.handle(
  new winston.transports.Console(),
  new DailyRotateFile({
    filename: "logs/%DATE%-rejections.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    maxSize: "20m",
  })
);

module.exports = logger;
