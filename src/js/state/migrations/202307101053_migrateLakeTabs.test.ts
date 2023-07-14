import {migrate} from "src/test/unit/helpers/migrate"
import {getAllRendererStates} from "./utils/getTestState"
import {removeLakeFromUrl} from "./202307101053_migrateLakeTabs"

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

test("migrates tabs by lake", async () => {
  const next = await migrate({state: "v1.1.0", to: "202307101053"})
  const renderers = getAllRendererStates(next)
  const tabs = renderers[0].window.tabs
  expect(Object.keys(tabs)).toEqual(["localhost:9867", "_GYFJwbx6Pi2hd2WEbJEd"])
  expect(tabs["localhost:9867"].active).not.toBe(null)
  expect(tabs["localhost:9867"].data.length).toBe(4)
  expect(tabs["_GYFJwbx6Pi2hd2WEbJEd"].active).not.toBe(null)
  expect(tabs["_GYFJwbx6Pi2hd2WEbJEd"].data.length).toBe(3)
})

test("migrates lakeIds", async () => {
  const next = await migrate({state: "v1.1.0", to: "202307101053"})
  const renderers = getAllRendererStates(next)
  const lakeId = renderers[0].window.lakeId

  expect(lakeId).toEqual("_GYFJwbx6Pi2hd2WEbJEd")
})

test("migrates urls", async () => {
  const next = await migrate({state: "v1.1.0", to: "202307101053"})
  const renderers = getAllRendererStates(next)
  const renderer = renderers[0]
  const tabs = renderer.window.tabs
  const tabIds = Object.values(tabs).flatMap((t: any) =>
    t.data.map((t) => t.id)
  )
  expect(tabIds.length).toBe(7)

  const urls = tabIds.flatMap(
    (id) => renderer.tabHistories.entities[id].entries
  )

  expect(urls).toMatchInlineSnapshot(`
    Array [
      "/",
      "/pools/0x113a39e374d0d717f2081ce5dce50c1b02e45596",
      "/queries/jMdii4s7QvQKpX51Vq92f/versions/0",
      "/queries/5iuvkVdsYr4UHv1dvF1Kf/versions/YvqQANhI7njj1knyOuETg",
      "/queries/5iuvkVdsYr4UHv1dvF1Kf/versions/ZgAxMm7u8dcDOf04JO7Rs",
      "/queries/5iuvkVdsYr4UHv1dvF1Kf/versions/0",
      "/queries/5iuvkVdsYr4UHv1dvF1Kf/versions/iyjo1VwkRdGBqm8mvL1YH",
      "/pools/new",
      "/queries/T3K0Sbol7c-kF3sqcMA5r/versions/4heTpnp6lnAC7I8hTp8Wa",
      "/",
      "/queries/_qiRMPmZW4BctVSIGDJrj/versions/0",
      "/queries/bHVYnzpbgUpquNpkWpmRi/versions/KAkp5Z2zu-KaeBhM-bpzE",
      "/pools/0x113b4190a7f5e84d8519bfb34b38ed268c502588",
    ]
  `)
})
