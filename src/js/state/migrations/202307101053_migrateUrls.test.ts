import {migrate} from "src/test/unit/helpers/migrate"
import {getAllStates, getAllWindowStates} from "./utils/getTestState"
import {removeLakeFromUrl} from "./202307101053_migrateUrls"

const expectations = {
  "/lakes/localhost:9867": "/",
  "/lakes/localhost:9867/query/123/version/2323": "/query/123/version/2323",
  "/lakes/localhost:9867/pool/123": "/pool/123",
  "/lakes/localhost:9867/release-notes": "/release-notes",
  "/lakes/123abc/welcome": "/welcome",
  "/welcome": "/welcome",
  "/pool/123": "/pool/123",
  "/": "/",
}

for (const key in expectations) {
  test("regex works for " + key, () => {
    expect(removeLakeFromUrl(key)).toBe(expectations[key])
  })
}

function collectAllUrls(state) {
  let urls = []
  for (const window of getAllStates(state)) {
    const histories = window.tabHistories
    if (!histories) continue

    for (const id in histories.entities) {
      urls = urls.concat(histories.entities[id].entries)
    }
  }
  return urls
}

test("migrating 202307101053_migrateUrls", async () => {
  const next = await migrate({state: "v1.0.1", to: "202307101053"})

  const urls = collectAllUrls(next)
  expect(urls).toEqual([
    "/",
    "/pools/new",
    "/pools/0x1139f717ead61a50518e8af0af9fa70836893148",
    "/queries/vYXJGwpRlfWYc3VEwzwhw/versions/4MSGELmT0aatQA-0EBUzB",
    "/queries/vYXJGwpRlfWYc3VEwzwhw/versions/Oy9bEnaX1Ho7dhqakXyNN",
    "/release-notes",
  ])

  const lakeIds = getAllWindowStates(next).map(
    (window) => window.current.lakeId
  )

  expect(lakeIds).toEqual(["localhost:9867"])
})
