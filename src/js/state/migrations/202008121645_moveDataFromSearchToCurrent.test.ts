import getTestState from "../../test/helpers/getTestState"
import migrate from "./202008121645_moveDataFromSearchToCurrent"

test("migrating 202008121645_moveDataFromSearchToCurrent", () => {
  const {data} = getTestState("v0.14.0")

  const next = migrate(data)

  // @ts-ignore
  const tabs = Object.values(next.windows).flatMap((win) => win.state.tabs.data)

  expect(tabs[0].search.clusterId).toBe(undefined)
  expect(tabs[0].search.spaceId).toBe(undefined)
  expect(tabs[1].search.clusterId).toBe(undefined)
  expect(tabs[1].search.spaceId).toBe(undefined)

  expect(tabs[0].current.connectionId).toBe("zqd")
  expect(tabs[0].current.spaceId).toBe("sp_1fmLWxg0lO32tIbQMIEtUBjT4Ot")
  expect(tabs[1].current.connectionId).toBe("zqd")
  expect(tabs[1].current.spaceId).toBe("sp_1fmLUuIyIEKk4iFQAL6oqM8wj31")
})
