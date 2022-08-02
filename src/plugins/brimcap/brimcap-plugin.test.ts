import {setupApi} from "src/test/unit/helpers/setup-api"
import BrimcapPlugin from "./brimcap-plugin"

test("brimcap path", () => {
  const api = setupApi()
  const plugin = new BrimcapPlugin(api)

  expect(plugin.brimcapBinPath).toMatch(/\/test\/app\/zdeps\/brimcap(.exe)?/)
})
