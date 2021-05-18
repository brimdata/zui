import initTestStore from "src/js/test/initTestStore"
import ContextMenus, {ContextMenuItem} from "./index"

const item1: ContextMenuItem = {
  command: "testCommand",
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
  dispatch(ContextMenus.createItem({ctxMenuId: "search", item: item1}))
  expect(select(ContextMenus.allContextMenuItems("search"))).toHaveLength(1)
  expect(select(ContextMenus.getContextMenuItem("search", item1.id))).toEqual(
    item1
  )

  // add second to search
  dispatch(ContextMenus.createItem({ctxMenuId: "search", item: item2}))
  expect(select(ContextMenus.allContextMenuItems("search"))).toEqual([
    item1,
    item2
  ])

  // add one to detail
  dispatch(ContextMenus.createItem({ctxMenuId: "detail", item: item1}))
  expect(select(ContextMenus.allContextMenuItems("detail"))).toHaveLength(1)
  expect(select(ContextMenus.getContextMenuItem("detail", item1.id))).toEqual(
    item1
  )
})

test("Updating an item", () => {
  dispatch(ContextMenus.createItem({ctxMenuId: "search", item: item1}))

  const itemChanges = {
    disabled: true,
    icon: "newIcon"
  }

  dispatch(
    ContextMenus.updateItem({
      ctxMenuId: "search",
      itemId: item1.id,
      item: itemChanges
    })
  )
  expect(select(ContextMenus.allContextMenuItems("search"))).toHaveLength(1)
  expect(select(ContextMenus.getContextMenuItem("search", item1.id))).toEqual({
    ...item1,
    ...itemChanges
  })
})
