import {app} from "electron"
import {ZuiMain} from "../zui-main"

export function initialize(main: ZuiMain) {
  const brimCustomProtocol = "zui"
  app.setAsDefaultProtocolClient(brimCustomProtocol)
  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      // handle custom protocol url handling for windows here
      if (arg.startsWith(`${brimCustomProtocol}://`)) return main.openUrl(arg)
    }
  })
}
