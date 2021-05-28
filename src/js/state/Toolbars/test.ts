import initTestStore from "test/unit/helpers/initTestStore"
import Toolbars from "./index"
import {ToolbarItem} from "./index"

const item1: ToolbarItem = {
  command: "testCommand",
  icon: "testIcon",
  id: "item1",
  disabled: false,
  label: "testLabel1",
  order: 0
}

let select, dispatch, store
beforeEach(() => {
  store = initTestStore()
  dispatch = store.dispatch
  select = (f) => f(store.getState())
})

test("Adding items", () => {
  const item2 = {
    ...item1,
    id: "item2",
    order: 1
  }

  // add one to search
  dispatch(Toolbars.createItem({toolbarId: "search", item: item1}))
  expect(select(Toolbars.allToolbarItems("search"))).toHaveLength(1)
  expect(select(Toolbars.getToolbarItem("search", item1.id))).toEqual(item1)

  // add second to search
  dispatch(Toolbars.createItem({toolbarId: "search", item: item2}))
  expect(select(Toolbars.allToolbarItems("search"))).toEqual([item1, item2])

  // add one to detail
  dispatch(Toolbars.createItem({toolbarId: "detail", item: item1}))
  expect(select(Toolbars.allToolbarItems("detail"))).toHaveLength(1)
  expect(select(Toolbars.getToolbarItem("detail", item1.id))).toEqual(item1)
})

test("Updating an item", () => {
  dispatch(Toolbars.createItem({toolbarId: "search", item: item1}))

  const itemChanges = {
    disabled: true,
    icon: "newIcon"
  }

  dispatch(
    Toolbars.updateItem({
      toolbarId: "search",
      itemId: item1.id,
      item: itemChanges
    })
  )
  expect(select(Toolbars.allToolbarItems("search"))).toHaveLength(1)
  expect(select(Toolbars.getToolbarItem("search", item1.id))).toEqual({
    ...item1,
    ...itemChanges
  })
})
