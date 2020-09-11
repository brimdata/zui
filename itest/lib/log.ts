import path from "path"
import {createLogger, format, transports} from "winston"
import {itestDir} from "./env"

// When the flow-typed update produces an error....
// flow-typed/npm/winston_v3.x.x.js
// [1] 124│     createLogger: <T>($winstonLoggerConfig<T>) => $winstonLogger<T>,

export const LOG = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS"
    }),
    format.printf(({level, message, timestamp}) => {
      return `[${timestamp} ${level}]: ${message}`
    })
  ),
  transports: [
    new transports.Console({level: "info"}), // No idea how to make this runtime-configurable via command line. This has
    // mkdir -p semantics so the environment variable seems OK enough.
    new transports.File({
      filename: path.join(itestDir(), "itest.log"),
      level: "debug"
    })
  ]
})
