import {
  createZealot,
  assertEquals,
  createFakeLake,
  assertThrowsAsync
} from "./helper/mod.ts"

function setup() {
  const lake = createFakeLake(9999)
  const zealot = createZealot("localhost:9999")
  return {lake, zealot}
}

Deno.test("test with valid ndjson", async () => {
  const VALID_NDJSON = `{"test": 1}


{"test": 2}


{"test": 3}`

  const {lake, zealot} = setup()
  lake.respondWith(VALID_NDJSON)
  const resp = await zealot.search("*")
  const messages = await resp.array()

  assertEquals(messages, [{test: 1}, {test: 2}, {test: 3}])
  lake.close()
})

Deno.test("test with invalid ndjson", async () => {
  const INVALID_NDJSON = `{"test": 1}


panic: Major problem here man, no json in sight
  - src/js/components/bad.ts
  - src/js/components/real.ts
  - src/js/components/this.ts
`
  const {lake, zealot} = setup()
  lake.respondWith(INVALID_NDJSON)
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
  lake.close()
})
