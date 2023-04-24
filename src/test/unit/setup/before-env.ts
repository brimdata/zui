import log from "electron-log"

log.transports.console.level = "error"

if (!("window" in global)) {
  // @ts-ignore
  global.window = {
    location: {
      search: "?name=search",
    },
  }
}
