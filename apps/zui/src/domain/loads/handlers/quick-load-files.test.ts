/* @jest-environment jsdom */

import {SystemTest} from "src/test/system"
import {quickLoadFiles} from "./quick-load-files"
import {getPath} from "zui-test-data"
import {loads} from "src/zui"

new SystemTest("quick-load")

test("pcap", (done) => {
  loads.on("error", (ref) => {
    expect(ref.errors[0]).toContain("zeekrunner exited with code 1")
    done()
  })

  quickLoadFiles({files: [getPath("vanspy.pcapng")]})
})
