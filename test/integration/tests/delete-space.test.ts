import createTestBrim from "test/integration/helpers/createTestBrim"
import {currentPoolItem} from "test/integration/helpers/locators"

describe("deleting a pool", () => {
  const brim = createTestBrim("delete-pool.test")

  test("delete a pool that is open", async () => {
    await brim.ingest("sample.zng")
    await brim.rightClick(currentPoolItem)
    await brim.clickContextMenuItem("Delete")
    await brim.hook("pool-deleted")
  })
})
