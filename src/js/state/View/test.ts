import initTestStore from "test/unit/helpers/initTestStore"
import View from "./"

let store, reduce
beforeEach(() => {
  store = initTestStore()
  reduce = store.dispatchAll
})

test("showing the downloads bar", () => {
  const state = reduce([View.showDownloads()])

  expect(View.getDownloadsIsOpen(state)).toBe(true)
})

test("hiding the downloads bar", () => {
  const state = reduce([View.showDownloads(), View.hideDownloads()])

  expect(View.getDownloadsIsOpen(state)).toBe(false)
})
