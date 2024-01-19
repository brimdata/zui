/* @jest-environment jsdom */

import {SystemTest} from "src/test/system"
import {quickLoadFiles} from "./quick-load-files"

new SystemTest("quick-load")

test("pcap", async () => {
  await quickLoadFiles({files: ["/Users/jkerr/Downloads/VanSpy.pcapng"]})
})
