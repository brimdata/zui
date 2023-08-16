import {app} from "electron"
import {MainObject} from "../../core/main/main-object"

export function initialize(main: MainObject) {
  const brimCustomProtocol = "zui"
  app.setAsDefaultProtocolClient(brimCustomProtocol)
  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      // handle custom protocol url handling for windows here
      if (arg.startsWith(`${brimCustomProtocol}://`)) return main.openUrl(arg)
    }
  })
}
