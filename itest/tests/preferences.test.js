/* @flow */
import path from "path"

import {
  defaultModalButton,
  ingestProgressBar,
  jsonTypeConfigInput,
  viewerResults
} from "../../src/js/test/locators"
import {stdTest} from "../lib/jest"
import createTestBrim from "../lib/createTestBrim"
import testDataDir from "../lib/env"

const config = path.join(testDataDir(), "custom-schema.json")

describe("Preferences Modal Tests", () => {
  const brim = createTestBrim("preferences.test")

  stdTest("setting a custom json type config", async (done) => {
    brim.clickAppMenuItem("preferences")
    await brim.setValue(jsonTypeConfigInput, config)
    await brim.click(defaultModalButton)
    await brim.ingest("custom-sample.ndjson")
    await brim.waitUntil(() => brim.isNotVisible(ingestProgressBar))

    expect(await brim.getText(viewerResults)).toMatchSnapshot()
    done()
  })
})
