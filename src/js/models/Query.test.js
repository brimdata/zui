import Query from "./Query"

test("hasAnalytics when false", () => {
  let query = new Query({filter: "168.129.1.1"})

  expect(query.hasAnalytics()).toBe(false)
})

test("hasAnalytics when true", () => {
  let query = new Query({filter: "* | count()"})

  expect(query.hasAnalytics()).toBe(true)
})
