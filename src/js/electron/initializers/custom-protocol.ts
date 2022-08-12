import {app} from "electron"
import {BrimMain} from "../brim"

export function initialize(main: BrimMain) {
  const brimCustomProtocol = "brim"
  app.setAsDefaultProtocolClient(brimCustomProtocol)
  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      // handle custom protocol url handling for windows here
      if (arg.startsWith(`${brimCustomProtocol}://`)) return main.openUrl(arg)
    }
  })
}
