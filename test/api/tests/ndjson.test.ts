import {createZealot} from "zealot"
import {setupServer} from "msw/node"
import {rest} from "msw"
import {json} from "d3"
import src from "electron-log"

const server = setupServer()

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

let zealot
beforeEach(() => {
  zealot = createZealot("localhost:9999")
})

const VALID_NDJSON = `{"test": 1}\n\n\n{"test": 2}\n\n\n{"test": 3}`
test("with valid ndjson", async () => {
  server.use(
    rest.post("http://localhost:9999/search", (req, res, ctx) => {
      return res(ctx.status(200), ctx.text(VALID_NDJSON))
    })
  )

  const resp = await zealot.search("*")
  const messages = await resp.array()

  expect(messages).toEqual([{test: 1}, {test: 2}, {test: 3}])
})

const INVALID_NDJSON = `{"test": 1}

panic: Major problem here man, no json in sight
  - src/js/components/bad.ts
  - src/js/components/real.ts
  - src/js/components/this.ts
`

test("with invalid ndjson", async () => {
  server.use(
    rest.post("http://localhost:9999/search", (req, res, ctx) => {
      return res(ctx.status(200), ctx.text(INVALID_NDJSON))
    })
  )

  const resp = await zealot.search("*")
  return expect(() => resp.array()).rejects.toMatchInlineSnapshot(`
            [UnexpectedServerResponse: Expected ndjson but received "{"test": 1}

            panic: Major problem here man, no json in sight
              - src/js/components/bad.ts
              - src/js/components/real.ts
              - src/js/components/this.ts
            "]
          `)
})
