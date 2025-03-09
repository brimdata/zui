import {migrate} from "src/test/unit/helpers/migrate"
import moveSidebarStateToAppearance from "./202110050923_moveSidebarStateToAppearance"
import {
  getAllStates,
  getAllTabs_before_202307101053,
} from "./utils/getTestState"

test("migrating 202110050923_moveSidebarStateToAppearance", async () => {
  const next = await migrate({state: "v0.24.0", to: "202110050923"})

  for (let tab of getAllTabs_before_202307101053(next)) {
    expect(tab.layout.leftSidebarIsOpen).toBe(undefined)
    expect(tab.layout.leftSidebarWidth).toBe(undefined)
    expect(tab.layout.sidebarSections).toBe(undefined)
  }

  for (let state of getAllStates(next)) {
    expect(state.appearance).toEqual({
      sidebarIsOpen: true,
      sidebarWidth: 230,
      sidebarSections: [
        {
          closedSize: 24,
          id: "pools",
          isOpen: true,
          min: 100,
          size: 223,
        },
        {
          closedSize: 24,
          id: "queries",
          isOpen: true,
          min: 100,
          size: 223,
        },
        {
          closedSize: 24,
          id: "history",
          isOpen: true,
          min: 100,
          size: 223,
        },
      ],
    })
  }
})

test("When there is no active tab", async () => {
  // Migrate right up until this one
  const next = await migrate({state: "v0.24.0", to: "202107271608"})

  for (let state of getAllStates(next)) {
    delete state.tabs
  }

  moveSidebarStateToAppearance(next)

  for (let state of getAllStates(next)) {
    expect(state).toHaveProperty("appearance")
    expect(state.appearance).toBe(undefined)
  }
})
