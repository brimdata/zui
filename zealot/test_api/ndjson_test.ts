import {
  createZealot,
  assertEquals,
  createFakeZqd,
  assertThrowsAsync
} from "./helper/mod.ts"

function setup() {
  const zqd = createFakeZqd(9999)
  const zealot = createZealot("localhost:9999")
  return {zqd, zealot}
}

Deno.test("test with valid ndjson", async () => {
  const VALID_NDJSON = `{"test": 1}


{"test": 2}


{"test": 3}`

  const {zqd, zealot} = setup()
  zqd.respondWith(VALID_NDJSON)
  const resp = await zealot.search("*")
  const messages = await resp.array()

  assertEquals(messages, [{test: 1}, {test: 2}, {test: 3}])
  zqd.close()
})

Deno.test("test with invalid ndjson", async () => {
  const INVALID_NDJSON = `{"test": 1}


panic: Major problem here man, no json in sight
  - src/js/components/bad.ts
  - src/js/components/real.ts
  - src/js/components/this.ts
`
  const {zqd, zealot} = setup()
  zqd.respondWith(INVALID_NDJSON)
  const resp = await zealot.search("*")
  const error = await assertThrowsAsync(() => resp.array())
  assertEquals(
    error.toString(),
    `UnexpectedServerResponse: Expected ndjson but received "panic: Major problem here man, no json in sight
  - src/js/components/bad.ts
  - src/js/components/real.ts
  - src/js/components/this.ts
"`
  )
  zqd.close()
})
