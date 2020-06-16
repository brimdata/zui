/* @flow */
import path from "path"

import {
  defaultModalButton,
  jsonTypeConfigInput
} from "../../src/js/test/locators"
import {getResults} from "../lib/appStep/api/search"
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
      "_path=conn proto=tcp | cut ts, src_ip, src_port, dst_ip, dst_port, proto | sort ts | head 10"
    )

    expect(await getResults(brim.getApp())).toMatchSnapshot()
    done()
  })
})
