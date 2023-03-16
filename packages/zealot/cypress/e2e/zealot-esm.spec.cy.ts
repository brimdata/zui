import * as zealot from "../../dist/esm/index.mjs"

async function main() {
  const cases = await import("../../test/shared-tests.js")

  describe("ES Module Zealot Client", () => {
    cases({assert, zealot})
  })
}

main()
