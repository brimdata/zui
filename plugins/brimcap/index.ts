import BrimApi from "../../src/js/initializers/brimApi"
import BrimcapPlugin from "./brimcap-plugin"

let brimcap

export const activate = (api: BrimApi) => {
  brimcap = new BrimcapPlugin(api)
  brimcap.init()
}

export const deactivate = () => {
  brimcap && brimcap.cleanup()
}
