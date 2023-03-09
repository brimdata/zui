const assert = require("assert")
const zealot = require("../")
const cases = require("./shared-tests")

describe("CJS Zealot Version", async () => {
  cases({assert, zealot})
})
