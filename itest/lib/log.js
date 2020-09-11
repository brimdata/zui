"use strict"
exports.__esModule = true
exports.LOG = void 0
var path_1 = require("path")
var winston_1 = require("winston")
var env_1 = require("./env")
// When the flow-typed update produces an error....
// flow-typed/npm/winston_v3.x.x.js
// [1] 124│     createLogger: <T>($winstonLoggerConfig<T>) => $winstonLogger<T>,
exports.LOG = winston_1.createLogger({
  level: "info",
  format: winston_1.format.combine(
    winston_1.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS"
    }),
    winston_1.format.printf(function(_a) {
      var level = _a.level,
        message = _a.message,
        timestamp = _a.timestamp
      return "[" + timestamp + " " + level + "]: " + message
    })
  ),
  transports: [
    new winston_1.transports.Console({level: "info"}),
    // mkdir -p semantics so the environment variable seems OK enough.
    new winston_1.transports.File({
      filename: path_1["default"].join(env_1.itestDir(), "itest.log"),
      level: "debug"
    })
  ]
})
