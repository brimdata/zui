import {setupApi} from "src/test/unit/helpers/setup-api"
import BrimcapPlugin from "./brimcap-plugin"
import {normalize} from "path"

test("brimcap path", () => {
  const api = setupApi()
  const plugin = new BrimcapPlugin(api)
  const path = normalize("/test/app/zdeps/brimcap")
  const match = new RegExp(`${path}(.exe)?`)
  expect(plugin.brimcapBinPath).toMatch(match)
})
