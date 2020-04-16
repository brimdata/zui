/* @flow */
const path = require("path")
const {createLogger, format, transports} = require("winston")

export const LOGDIR = path.join(process.env.WORKSPACE || "run", "itest")

export const workspaceLogfile = (name: string) => path.join(LOGDIR, name)

// When the flow-typed update produces an error....
// flow-typed/npm/winston_v3.x.x.js
// [1] 124│     createLogger: <T>($winstonLoggerConfig<T>) => $winstonLogger<T>,
// $FlowFixMe
export const LOG = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.printf(({level, message, timestamp}) => {
      return `[${timestamp} ${level}]: ${message}`
    })
  ),
  transports: [
    new transports.Console({level: "info"}),
    // No idea how to make this runtime-configurable via command line. This has
    // mkdir -p semantics so the environment variable seems OK enough.
    new transports.File({
      filename: workspaceLogfile("itest.log"),
      level: "debug"
    })
  ]
})
