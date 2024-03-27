import {AssetUrl} from "./asset-url"

test("node module asset", () => {
  const asset = new AssetUrl(
    "app-asset://zui/node_modules/monaco/worker.js#worker"
  )
  expect(asset.relativeUrl).toBe("monaco/worker.js")
  expect(asset.isNodeModule).toBe(true)
})

test("public asset", () => {
  const asset = new AssetUrl("app-asset://zui/search.html?id=123&name=abc")
  expect(asset.relativeUrl).toBe("search.html")
})
