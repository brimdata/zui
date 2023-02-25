import BrimcapPlugin from "./brimcap-plugin"
import ZuiApi from "src/js/api/zui-api"

let brimcap: BrimcapPlugin

export const activate = (api: ZuiApi) => {
  brimcap = new BrimcapPlugin(api)
  brimcap.init()
}

export const deactivate = async () => {
  brimcap && (await brimcap.cleanup())
}
