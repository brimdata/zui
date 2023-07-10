import {migrate} from "src/test/unit/helpers/migrate"

function removeLakeFromUrl(pathname) {
  if (/^\/lake\/.*\//.test(pathname)) {
    // Remove the lake segments from the url
    return "/" + pathname.split("/").slice(3).join("/")
  } else {
    return pathname
  }
}

const expectations = {
  "/lake/localhost:9867/query/123/version/2323": "/query/123/version/2323",
  "/lake/localhost:9867/pool/123": "/pool/123",
  "/lake/localhost:9867/release-notes": "/release-notes",
  "/lake/123abc/welcome": "/welcome",
  "/welcome": "/welcome",
  "/pool/123": "/pool/123",
  "/": "/",
}

for (const key in expectations) {
  test("regex works for " + key, () => {
    expect(removeLakeFromUrl(key)).toBe(expectations[key])
  })
}

test("migrating 202307101053_migrateUrls", async () => {
  const next = await migrate({state: "v1.0.1", to: "202307101053"})

  expect(next).toBe("what you'd expect")
})
