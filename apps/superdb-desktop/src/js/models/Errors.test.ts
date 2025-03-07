import ErrorFactory from "./ErrorFactory"

const TEST_CASES = {
  UnauthorizedError: [
    new Error("Need boom credentials"),
    "anything with unauthorized in it",
    {type: "UNAUTHORIZED", error: "unauthorized"},
  ],

  InternalServerError: [{type: "INTERNAL_ERROR", error: "Fun Time"}],

  NetworkError: ["Failed to fetch"],

  NoPoolsError: ["NoPools"],

  NotFoundError: [{type: "NOT_FOUND"}],

  PoolNotFoundError: [{type: "SPACE_NOT_FOUND", error: "pool james not found"}],

  InvalidUrlError: ["Failed to parse URL"],

  SearchError: [{type: "SEARCH_ERROR"}],
}

describe("ErrorFactory#create", () => {
  const ErrorClasses = Object.keys(TEST_CASES)

  ErrorClasses.forEach((klass) => {
    test(`${klass}`, () => {
      const errors = TEST_CASES[klass]

      errors.forEach((error) => {
        const brimError = ErrorFactory.create(error)
        expect(brimError.type).toBe(klass)

        const negative = ErrorFactory.create("Negative")
        expect(negative).not.toBe(klass)
      })
    })
  })
})
