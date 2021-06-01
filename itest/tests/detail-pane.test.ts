import itest from "itest/lib/itest"
import {toLower} from "lodash"

describe("Detail Pane", () => {
  // Names of the sections to test for
  const FIELDS = "fields"
  const UID = "correlation"
  const ALERTS = "related alerts"
  const HISTORY = "conn history"
  const CONNECTIONS = "related connections"
  const MD5 = "md5 correlation"

  const [brim, $] = itest("detail-pane")
  beforeAll(async () => {
    await brim.ingest("ifconfig.zng")
    await brim.search("")
    await brim.clickAppMenuItem("toggle-right-pane")
  })

  // Helper function to perform the common actions
  async function testDetailHeaders(path, sectionNames) {
    await brim.click($.viewerCellContaining(path))
    const sections = await brim.findAll($.detailPaneSections)
    const headers = await Promise.all(sections.map((s) => s.getText()))
    expect(headers.map(toLower)).toEqual(expect.arrayContaining(sectionNames))
  }

  test("for capture loss", () => {
    return testDetailHeaders("capture_loss", [FIELDS])
  })

  test("for stats", () => {
    return testDetailHeaders("stats", [FIELDS])
  })

  test("for alert", () => {
    return testDetailHeaders("alert", [FIELDS, ALERTS, CONNECTIONS])
  })

  test("for file", () => {
    return testDetailHeaders("files", [FIELDS, MD5])
  })

  test("for http", () => {
    return testDetailHeaders("files", [FIELDS, UID])
  })

  test("for conn", () => {
    return testDetailHeaders("conn", [FIELDS, UID, HISTORY])
  })
})
