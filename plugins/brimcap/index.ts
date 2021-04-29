import BrimcapPlugin from "./brimcap-plugin"
import BrimApi from "../../src/js/api"

let brimcap: BrimcapPlugin

export const activate = (api: BrimApi) => {
  brimcap = new BrimcapPlugin(api)
  brimcap.init()
}

export const deactivate = () => {
  brimcap && brimcap.cleanup()
}
