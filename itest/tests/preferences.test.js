/* @flow */
import path from "path"

import {
  defaultModalButton,
  jsonTypeConfigInput,
  viewerResults
} from "../../src/js/test/locators"
import {stdTest} from "../lib/jest"
import {testDataDir} from "../lib/env"
import createTestBrim from "../lib/createTestBrim"

const config = path.join(testDataDir(), "custom-schema.json")

describe("Preferences Modal Tests", () => {
  const brim = createTestBrim("preferences.test")

  stdTest("setting a custom json type config", async (done) => {
    brim.clickAppMenuItem("preferences")
    await brim.setValue(jsonTypeConfigInput, config)
    await brim.click(defaultModalButton)
    await brim.ingest("custom-sample.ndjson")
    await brim.search(
      "_path=conn proto=tcp | cut ts, src_ip, src_port, dst_ip, dst_port, proto | sort ts"
    )

    expect(await brim.getText(viewerResults)).toMatchSnapshot()
    done()
  })
})
